/* Offline, dependency-free recoloring of the existing raster OG card.
   Preserve the original 1200x630 artwork and text edges; use the shared industrial
   teal brand colors so social previews no longer show the previous electric blue. */
import fs from 'node:fs';
import {inflateSync,deflateSync} from 'node:zlib';

const signature=Buffer.from([137,80,78,71,13,10,26,10]);
const crcTable=Array.from({length:256},(_,i)=>{
 let n=i;for(let j=0;j<8;j++)n=n&1?(n>>>1)^0xEDB88320:n>>>1;return n>>>0;
});
function crc(data){let c=0xFFFFFFFF;for(const b of data)c=(c>>>8)^crcTable[(c^b)&255];return (c^0xFFFFFFFF)>>>0}
function pngChunk(type,data){
 const body=Buffer.concat([Buffer.from(type,'ascii'),data]),out=Buffer.alloc(body.length+8);
 out.writeUInt32BE(data.length,0);body.copy(out,4);out.writeUInt32BE(crc(body),body.length+4);return out;
}
function unpackRgb(input){
 const bytes=fs.readFileSync(input);
 if(!bytes.subarray(0,8).equals(signature))throw Error('Social card is not PNG');
 let pos=8,width=0,height=0,channels=0,idats=[];
 while(pos<bytes.length){
  const count=bytes.readUInt32BE(pos),type=bytes.toString('ascii',pos+4,pos+8);
  if(pos+12+count>bytes.length)throw Error('Truncated social PNG chunk');
  const data=bytes.subarray(pos+8,pos+8+count);pos+=count+12;
  if(type==='IHDR'){
   width=data.readUInt32BE(0);height=data.readUInt32BE(4);
   if(width!==1200||height!==630||data[8]!==8||data[9]!==2||data[12]!==0)
    throw Error('Unexpected social PNG format: expected 1200x630 8-bit RGB');
   channels=3;
  }else if(type==='IDAT')idats.push(data);else if(type==='IEND')break;
 }
 const raw=inflateSync(Buffer.concat(idats)),stride=width*channels,output=Buffer.alloc(width*height*channels);
 let offset=0,previous=Buffer.alloc(stride);
 for(let y=0;y<height;y++){
  const filter=raw[offset++],row=Buffer.alloc(stride);
  for(let x=0;x<stride;x++){
   const a=x>=channels?row[x-channels]:0,b=previous[x],c=x>=channels?previous[x-channels]:0;
   let predictor=0;
   if(filter===1)predictor=a;
   else if(filter===2)predictor=b;
   else if(filter===3)predictor=(a+b)>>>1;
   else if(filter===4){
    const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);
    predictor=pa<=pb&&pa<=pc?a:pb<=pc?b:c;
   }else if(filter!==0)throw Error('Unsupported PNG filtering: '+filter);
   row[x]=(raw[offset++]+predictor)&255;
  }
  row.copy(output,y*stride);previous=row;
 }
 return {width,height,output};
}
function recolor(rgb){
 const oldPaper=[246,248,252],newPaper=[245,247,247],white=[255,255,255];
 const palette=[
  [[21,103,232],[21,94,117]], [[31,110,233],[21,94,117]],
  [[22,41,68],[16,45,61]], [[21,40,66],[16,45,61]],
  [[16,24,39],[23,43,53]], [[102,117,138],[75,98,108]],
  [[203,227,255],[200,223,228]], [[224,231,240],[220,230,232]]
 ];
 for(let p=0;p<rgb.length;p+=3){
  const current=[rgb[p],rgb[p+1],rgb[p+2]];
  if(current.every(v=>v===255))continue;
  if(current.reduce((n,v,i)=>n+Math.abs(v-oldPaper[i]),0)<=5){
   rgb[p]=newPaper[0];rgb[p+1]=newPaper[1];rgb[p+2]=newPaper[2];continue;
  }
  let best=Infinity,target=null;
  for(const [source,dest] of palette)for(const [sourceBg,destBg] of [[white,white],[oldPaper,newPaper]]){
   const vec=source.map((v,i)=>v-sourceBg[i]),relative=current.map((v,i)=>v-sourceBg[i]);
   const length=vec.reduce((n,v)=>n+v*v,0)||1;
   const alpha=Math.max(0,Math.min(1,vec.reduce((n,v,i)=>n+v*relative[i],0)/length));
   const error=vec.reduce((n,v,i)=>n+(relative[i]-alpha*v)**2,0);
   if(error<best){
    best=error;target=dest.map((v,i)=>Math.round(destBg[i]+alpha*(v-destBg[i])));
   }
  }
  if(best<16&&target){rgb[p]=target[0];rgb[p+1]=target[1];rgb[p+2]=target[2]}
 }
}
export function recolorSocialCard(source,destination){
 const png=unpackRgb(source);
 recolor(png.output);
 const rowBytes=png.width*3,raw=Buffer.alloc(png.height*(rowBytes+1));
 let offset=0;
 for(let y=0;y<png.height;y++){
  raw[offset++]=0;png.output.copy(raw,offset,y*rowBytes,(y+1)*rowBytes);offset+=rowBytes;
 }
 const header=Buffer.alloc(13);
 header.writeUInt32BE(png.width,0);header.writeUInt32BE(png.height,4);header[8]=8;header[9]=2;
 const out=Buffer.concat([
  signature,pngChunk('IHDR',header),
  pngChunk('IDAT',deflateSync(raw,{level:9})),pngChunk('IEND',Buffer.alloc(0))
 ]);
 fs.writeFileSync(destination,out);
 return out.length;
}

/** Recognize owner email in original HTML or Cloudflare Email Obfuscation.
 * Detecting the address is NOT a test of SMTP delivery, inbox or replies.
 */
export function ownerEmailVisible(html,expectedEmail){
 if(typeof html!=='string'||typeof expectedEmail!=='string'||!expectedEmail)return false;
 if(html.toLowerCase().includes('mailto:'+expectedEmail.toLowerCase()))return true;
 const blocks=html.matchAll(/(?:data-cfemail=["']|\/cdn-cgi\/l\/email-protection#)([0-9a-f]{4,})/gi);
 for(const [,hex] of blocks){
  if(hex.length%2!==0)continue;
  try{
   const key=Number.parseInt(hex.slice(0,2),16),bytes=[];
   for(let i=2;i<hex.length;i+=2)bytes.push(Number.parseInt(hex.slice(i,i+2),16)^key);
   const decoded=new TextDecoder('utf-8',{fatal:true}).decode(new Uint8Array(bytes));
   if(decoded.toLowerCase()===expectedEmail.toLowerCase())return true;
  }catch{ /* Ignore malformed obfuscation sequences. */ }
 }
 return false;
}

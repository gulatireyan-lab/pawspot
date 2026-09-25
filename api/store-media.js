export const access = "public";
export const methods = ["GET"];

function clean(v){return String(v||"").trim().slice(0,500)}

function abs(base,value){
  try{return new URL(value,base).href}catch{return null}
}

export default async function(req,res){
  const url=clean(req.query?.url);
  if(!/^https?:\/\//i.test(url)) return res.status(400).json({images:[]});
  try{
    const r=await fetch(url,{headers:{"User-Agent":"PawSpot/1.0 (store-photo-preview)"}});
    if(!r.ok)return res.json({images:[]});
    const html=await r.text();
    const images=[];
    const add=v=>{const u=abs(url,v);if(u&&!images.includes(u)&&/^https?:/i.test(u))images.push(u)};
    const metaRe=/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
    let m;
    while((m=metaRe.exec(html))&&images.length<6)add(m[1]);
    const imgRe=/<img[^>]+(?:src|data-src)=["']([^"']+)["'][^>]*>/gi;
    while((m=imgRe.exec(html))&&images.length<6)add(m[1]);
    res.json({images});
  }catch(e){res.json({images:[]})}
}
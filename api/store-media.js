export const access = "public";
export const methods = ["GET"];

function clean(v){return String(v||"").trim().slice(0,500)}

function abs(base,value){
  const v=String(value||"").replace(/&amp;/g,"&").trim();
  if(/^https?:\/\//i.test(v))return v;
  try{return new URL(v,base).href}catch{return null}
}

export default async function(req,res){
  const url=clean(req.query?.url);
  if(!/^https?:\/\//i.test(url)) return res.status(400).json({images:[]});
  try{
    const r=await fetch(url,{headers:{"User-Agent":"PawSpot/1.0 (store-photo-preview)"}});
    if(!r.ok)return res.json({images:[]});
    const html=await r.text();
    const images=[];
    const add=(v,score=0)=>{
      const u=abs(url,v);
      if(!u||images.some(x=>x.url===u)||!/^https?:/i.test(u))return;
      images.push({url:u,score});
    };
    const metaRe=/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
    let m;
    while((m=metaRe.exec(html))&&images.length<12)add(m[1],2);
    const imgRe=/<img[^>]+([^>]*?)(?:src|data-src)=["']([^"']+)["']([^>]*)>/gi;
    while((m=imgRe.exec(html))&&images.length<30){
      const attrs=(m[1]+" "+m[3]).toLowerCase();
      const src=m[2];
      const hay=attrs+" "+src.toLowerCase();
      let score=0;
      if(/store|shop|salon|spa|gallery|exterior|interior|location|venue/.test(hay))score+=5;
      if(hay.includes("/services/")||hay.includes("/service-")||hay.includes("grooming"))score-=6;
      if(/logo|icon|avatar|favicon|badge|payment|whatsapp/.test(hay))score-=8;
      if(hay.includes("/store/")||hay.includes("store_")||hay.includes("store-"))score+=6;
      add(src,score);
    }
    images.sort((a,b)=>b.score-a.score);
    const storeImages=images.filter(x=>x.score>=5).slice(0,6);
    res.json({images:storeImages.map(x=>x.url)});
  }catch(e){res.json({images:[]})}
}
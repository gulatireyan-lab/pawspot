import { db } from "hatchable";

export const access = "public";
export const methods = ["GET"];

function clean(v){return String(v||"").trim().slice(0,160)}

export default async function(req,res){
  const q=clean(req.query?.q);
  if(!q) return res.json({results:[]});

  const {rows}=await db.query(
    "SELECT id,name,city,area,address,phone,rating,review_count,price_from,service_type,services,description,source_name,source_url,verified_status FROM grooming_centers WHERE LOWER(name||' '||city||' '||area||' '||address||' '||services) LIKE LOWER($1) ORDER BY rating DESC NULLS LAST, review_count DESC NULLS LAST LIMIT 30",
    ["%"+q+"%"]
  );

  let external=[];
  try{
    const url="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=12&addressdetails=1&q="+encodeURIComponent(q);
    const r=await fetch(url,{headers:{"User-Agent":"PawSpot/1.0 (pet-grooming-search)"}});
    if(r.ok){
      const data=await r.json();
      external=data
        .filter(x=>x.name && x.lat && x.lon)
        .map(x=>({
          id:"osm-"+x.osm_type+"-"+x.osm_id,
          name:x.name,
          city:x.address?.city||x.address?.town||x.address?.village||x.address?.municipality||"",
          area:x.address?.suburb||x.address?.neighbourhood||x.address?.quarter||"",
          address:x.display_name||"",
          phone:null,
          rating:null,
          review_count:null,
          price_from:null,
          service_type:"external",
          services:"Pet center / grooming listing",
          description:"Discovered from OpenStreetMap. Confirm services and opening details with the business before visiting.",
          source_name:"OpenStreetMap",
          source_url:"https://www.openstreetmap.org/"+x.osm_type+"/"+x.osm_id,
          verified_status:"external-source",
          lat:Number(x.lat),
          lon:Number(x.lon),
          external:true
        }));
    }
  }catch(e){}

  const seen=new Set(rows.map(x=>String(x.name).toLowerCase()+"|"+String(x.address).toLowerCase()));
  const merged=[...rows.map(x=>({...x,external:false})),...external.filter(x=>{
    const key=String(x.name).toLowerCase()+"|"+String(x.address).toLowerCase();
    if(seen.has(key)) return false;
    seen.add(key); return true;
  })];

  res.json({results:merged,source:"PawSpot + OpenStreetMap"});
}
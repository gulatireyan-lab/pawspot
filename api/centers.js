import { db } from "hatchable";
export const access = "public";
export const methods = ["GET"];
export default async function(req,res){const {rows}=await db.query("SELECT id,name,city,area,address,phone,rating,review_count,price_from,service_type,services,description,source_name,source_url,verified_status FROM grooming_centers ORDER BY rating DESC NULLS LAST, review_count DESC NULLS LAST");res.json(rows);}
import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function(req,res){const {phone,dog_name,breed}=req.body||{};await db.query("INSERT INTO pet_profiles (user_id,phone,dog_name,breed) VALUES ($1,$2,$3,$4) ON CONFLICT (user_id) DO UPDATE SET phone=EXCLUDED.phone,dog_name=EXCLUDED.dog_name,breed=EXCLUDED.breed,updated_at=now()",[req.user.id,phone||null,dog_name||null,breed||null]);res.json({ok:true});}
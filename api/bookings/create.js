import { db } from "hatchable";
export const access = "user";
export const methods = ["POST"];
export default async function(req,res){const {center_id,dog_name,service,booking_date,notes}=req.body||{};if(!center_id||!dog_name||!service||!booking_date)return res.status(400).json({error:"Missing booking details"});const r=await db.query("INSERT INTO bookings (user_id,center_id,dog_name,service,booking_date,notes) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id,status",[req.user.id,center_id,dog_name,service,booking_date,notes||null]);res.json(r.rows[0]);}
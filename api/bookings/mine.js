import { db } from "hatchable";
export const access = "user";
export const methods = ["GET"];
export default async function(req,res){const {rows}=await db.query("SELECT b.id,b.dog_name,b.service,b.booking_date,b.status,g.name AS center_name,g.area FROM bookings b JOIN grooming_centers g ON g.id=b.center_id WHERE b.user_id=$1 ORDER BY b.booking_date DESC",[req.user.id]);res.json(rows);}
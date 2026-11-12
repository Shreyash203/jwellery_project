import { z } from "zod";
import { products, shippingFor } from "../../../lib/products";
import { db } from "../../../lib/db";
export const runtime="nodejs";
const schema=z.object({customerName:z.string().trim().min(2).max(100),email:z.email().max(200),phone:z.string().regex(/^[6-9]\d{9}$/),address:z.string().trim().min(10).max(500),city:z.string().trim().min(2).max(100),postalCode:z.string().regex(/^[1-9]\d{5}$/),items:z.array(z.object({id:z.string(),quantity:z.number().int().min(1).max(10)})).min(1).max(30)});
export async function POST(request:Request){
 if(!process.env.DATABASE_URL)return Response.json({error:"Checkout is not enabled yet. Please contact the store to order."},{status:503});
 const host=request.headers.get("x-forwarded-host")||request.headers.get("host");
 const protocol=request.headers.get("x-forwarded-proto")||new URL(request.url).protocol.replace(":","");
 if(request.headers.get("origin")!==protocol+"://"+host)return Response.json({error:"Invalid request origin."},{status:403});
 if(Number(request.headers.get("content-length")||0)>20000)return Response.json({error:"Request too large."},{status:413});
 try{const result=schema.safeParse(await request.json());if(!result.success)return Response.json({error:"Please check your contact information, address, and cart."},{status:400});
 const {items,...customer}=result.data;
 if(new Set(items.map(i=>i.id)).size!==items.length)return Response.json({error:"Duplicate cart items."},{status:400});
 const lines=items.map(i=>{const p=products.find(p=>p.id===i.id);if(!p)throw new Error("INVALID_PRODUCT");return {id:p.id,name:p.name,price:p.price,quantity:i.quantity}});
 const subtotal=lines.reduce((s,i)=>s+i.price*i.quantity,0);
 const order=await db.order.create({data:{...customer,items:lines,total:subtotal+shippingFor(subtotal)}});
 return Response.json({id:order.id,total:order.total},{status:201});
 }catch(e){if(e instanceof SyntaxError||(e instanceof Error&&e.message==="INVALID_PRODUCT"))return Response.json({error:"Invalid cart or request."},{status:400});console.error("Order could not be saved");return Response.json({error:"We could not save your order. Please try again later."},{status:500})}
}
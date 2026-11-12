import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { products, shippingFor } from './products.js';
import { db } from './db.js';
const schema = z.object({
 customerName:z.string().trim().min(2).max(100), email:z.email().max(200),
 phone:z.string().regex(/^[6-9]\d{9}$/), address:z.string().trim().min(10).max(500),
 city:z.string().trim().min(2).max(100), postalCode:z.string().regex(/^[1-9]\d{5}$/),
 items:z.array(z.object({id:z.string(),quantity:z.number().int().min(1).max(10)})).min(1).max(30)
});
type OrderData = Omit<z.infer<typeof schema>,'items'> & {items:{id:string;name:string;price:number;quantity:number}[];total:number};
type Options = {frontendUrl?:string; saveOrder?:(data:OrderData)=>Promise<{id:string;total:number}>};
export function createApp(options:Options={}) {
 const app=express();
 const frontendUrl=(options.frontendUrl||process.env.FRONTEND_URL||'http://localhost:3000').replace(/\/$/,'');
 app.disable('x-powered-by');
 app.use(cors({origin:frontendUrl,methods:['GET','POST','OPTIONS'],allowedHeaders:['Content-Type']}));
 app.use(express.json({limit:'20kb'}));
 app.get('/api/health',(_req,res)=>{res.json({status:'ok'})});
 app.get('/api/products',(_req,res)=>{res.json({products})});
 app.post('/api/orders',async(req,res)=>{
  if(req.get('origin')!==frontendUrl){res.status(403).json({error:'Invalid request origin.'});return}
  const parsed=schema.safeParse(req.body);
  if(!parsed.success){res.status(400).json({error:'Please check your contact information, address, and cart.'});return}
  const {items,...customer}=parsed.data;
  if(new Set(items.map(i=>i.id)).size!==items.length){res.status(400).json({error:'Duplicate cart items.'});return}
  const lines=[];
  for(const item of items){const product=products.find(p=>p.id===item.id);if(!product){res.status(400).json({error:'Invalid product.'});return}lines.push({id:product.id,name:product.name,price:product.price,quantity:item.quantity})}
  if(!options.saveOrder&&!process.env.DATABASE_URL){res.status(503).json({error:'Checkout is not enabled yet. Please contact the store to order.'});return}
  const subtotal=lines.reduce((sum,item)=>sum+item.price*item.quantity,0);
  try{
   const data={...customer,items:lines,total:subtotal+shippingFor(subtotal)};
   const order=options.saveOrder?await options.saveOrder(data):await db.order.create({data});
   res.status(201).json({id:order.id,total:order.total});
  }catch{console.error('Order could not be saved');res.status(500).json({error:'We could not save your order. Please try again later.'})}
 });
 app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  const status=(error as {status?:number})?.status===413?413:400;
  res.status(status).json({error:status===413?'Request too large.':'Invalid request body.'});
 });
 return app;
}

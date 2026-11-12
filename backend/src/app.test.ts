import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './app.js';
const customer={customerName:'Test Customer',email:'test@example.com',phone:'9999999999',address:'Test address for automated testing',city:'Pune',postalCode:'411001'};
test('separate API validates orders and calculates authoritative totals',async()=>{
 let saved:unknown;
 const server=createApp({saveOrder:async data=>{saved=data;return {id:'test-order',total:data.total}}}).listen(0,'127.0.0.1');
 await new Promise<void>(resolve=>server.once('listening',resolve));
 const address=server.address();if(!address||typeof address==='string')throw Error('No port');
 const base=`http://127.0.0.1:${address.port}`;
 const post=(body:unknown,origin='http://localhost:3000')=>fetch(base+'/api/orders',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 try{
 const catalog=await fetch(base+'/api/products',{headers:{Origin:'http://localhost:3000'}});
 assert.equal(catalog.headers.get('access-control-allow-origin'),'http://localhost:3000');assert.ok((await catalog.json()).products.length>0);
 assert.equal((await post({},'https://other.example')).status,403);
 assert.equal((await post({})).status,400);
 assert.equal((await post({...customer,items:[{id:'n1',quantity:11}]})).status,400);
 assert.equal((await post({...customer,items:[{id:'unknown',quantity:1}]})).status,400);
 assert.equal((await post({...customer,items:[{id:'n1',quantity:1},{id:'n1',quantity:1}]})).status,400);
 const response=await post({...customer,total:1,items:[{id:'n1',quantity:2,price:1}]});
 assert.equal(response.status,201);assert.deepEqual(await response.json(),{id:'test-order',total:577});assert.deepEqual(saved,{...customer,items:[{id:"n1",name:"Golden Hour Pendant",price:249,quantity:2}],total:577});
 const freeShipping=await post({...customer,items:[{id:'n1',quantity:9}]});assert.equal((await freeShipping.json()).total,2241);
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()))}
});

test('database failure returns a safe error without claiming the order succeeded',async(t)=>{
 let attempts=0;
 t.mock.method(console,'error',()=>{});
 const server=createApp({frontendUrl:'http://localhost:3000',saveOrder:async()=>{
  attempts++;
  throw new Error('Simulated private database error');
 }}).listen(0,'127.0.0.1');
 await new Promise<void>(resolve=>server.once('listening',resolve));
 const address=server.address();if(!address||typeof address==='string')throw Error('No port');
 try{
  const response=await fetch(`http://127.0.0.1:${address.port}/api/orders`,{
   method:'POST',headers:{Origin:'http://localhost:3000','Content-Type':'application/json'},
   body:JSON.stringify({...customer,items:[{id:'n1',quantity:1}]})
  });
  assert.equal(response.status,500);
  assert.deepEqual(await response.json(),{error:'We could not save your order. Please try again later.'});
  assert.equal(attempts,1);
 }finally{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()))}
});

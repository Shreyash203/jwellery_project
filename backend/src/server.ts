import { createApp } from './app.js';
import { db } from './db.js';
const port=Number(process.env.PORT||4000);
const server=createApp().listen(port,'0.0.0.0',()=>console.log(`Backend listening on http://localhost:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{void db.$disconnect().finally(()=>process.exit(0))}));

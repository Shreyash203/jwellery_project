export const categories = ["All", "Necklaces", "Earrings", "Rings", "Bracelets", "Watches"];
export type Product = { id:string; name:string; category:string; price:number; image:string; tag?:string; description:string };
const image = (id:string) => "https://images.unsplash.com/"+id+"?w=1000&auto=format&fit=crop";
export const products:Product[] = [
{id:"n1",name:"Golden Hour Pendant",category:"Necklaces",price:249,image:image("photo-1611652022419-a9419f74343d"),tag:"Bestseller",description:"A delicate golden accent for everyday moments. Easy to layer, with a timeless silhouette."},
{id:"e1",name:"Everyday Gold Hoops",category:"Earrings",price:99,image:image("photo-1535632066927-ab7c9ab60908"),tag:"Under Rs.100",description:"Classic hoops for a white shirt, an evening dress, and everything in between."},
{id:"r1",name:"The Signature Ring",category:"Rings",price:199,image:image("photo-1605100804763-247f67b3557e"),description:"A simple statement with a timeless feel. Style solo or pair with your favourite ring stack."},
{id:"b1",name:"Little Moments Bracelet",category:"Bracelets",price:299,image:image("photo-1611591437281-460bfbe1220a"),tag:"New arrival",description:"A thoughtful finishing touch for your wrist. An effortless piece for gifting or keeping close."},
{id:"n2",name:"Pearl Story Necklace",category:"Necklaces",price:349,image:image("photo-1599643477877-530eb83abc8e"),description:"A little vintage charm, a little modern romance. A graceful necklace for your everyday collection."},
{id:"w1",name:"Vintage Muse Watch",category:"Watches",price:599,image:image("photo-1524805444758-089113d48a6d"),description:"Inspired by the classics. A versatile watch that brings a polished finish to your daily look."},
{id:"e2",name:"The Evening Edit",category:"Earrings",price:249,image:image("photo-1535632066927-ab7c9ab60908"),description:"For celebrations and days that deserve a little extra. Statement earrings with an elegant silhouette."}
];
export const money=(n:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
export const shippingFor=(n:number)=>n>=1999?0:79;
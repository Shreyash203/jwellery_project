import type { Metadata } from "next";
import "./globals.css";
export const metadata:Metadata={title:"Aura — Little luxuries, everyday",description:"Discover everyday jewellery, thoughtful gifts, and your next favourite accessory."};
export default function Layout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
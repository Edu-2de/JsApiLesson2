"use client";
import Link from "next/link";

export default function Header(){
      return(
            <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
                  <ul className="flex space-x-4">
                        <li><Link href="/" className="hover:underline">Home</Link></li>
                        <li><a href="/about" className="hover:underline">About</a></li>
                        <li><a href="/contact" className="hover:underline">Contact</a></li>
                  </ul>
            </div>
      )
}
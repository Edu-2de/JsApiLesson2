"use client";
import Link from "next/link";

export default function Header(){
      return(
            <div className=" bg-transparent text-gray-800 fixed top-0 left-0 w-full shadow-md">
                  <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                        <div className="text-lg font-bold">
                              <Link href="/">My Website</Link>
                        </div>
                        <ul className="flex space-x-4">
                              <li><Link href="/" className="hover:underline">Home</Link></li>
                              <li><Link  href="/about" className="hover:underline">About</Link></li>
                              <li><Link  href="/contact" className="hover:underline">Contact</Link></li>
                        </ul>
                        <div className="flex items-center space-x-4">
                              <Link href="/login" className="hover:underline">Login</Link>
                              <Link href="/signup" className="hover:underline">Sign Up</Link>
                        </div>
                  </div>
            </div>
      )
}
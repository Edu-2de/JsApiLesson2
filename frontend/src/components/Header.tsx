"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header(){
      const menuItems = [
            {name: "Home", href: "/"},
            {name: "About Us", href: "/about", 
                  subItems: [
                  {name: "Our Team", href: "/about/team"},
                  {name: "Our Mission", href: "/about/mission"},
            ]},
            {name: "Contact", href: "/contact",
                  subItems: [
                  {name: "Support", href: "/contact/support"},
                  {name: "Feedback", href: "/contact/feedback"},
            ]},
      ]

      const [user, setUser] = useState<{name: string, role: string} | null>(null);

      useEffect(() =>{
            const stored = localStorage.getItem("user");
            if(stored){
                  setUser(JSON.parse(stored));
            }
      }, []);



      return(
            <div className=" bg-transparent text-gray-800 fixed top-0 left-0 w-full z-10">
                  <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                        <div className="text-lg font-bold">
                              <Link href="/">My Website</Link>
                        </div>
                        <ul className="flex space-x-4">
                              {menuItems.map((item) => (

                                    <li key={item.name} className="relative group p-3 hover:text-gray-600 rounded-md cursor-pointer">
                                          <Link href={item.href} >
                                          {item.name}
                                          </Link>
                                          {item.subItems && (
                                                <ul className="absolute left-0 top-full mt-0 hidden group-hover:block bg-white shadow-lg rounded-md z-10 min-w-[160px]">
                                                      {item.subItems.map((subItem) => (
                                                      <li key={subItem.name} className="px-4 py-2 hover:bg-gray-100">
                                                            <Link href={subItem.href} className="block">
                                                                  {subItem.name}
                                                            </Link>
                                                      </li>
                                                      ))}
                                                </ul>
                                          )}   
                                    </li>
                                    ))}
                                    <li className="px-4 py-2 hover:bg-gray-100">
                                          {user?.role === "admin" ? (
                                                <Link href="/admin" className="block">
                                                      Admin Panel
                                                </Link>
                                          ) : null}
                                    </li>
                                 
                        </ul>
                   
                        <div className="flex items-center space-x-4">
                              {!user ?(
                                    <button>
                                          <Link href="/Login" className="bg-gray-800 text-white px-4 py-3 rounded hover:bg-white hover:text-gray-800 transition-all duration-500 ">
                                                Login
                                          </Link>
                                    </button>

                              ) : (
                                    <div className="flex items-center space-x-2">
                                          <span className="text-gray-800">Welcome, {user.name}</span>
                                          <button onClick={() => {
                                                localStorage.removeItem("user");
                                                setUser(null);
                                          }} className="bg-gray-800 text-white px-4 py-3 rounded hover:bg-white hover:text-gray-800 transition-all duration-500">
                                                Logout
                                          </button>
                                    </div>
                              )}
                              
                            
                            
                        </div>
                  </div>
            </div>
      )
}
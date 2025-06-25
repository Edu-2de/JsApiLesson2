"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
};

export default function ProductsPage() {

  useEffect(() => {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    if (!user || user.role !== "admin") {
      window.location.href = "/Login"; 
    }
  }, []);


  const [products, setProducts] = useState<Product[]>([]);

  async function handleDelete(productId: number) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = user?.token;

    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      setProducts(products => products.filter(p => p.id !== productId));
    }
  }

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
        <p className="text-gray-600 mb-6">Here you can manage your products.</p>
        <Link href="/Admin/Products/Create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Create New Product
        </Link>
      </div>
      {products.map(product => (
        <div key={product.id} className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-gray-600">Price: ${product.price}</p>
          <p className="text-gray-600">Stock: {product.stock}</p>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={384}
            className="w-full h-48 object-cover mt-4 rounded"
            style={{ width: "100%", height: "12rem" }}
          />
        
          <div className="mt-4">
            <Link href={`/Admin/Products/Edit/${product.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2">
              Edit
            </Link>
            <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
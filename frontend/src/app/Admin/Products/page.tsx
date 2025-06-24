"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const [products, setProducts] = useState<Product[]>([]);

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
          <p className="text-gray-600">Category: {product.category}</p>
          <p className="text-gray-600">Image: {product.imageUrl}</p>
          <div className="mt-4">
            <Link href={`/Admin/Products/edit/${product.id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2">
              Edit
            </Link>
            <Link href={`/Admin/Products/delete/${product.id}`} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
              Delete
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
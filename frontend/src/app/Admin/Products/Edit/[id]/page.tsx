"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
};

export default function EditProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const params = useParams();
  const id = params && (params.id || params['id']);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando produto...</p>
      </div>
    );
  }

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = user?.token;
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const updatedProduct = await response.json();
    console.log(updatedProduct);
  }


  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            name="name" // <-- Adicione isto
            className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            placeholder="Enter product name"
            defaultValue={product.name}
          />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                        name="description" // <-- Adicione isto
                        className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="Enter product description"
                        defaultValue={product.description}
                  ></textarea>
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                        type="number"
                        name="price" // <-- Adicione isto
                        className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="Enter product price"
                        defaultValue={product.price}
                  />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                        type="number"
                        name="stock" // <-- Adicione isto
                        className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="Enter product stock"
                        defaultValue={product.stock}
                  />
                  </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  {/* Mostra a imagem atual, se houver */}
                  {product.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="mb-2 w-full h-32 object-contain rounded border"
                    />
                  )}
                  <input
                    type="file"
                    name="image"
                    className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                  />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                        type="text"
                        name="category" // <-- Adicione isto
                        className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                        placeholder="Enter product category"
                        defaultValue={product.category}
                  />
                  </div>
                  <button
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                  Update Product
                  </button>
            </form>
    </div>
  );
}
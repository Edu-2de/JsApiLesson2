"use client";
import { useEffect } from "react";

export default function CreateProductPage() {

      useEffect(() => {
          const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
          if (!user || user.role !== "admin") {
            window.location.href = "/Login"; 
          }
      }, []);

      async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            // Se for enviar imagem, não use JSON, use FormData direto!
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const token = user?.token;

            // Envie o FormData diretamente (para upload funcionar)
            const response = await fetch("http://localhost:4000/api/products/register", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: formData,
            });

            const data = await response.json();
            console.log(data);
      }




      return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
                  <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Product</h1>
                  <p className="text-gray-600 mb-6">Fill in the details below to create a new product.</p>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                              type="text"
                              name="name" // <-- Adicione isto
                              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="Enter product name"    
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                              name="description" // <-- Adicione isto
                              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="Enter product description"
                        ></textarea>
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                              type="number"
                              name="price" // <-- Adicione isto
                              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="Enter product price"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                        <input
                              type="number"
                              name="stock" // <-- Adicione isto
                              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="Enter product stock"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <input
                              type="file"
                              name="image" // <-- Adicione isto
                              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="Enter image URL"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                              type="text"
                              name="category" // <-- Adicione isto
                              className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                              placeholder="Enter product category"
                        />
                        </div>
                        <button
                        type="submit"
                        className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                        Create Product
                        </button>
                  </form>
            </div>
      </div>
      );
}
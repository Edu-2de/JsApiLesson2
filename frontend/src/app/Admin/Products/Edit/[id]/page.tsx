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

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Edit Product {product.id}</h1>
      <p className="mt-2 text-gray-600">This page is under construction.</p>
    </div>
  );
}
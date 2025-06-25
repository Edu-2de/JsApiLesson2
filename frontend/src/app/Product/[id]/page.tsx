"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import Image from 'next/image';

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
  const [userCash, setUserCash] = useState<number | null>(null);
  const params = useParams();
  const id = params && (params.id || params['id']);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
    // Busca o cash atualizado do usuário logado
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user?.token) {
        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${user.token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.cash !== undefined) {
              setUserCash(data.cash);
              localStorage.setItem("user", JSON.stringify({ ...user, cash: data.cash }));
            } else {
              setUserCash(user.cash ?? null);
            }
          })
          .catch(() => setUserCash(user.cash ?? null));
      } else {
        setUserCash(user?.cash ?? null);
      }
    }
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
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Imagem do produto */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-auto rounded-md mb-4 object-contain bg-neutral-100"
            priority
          />
        </div>
        {/* Detalhes e compra */}
        <div className="flex-1 flex flex-col gap-6">
          <h1 className='text-3xl font-bold mb-2 text-gray-800'>{product.name}</h1>
          <p className='text-gray-600 mb-2'>{product.description}</p>
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-lg text-gray-700"><b>Preço:</b> <span className="text-2xl font-bold text-green-700">${product.price}</span></span>
            <span className="text-gray-700"><b>Estoque:</b> {product.stock}</span>
            <span className="text-gray-700"><b>Categoria:</b> {product.category}</span>
          </div>
          <button
            type="button"
            className={
              "bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-md" +
              (userCash !== null && userCash < product.price ? " opacity-50 cursor-not-allowed" : "")
            }
            disabled={userCash !== null && userCash < product.price}
            onClick={async () => {
              if (userCash !== null && userCash >= product.price) {
                const user = JSON.parse(localStorage.getItem("user") || "null");
                const res = await fetch(`/api/products/${product.id}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                  },
                  body: JSON.stringify({ quantity: 1 })
                });
                const data = await res.json();
                if (res.ok) {
                  alert("Produto comprado com sucesso!");
                  // Atualiza o cash local e no localStorage se vier do backend
                  if (data.user && typeof data.user.cash === 'number') {
                    setUserCash(data.user.cash);
                    localStorage.setItem("user", JSON.stringify({ ...user, cash: data.user.cash }));
                  } else {
                    setUserCash((prev) => prev !== null ? prev - product.price : null);
                  }
                } else {
                  alert(data.message || "Erro ao comprar produto.");
                }
              } else {
                alert("Saldo insuficiente para comprar este produto.");
              }
            }}
          >
            Comprar Produto
          </button>
        </div>
        {/* Card de cash do usuário */}
        <div className="w-full md:w-60 flex-shrink-0">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow flex flex-col items-center">
            <span className="text-gray-500 text-sm mb-1">Seu saldo</span>
            <span className="text-3xl font-bold text-blue-700 mb-2">{userCash !== null ? `$ ${userCash}` : '--'}</span>
            <span className="text-xs text-gray-400">(cash disponível)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
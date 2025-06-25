"use client";
import React from "react";
import { useEffect, useState, } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsCarrousel() {
  type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
  };

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const visibleCount = 5; // Quantos produtos mostrar por vez
  const [startIndex, setStartIndex] = React.useState(0); // Índice do primeiro produto visível

  // Função para obter os produtos visíveis no carrossel (sem duplicar)
  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    if (products.length <= visibleCount) return products;
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const idx = (startIndex + i) % products.length;
      result.push(products[idx]);
    }
    return result;
  };

  // Avança para o próximo grupo de produtos
  const next = () => {
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  // Volta para o grupo anterior de produtos
  const prev = () => {
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  // Produtos que serão exibidos no carrossel no momento
  const visibleProducts = getVisibleProducts();

  if (products.length === 0) {
    return (
      <section className="w-full flex flex-col items-center justify-center py-10 bg-transparent">
        <div className="text-neutral-400">Nenhum produto cadastrado.</div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center justify-center py-10 bg-transparent">
      <div className="w-full max-w-6xl flex items-center mb-8 px-2">
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight pl-1">
          Novidades
        </h2>
        <div className="flex-1 border-b border-neutral-200 ml-4" />
      </div>
      <div className="flex items-center w-full max-w-6xl justify-center gap-0">
        {/* Botão para voltar */}
        <button
          onClick={prev}
          disabled={products.length <= 1}
          className="group p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors duration-200 mx-2 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Anterior"
          style={{ minWidth: 40, minHeight: 40 }}
        >
          <svg
            className="w-6 h-6 text-neutral-500 group-hover:text-neutral-800 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Renderiza os produtos visíveis */}
        <div className="flex gap-8 w-full justify-center">
          {visibleProducts.filter(Boolean).map((product) =>
            product ? (
              <div
                key={product.name}
                className="flex flex-col items-start w-[200px] h-[320px] bg-white rounded-xl shadow-sm p-8 border border-neutral-100 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-300 hover:shadow-lg hover:bg-neutral-50 hover:border-neutral-200 active:scale-95 active:shadow-md active:bg-neutral-100 select-none"
              >
                <div className="h-24 w-full rounded mb-4 bg-neutral-100 flex items-center justify-center overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={120}
                      height={96}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="text-neutral-400 text-xs">Sem imagem</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                  {product.name}
                </h3>
                <p className="text-neutral-500 text-sm mb-3">
                  {product.description}
                </p>
                <span className="text-xl font-bold text-neutral-700">
                  {product.price}
                </span>
                <Link
                  className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors duration-200"
                  href={`/Products/${product.id}`}
                >
                  Comprar
                </Link>
              </div>
            ) : null
          )}
        </div>
        {/* Botão para avançar */}
        <button
          onClick={next}
          disabled={products.length <= 1}
          className="group p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors duration-200 mx-2 shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Próximo"
          style={{ minWidth: 40, minHeight: 40 }}
        >
          <svg
            className="w-6 h-6 text-neutral-500 group-hover:text-neutral-800 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
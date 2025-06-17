"use client";
import React from "react";

export default function ProductsCarrousel() {
  const products = [
    { name: "Product 1", description: "This is a great product.", price: "$19.99" },
    { name: "Product 2", description: "This product is even better.", price: "$29.99" },
    { name: "Product 3", description: "You will love this product.", price: "$39.99" },
    { name: "Product 4", description: "This product is a must-have.", price: "$49.99" },
    { name: "Product 5", description: "Don't miss out on this product.", price: "$59.99" },
    { name: "Product 6", description: "This product is top-rated.", price: "$69.99" },
    { name: "Product 7", description: "This product is highly recommended.", price: "$79.99" },
    { name: "Product 8", description: "This product is a customer favorite.", price: "$89.99" },
    { name: "Product 9", description: "This product is on sale now!", price: "$99.99" },
    { name: "Product 10", description: "This product is limited edition.", price: "$109.99" }
  ];

  const visibleCount = 5;
  const [startIndex, setStartIndex] = React.useState(0);

  // Carrossel infinito
  const getVisibleProducts = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      const idx = (startIndex + i) % products.length;
      result.push(products[idx]);
    }
    return result;
  };

  const next = () => {
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  const prev = () => {
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const visibleProducts = getVisibleProducts();

  return (
    <section className="w-full flex flex-col items-center justify-center py-10 bg-transparent">
      <div className="w-full max-w-6xl flex items-center mb-8 px-2">
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight pl-1">
          Novidades
        </h2>
        <div className="flex-1 border-b border-neutral-200 ml-4" />
      </div>
      <div className="flex items-center w-full max-w-6xl justify-center gap-0">
        <button
          onClick={prev}
          className="group p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors duration-200 mx-2 shadow-sm flex items-center justify-center cursor-pointer"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-8 w-full justify-center">
          {visibleProducts.map((product) => (
            <div
              key={product.name}
              className="flex flex-col items-start w-[200px] h-[320px] bg-white rounded-xl shadow-sm p-8 border border-neutral-100 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-300 hover:shadow-lg hover:bg-neutral-50 hover:border-neutral-200 active:scale-95 active:shadow-md active:bg-neutral-100 select-none"
            >
              <div className="h-24 w-full rounded mb-4 bg-neutral-100" />
              <h3 className="text-lg font-semibold text-neutral-800 mb-1">{product.name}</h3>
              <p className="text-neutral-500 text-sm mb-3">{product.description}</p>
              <span className="text-xl font-bold text-neutral-700">{product.price}</span>
            </div>
          ))}
        </div>
        <button
          onClick={next}
          className="group p-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors duration-200 mx-2 shadow-sm flex items-center justify-center cursor-pointer"
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
"use client";
import React, { useEffect, useState } from "react";

export default function Hero() {
  const slides = [
    {
      title: "Welcome to Our Website",
      description: "Discover amazing content and features.",
      background: "#f0f0f0"
    },
    {
      title: "Explore Our Services",
      description: "We offer a wide range of services to meet your needs.",
      background: "#f0f0f0"
    },
    {
      title: "Join Our Community",
      description: "Connect with like-minded individuals and grow together.",
      background: "#f0f0f0"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  //Aqui se o prev(que é o slide atual) for o ultimo slide, entao ele voltara para o primeiro slide(indice 0).

  //slide.length - 1 é o ultimo slide, pois ele conta quantos slides existem e subtrai 1, ja que os indices começam em 0.
  //Ou seja se tem 3 slides, o ultimo slide é o de indice 2.

  //Caso contrario, ele ira para o proximo slide.

  const nextSlide = React.useCallback(() => {
      setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
      );
  }, [slides.length]);

  //Aqui se o prev(que é o slide atual) for o primeiro slide, entao ele voltara para o ultimo slide(indice slides.length - 1).
  //Ou seja se tem 3 slides, o primeiro slide é o de indice 0, e o ultimo slide é o de indice 2.

  const prevSlide = () =>{
      setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
      );
  };


  //Aqui a cada 5 segundos, o proximo slide é chamado, ou seja, o slide atual(prev) é atualizado para o proximo slide.

  //clearInterval limpa o timer antigo.
  //As dependências garantem que o efeito sempre use os valores mais recentes e não crie múltiplos timers.

  useEffect(() => {
      const interval = setInterval(() => {
          nextSlide();
      }, 5000); 
      return () => clearInterval(interval); 
  }, [currentIndex, nextSlide]);

 


  return (
      <section className="flex items-start justify-center w-screen h-140  overflow-hidden select-none bg-gray-100 relative">
            <div className="relative w-full h-full overflow-hidden">

                  <div className="inset-0 bg-cover bg-center w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: slide.background }}>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 w-full text-center">{slide.title}</h2>
                        
                        <p className="text-lg text-gray-600 w-full text-center">{slide.description}</p>
                  </div>

                 <div className="absolute bottom-1/2 left-0 w-full flex justify-between items-center px-4 pointer-events-none">

                        <button
                        className="pointer-events-auto  bg-opacity-80 hover:bg-gray-200 text-gray-800 text-3xl rounded-full p-4 transition-all duration-200 focus:outline-none focus:ring-2  cursor-pointer w-17"
                        style={{ transform: "translateY(50%)" }}
                        onClick={prevSlide}
                        aria-label="Previous Slide"
                        >
                              &lt;
                        </button>

                        <button
                        className="pointer-events-auto  bg-opacity-80 hover:bg-gray-200 text-gray-800 text-3xl rounded-full p-4 transition-all duration-200 focus:outline-none focus:ring-2  cursor-pointer w-17"
                        style={{ transform: "translateY(50%)" }}
                        onClick={nextSlide}
                        aria-label="Next Slide"
                        >
                              &gt;
                        </button>

                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, idx) => (
                        // Para cada slide, cria uma bolinha (indicador)
                        <div
                              key={idx}
                              // Se o índice da bolinha for igual ao índice do slide atual, ela fica preta. Senão, fica cinza.
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              idx === currentIndex
                              ? "bg-gray-800"    
                              : "bg-neutral-300" 
                              }`}
                        />
                        ))}
                  </div>

            </div>

      </section>
  );
}
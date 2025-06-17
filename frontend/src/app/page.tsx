import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductsCarrousel from '@/components/ProductsCarrousel';
export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-start justify-start min-h-screen bg-gray-100">
        <Hero />
        <main className="flex flex-col w-full justify-center items-center p-4 max-w-7xl mx-auto">
         
          <ProductsCarrousel />
        </main>
      </div>
    </>
  );
}
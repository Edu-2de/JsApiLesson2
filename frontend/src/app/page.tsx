import Header from '@/components/Header';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-start justify-start min-h-screen bg-gray-100">
        <main className="flex flex-col w-full">
          <Hero />
        </main>
      </div>
    </>
  );
}

import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
        <p className="text-gray-600 mb-6">Here you can manage your products.</p>
        <Link href="/Admin/Products/Create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Create New Product
        </Link>
      </div>
    </div>
  );
}
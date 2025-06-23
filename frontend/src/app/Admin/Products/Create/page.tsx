

export default function CreateProductPage() {
  return (
      <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-6">
                  <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Product</h1>
                  <p className="text-gray-600 mb-6">Fill in the details below to create a new product.</p>
                  <form className="space-y-4">
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                              <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter product name"    
                              />
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <textarea
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter product description"
                              ></textarea>
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                              <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter product price"
                              />
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                              <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter image URL"
                              />
                        </div>
                        <button
                              type="submit"
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                              Create Product
                        </button>
                  </form>
            </div>
      </div>
  );
}
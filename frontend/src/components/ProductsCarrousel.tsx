

export default function ProductsCarrousel() {
  const products = [
    {
      name: "Product 1",
      description: "This is a great product.",
      price: "$19.99"
    },
    {
      name: "Product 2",
      description: "This product is even better.",
      price: "$29.99"
    },
    {
      name: "Product 3",
      description: "You will love this product.",
      price: "$39.99"
    },
      {
        name: "Product 4",
        description: "This product is a must-have.",
        price: "$49.99"
      },
      {
        name: "Product 5",
        description: "Don't miss out on this product.",
        price: "$59.99"
      },
      {
        name: "Product 6",
        description: "This product is top-rated.",
        price: "$69.99"
      },
      
      

  ];

  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {products.map((product) => (
        <div key={product.name} className="min-w-[200px] bg-white shadow-md rounded-lg p-4">
          <div className="h-40 bg-gray-200"></div>
          <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-xl font-bold mt-2">{product.price}</p>
        </div>
      ))}
    </div>
  );
}
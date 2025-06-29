import prisma from '../prismaClient.js';


export const registerProduct = async (req, res) => {
      // Monta a URL completa da imagem usando variável de ambiente ou localhost
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
      const { name, description, price, category, stock } = req.body;
      const imageUrl = req.file ? `${backendUrl}/images/${req.file.filename}` : null;

      if (!name) {
        return res.status(400).json({ message: "Product name is required" });
      }

      try {
        const productExists = await prisma.product.findUnique({ where: { name } });
        if (productExists) {
          return res.status(400).json({ message: "Product already exists" });
        }
        const product = await prisma.product.create({
          data: {
            name,
            description,
            price: price ? Number(price) : null,
            category,
            stock: stock ? Number(stock) : null,
            imageUrl
          }
        });
        res.status(201).json({
          message: "Product registered successfully",
          product
        });
      } catch (error) {
        console.error("Error during product registration:", error);
        res.status(500).json({ message: "Internal server error", error: error.message, stack: error.stack });
      }
};

      
export const getProductById = async (req, res) =>{
      const {id} = req.params;
      try{
            const product = await prisma.product.findUnique({where: {id: parseInt(id)}});
            if (!product){
                  return res.status(404).json({message: "Product not found"});
            }
            res.status(200).json(product)

      }catch(error){
            console.error("Error fetching product:", error);
            res.status(500).json({message: "Internal server error"});
      }
}

export const getAllProducts = async (req, res) => {
      try{
            const products = await prisma.product.findMany();
            res.status(200).json(products);
      }catch(error){
            console.error("Error fetching products:", error);
            res.status(500).json({message: "Internal server error"});
      }
}

export const updateProduct = async (req, res) => {
      const {id} = req.params;
      // Atualiza apenas os campos enviados (sem imagem)
      const fields = ['name', 'description', 'price', 'category', 'stock'];
      let data = {};
      for (const field of fields) {
        if (req.body[field] !== undefined) {
          data[field] = field === 'price' || field === 'stock' ? Number(req.body[field]) : req.body[field];
        }
      }
      try{
            const product = await prisma.product.update({
                  where: {id: parseInt(id)},
                  data
            });
            res.status(200).json(product);
      }catch(error){
            console.error("Error updating product:", error);
            res.status(500).json({message: "Internal server error", error: error.message, stack: error.stack});
      }
};

export const deleteProduct = async (req, res) => {
      const {id} = req.params;
      try{
            const product = await prisma.product.delete({where: {id: parseInt(id)}});
            res.status(200).json({message: "Product deleted successfully", product});
      }catch(error){
            console.error("Error deleting product:", error);
            res.status(500).json({message: "Internal server error", error: error.message, stack: error.stack});
      }
};

export const searchProducts = async (req, res) => {
      const {query} = req.query;
      try{
            const products = await prisma.product.findMany({
                  where: {
                        OR: [
                              {name: {contains: query, mode: 'insensitive'}},
                              {description: {contains: query, mode: 'insensitive'}}
                        ]
                  }
            });
            res.status(200).json(products);
      }catch(error){
            console.error("Error searching products:", error);
            res.status(500).json({message: "Internal server error", error: error.message, stack: error.stack});
      }
};

export const getProductsByCategory = async (req, res) => {
      const {category} = req.params;
      try{
            const products = await prisma.product.findMany({
                  where: {
                        category: {equals: category, mode: 'insensitive'}
                  }
            });
            res.status(200).json(products);
      }catch(error){
            console.error("Error fetching products by category:", error);
            res.status(500).json({message: "Internal server error", error: error.message, stack: error.stack});
      }
};

export const buyProduct = async (req, res) => {
      const {userId} = req.user; // Assuming userId is available in req.user
      if (!userId) {
            return res.status(401).json({message: "Unauthorized"});
      }
      const {id} = req.params;
      const {quantity} = req.body;
      try {
            const product = await prisma.product.findUnique({where: {id: parseInt(id)}});
            if (!product) {
                  return res.status(404).json({message: "Product not found"});
            }
            if (product.stock < quantity) {
                  return res.status(400).json({message: "Insufficient stock"});
            }
            const user = await prisma.user.findUnique({where: {id: userId}});
            if (!user) {
                  return res.status(404).json({message: "User not found"});
            }
            const totalPrice = product.price * quantity;
            if (user.cash < totalPrice) {
                  return res.status(400).json({message: "Insufficient cash"});
            }
            const updatedStock = product.stock - quantity;
            const updatedCash = user.cash - totalPrice;
            const updatedProduct = await prisma.product.update({
                  where: {id: parseInt(id)},
                  data: {stock: updatedStock}
            });
            await prisma.user.update({
                  where: {id: userId},
                  data: {cash: updatedCash}
            });
            res.status(200).json({message: "Product bought successfully", product: updatedProduct});
      } catch (error) {
            console.error("Error buying product:", error);
            res.status(500).json({message: "Internal server error", error: error.message, stack: error.stack});
            }
};
const prisma = require('../prismaClient');


export const registerProduct = async (req, res) => {
      const {name, description, price, category, stock} = req.body;
      try{
            const productExists = await prisma.product.findUnique({where : {name}});
            if(productExists){
                  return res.status(400).json({message: "Product already exists"});
            }
            const product = await prisma.product.create({data: {name, description, price, category, stock}});
            res.status(201).json({
                  message: "Product registered successfully",
                  product:{
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                  }
            })
      }catch(error){
            console.error("Error during product registration:", error);
            res.status(500).json({message: "Internal server error"});
      }}


      
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
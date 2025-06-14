const Product = require('../models/Product');
const prisma = require('../prismaClient');




export const registerProduct = async (req, res) => {
      const {name, description, price, category, stock} = req.body;
      try{
            const productExists = await prisma.product.findUnnique({where : {name}});
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
            return res.status(500).json({message: "Error during product registration:", error});

      }}
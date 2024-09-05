const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async(req,res) =>{
    const {product_id,name,description,price,category,image_url} = req.body;
    try{
        const prod = await prisma.products.create({
            data:{
                product_id,
                name,
                description,
                price,
                category,
                image_url
            }
        });
        res.status(200).json(prod);
    }catch(err){
        res.status(500).json(err);
    }
};

const updateProduct = async(req,res)=>{
    const{id,name,description,price,category,image_url} = req.body;
    try{
        const product = await prisma.products.update({
            data:{
                name,
                description,
                price,
                category,
                image_url
            },
            where: {product_id: Number(id)}
        });
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
}

const deleteProduct = async(req,res)=>{
    const id = req.params.id;
    try{
        const product = await prisma.products.delete({
            where:{
                product_id: Number(id),
            },
        })
        res.status(200).json(product)
    }catch(err){
        res.status(500).json(err);
    }
}
const getProducts = async(req,res)=>{
    const products = await prisma.products.findMany()
    res.json(products)
}
const getProduct = async(req,res)=>{
    const id = req.params.id;
    try{
        const product = await prisma.products.findUnique({
            where: {product_id: Number(id)},
        });
        if(!product){
            res.status(404).json({'message': 'Product not found!'});
        }else{
            res.status(200).json(product);
        }
    }catch(err){
        res.status(500).json(err);
    }
}
const getProductsByTerm = async(req,res)=>{
    const searchString = req.params.term;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice): null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice): null;

    let priceConditions = {};

    if(minPrice !== null && maxPrice !== null){
        priceConditions = {
            price: {
                gte: minPrice,
                lte: maxPrice
            }
        };
    }else if(minPrice !== null){
        priceConditions = {
            price:{
                gte: minPrice
            }
        };
    }else if(maxPrice !== null){
        priceConditions = {
            price:{
                lte: maxPrice
            }
        };
    }
    
    
    
    
    try{
        const products = await prisma.products.findMany({
            where:{
                OR:[
                    {
                        name:{
                            contains: searchString
                        }
                    },
                    {
                        description:{
                            contains: searchString
                        }
                    },
                    {
                        category:{
                            contains: searchString
                        }
                    },
                    priceConditions
                ]
            },
        });
        if (!products || products.length == 0){
            res.status(404).json({'message':'Product not found!'});
        }else{
            res.status(200).json(products)
        }
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports = {createProduct,updateProduct,deleteProduct,getProducts,getProduct,getProductsByTerm};
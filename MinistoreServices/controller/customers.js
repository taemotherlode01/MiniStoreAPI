const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

const createCustomer = async(req,res)=>{
    const {customer_id,first_name,last_name,address,email,phone_number} = req.body;
    try{
        const cust = await prisma.customers.create({
            data:{
                customer_id,
                first_name,
                last_name,
                address,
                email,
                phone_number
            }
        });
        res.status(200).json(cust);

    }catch(err){
        res.status(500).json(err)
    }
}

const updateCustomer = async(req,res)=>{
    const{id,first_name,last_name,address,email,phone_number} = req.body;
    try{
        const cust = await prisma.customers.update({
            data:{
                first_name,
                last_name,
                address,
                email,
                phone_number
            },
            where: { customer_id: Number(id)}
        });
        res.status(200).json(cust);

    }catch(err){
        res.status(500).json(err);
    }
}
const deleteCustomer = async(req,res)=>{
    const id = req.params.id;
    try{
        const cust = await prisma.customers.delete({
            where:{
                customer_id: Number(id),
            },
        })
        res.status(200).json(cust)
    }catch(err){
        res.status(500).json(err);
    }
}
const getCustomers = async(req,res)=>{
    const custs = await prisma.customers.findMany()
    res.json(custs)
}
const getCustomer = async(req,res)=>{
    const id = req.params.id;
    try{
        const cust = await prisma.customers.findUnique({
            where: {customer_id: Number(id)},
        });
        if(!cust){
            res.status(404).json({'message': 'Customer not found!'});
        }else{
            res.status(200).json(cust);
        }
    }catch(err){
        res.status(500).json(err);
    }
}
const getCustomersByTerm = async (req, res) => {
    const  searchString  = req.params.term;
    try {
        const custs = await prisma.customers.findMany({
            where: { 
                OR: [
                    {
                        first_name: {
                            contains: searchString
                        }
                    },
                    {
                        email: {
                            contains: searchString
                        }
                    },
                ]
            },
        });
        if (!custs || custs.length == 0) {
            res.status(404).json({ 'message': 'Customer not found!' });
        } else {
            res.status(200).json(custs);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    createCustomer, getCustomer, getCustomers,
    updateCustomer,deleteCustomer,getCustomersByTerm
}
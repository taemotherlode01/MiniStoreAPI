const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const createOrder = async (req, res) => {
    const { orderId, customerId, orderDate, items, paymentMethod, totalAmount } = req.body;

    if (!customerId || !items || !orderId || !paymentMethod || !totalAmount) {
        return res.status(400).json({ message: 'Invalid order data' });
    }
    try {
        const [order, payment] = await prisma.$transaction([
            prisma.orders.create({
                data: {
                    order_id: orderId,
                    customer_id: customerId,
                    order_date: new Date(orderDate),
                    order_status: 'processing',
                    total_amount: totalAmount,
                    OrderDetail: {
                        create: items.map((item) => ({
                            product_id: item.productId,
                            quantity: item.quantity,
                            unit_price: item.unitPrice,
                        })),
                    },
                },
            }),
            prisma.payments.create({
                data: {
                    order_id: orderId,
                    amount: totalAmount,
                    payment_method: paymentMethod,
                    payment_status: 'pending',
                    amount: totalAmount
                },
            }),
        ]);
        console.log('Transaction committed:', { order, payment });
        res.status(200).json('Order created successfully.');
    } catch (err) {
        console.error('Failed to create orders:', err.message);
        res.status(500).json(err);
    }
};

module.exports = { createOrder };
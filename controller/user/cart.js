const Cart = require("../../model/cartModel");
const Product = require("../../model/productModel");


const CART = {};

CART.addItem = async (req, res) => {

    const { productId } = req.body;



    try {


        const cart = await Cart.findOne({ userId: req._id });



        const { title, price } = await Product.findById(productId);



        if (cart) {

            if (cart.products.find((product) => (product.productId.toString() === productId))) {

                cart.products.filter((product) => {


                    if ((product.productId).toString() === productId) {
                        product.quantity += 1
                        product.total = product.price * product.quantity
                    }
                })


                console.log(cart.products);
                await cart.save();

            } else {


                cart.products.push({
                    productId,
                    title,
                    price,
                    quantity: 1,
                    total: parseInt(price)

                })
                console.log(cart.products);
                await cart.save();
            }




        } else {

            const cartData = new Cart({
                userId: req._id,
                products: [{
                    productId: productId,
                    quantity: 1,
                    price: price,
                    title: title,
                    total: parseInt(price)
                }]
            })

            console.log(cartData);
            await cartData.save();

            return res.send(cartData);
        }
        res.send(cart)



    } catch (e) {

        res.status(500).send(e.message);
    }


}



CART.myCart = async (req, res) => {



    try {

        const user = await req.user.populate({
            path: 'cart',

        });
        res.send({
            products: user.cart[0].products
        }

        )

    } catch (e) {
        res.status(500).send(e.message)
    }
}
CART.allCarts = async (req, res) => {
    let limit = 0;
    const match = {};
    const sort = {};
    if (req.query.startDate && req.query.endDate) {


        match.date = { $gte: req.query.startDate, $lte: req.query.endDate }

    }
    if(req.query.limit){
        limit = parseInt(req.query.limit)
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1;
    }

    try {
        const carts = await Cart.find(match).sort(sort).limit(limit);
        if (!carts) {
            return res.status(404).send('NO Cart found')
        }
        res.send(carts)
    } catch (e) {
        res.status(500).send(e.message);
    }
}

CART.updateCart = async (req, res) => {

    const productId = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["quantity"];

    const isValid = updates.every((update) => allowedUpdates.includes(update));
    if (!isValid) {
        return res.status(403).send('restricted Updates');
    }

    try {
        const cart = await Cart.findOne({ userId: req._id });
        if (!cart) {
            return res.status(404).send('no cart ');

        }
        if (cart.products.find((product) => (product.productId.toString() === productId))) {

            cart.products.filter((product) => {


                if ((product.productId).toString() === productId) {
                    if (req.body.quantity >= 0) {

                        product.quantity = req.body.quantity;
                        product.total = product.price * req.body.quantity
                    } else {
                        return res.status(403).send('quantity  cannot be negative ')
                    }
                }


            })
        } else {

            const {title, price} = await Product.findById(productId);

             cart.products.push({
                productId,
                title,
                price,
                quantity: req.body.quantity,
                total: parseInt(price)

            })
            console.log(cart.products);
            await cart.save();
            
            
            
        }
        if(req.body.quantity === 0){
            const trashProduct = cart.products.find((product) => product.quantity === 0);

            cart.products = cart.products.filter((product) => {
                return product != trashProduct
            })
        }
       

        await cart.save();
        res.send(cart);

    } catch (e) {
        res.status(500).send(e);

    }


}


CART.deleteCart = async (req, res) => {
    try{
        const cart = await Cart.findOneAndDelete({userId : req._id});
        if(!cart){
            return res.status(404).send('no cart found');


        }

        res.send(cart);
    } catch(e){
        res.status(500).send(e);
    }
}

module.exports = CART;
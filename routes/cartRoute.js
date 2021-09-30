const { addItem, myCart, allCarts, updateCart, deleteCart } = require('../controller/cart/cart');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();



//<-------------------Admin routes------------------>


router.get('/admin/carts', authMiddleware, allCarts);


//-------------------User routes-------------------->

router.post('/user/', authMiddleware, addItem);

router.get('/user/myCart', authMiddleware, myCart);


router.patch('/user/:id', authMiddleware, updateCart);

router.delete('/user/', authMiddleware, deleteCart); 


module.exports = router;

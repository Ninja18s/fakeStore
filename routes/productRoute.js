const router = require('express').Router();


const authMiddleware = require('../middleware/authMiddleware');
const { addProduct, getAllProducts, getProductById, update, deleteProduct } = require('../controller/product/product');


//<-------------------Admin routes------------------>


router.post('/admin/add', authMiddleware, addProduct);

router.patch('/admin/:id',authMiddleware, update);

router.delete('/admin/:id',authMiddleware ,deleteProduct);

//-------------------User routes-------------------->


router.get('/user/allProducts' ,authMiddleware, getAllProducts);

router.get('/user/:id', authMiddleware,getProductById);



module.exports = router;



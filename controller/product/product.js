const Product = require("../../model/productModel");


const PRODUCT={};

PRODUCT.addProduct = async (req, res) => {
    const product = new Product(req.body);
    try{
        await product.save();
        res.send(product);
    } catch(e){
        res.status(500).send(e);
    }
}

PRODUCT.getAllProducts = async (req, res) => {
    
    const match = {};
    const sort = {};
    let limit = 0;
    if(req.query.category){
       console.log (req.query.category) ;
      
       match.category = req.query.category

    }
    if(req.query.limit){
       limit = parseInt(req.query.limit)
    } 
    
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1;
    }
    
    try{
        console.log((req.query.limit));
        const products = await Product.find(match).sort(sort).limit(limit);

        if(!products){
            return res.status(404).send('no product found');
        }
        res.send(products);

    } catch(e){
        res.status(500).send(e.message);
    }
}

PRODUCT.getProductById = async (req, res) => {
    const  _id = req.params.id;
    

    try{
        const product = await Product.findById(_id);
        
        if(!product){
            return res.status(404).send('Product not found')
        }

      
        res.send(product);
    } catch(e){
        res.status(404).send(e);
    }
}

PRODUCT.update = async (req, res) => {

    const updates = Object.keys( req.body);

    const allowedUpdates = ['price' ];

    const isvalid = updates.every((update) => allowedUpdates.includes(update));

    if(!isvalid){
        return res.status(403).send(`cant update restricted field`);
    }

    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).send('not found product')
        }

        updates.forEach(update => product[update] = req.body[update]);

        await product.save();
        res.send(product)
    } catch(e){
        res.status(500).send(e);
    }
}

PRODUCT.deleteProduct = async (req, res ) => { 

    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).send('No product  found');
        }

        res.send(product);
    } catch(e){
        res.status(500).send(e);
    }

}



module.exports = PRODUCT;


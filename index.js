const express = require('express');

require('./db/mongoose')

const authRouter = require('./routes/userRoute');

const productRouter = require('./routes/productRoute');

const cartRouter = require('./routes/cartRoute');


const app = express();

const port = process.env.PORT||3000;

app.use(express.json());

app.use('/user', authRouter);

app.use('/product', productRouter);

app.use('/cart', cartRouter);



app.listen(port , ()=> console.log(`app is running at port ${port}`));







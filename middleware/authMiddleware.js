const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const isAuth = require('../utils/authorization');


const authMiddleware = async (req, res, next) => {

    const token = req.headers['authorization'];

    if(!token){
        
        return res.status(403).send('please Login')
    }

    try{

        
        
        const decoded = jwt.verify(token , process.env.jwt_key);

        const role = decoded.role;

        if(!isAuth( role , req.originalUrl.split('/')[2], req.method)){
            return res.status(403).send('Unauthorizied');
        }

        const _id = decoded._id;

        const user = await User.findOne({ _id, 'tokens.token' : token});

        if(!user) {
            throw new Error ('unauthorized ');
        }
        req.user = user;
        req.token = token;
        req._id = _id;
        

        next();

    } catch(e){
        res.status(500).send(e)
    }
}


module.exports = authMiddleware;
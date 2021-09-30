const mongoose = require('mongoose');




    mongoose.connect(process.env.db_Url, {useNewUrlParser: true}).then(() => console.log('connected successfully')).catch((err) => console.log(err))
    



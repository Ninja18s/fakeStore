const nodemailer = require('nodemailer');


const alert = (email, op) => {
    let text =""

    if(op === "delete"){
         text = "Hello user, Admin deleted your account";

    } else if(op === "create"){
         text = " your account successfully created. "
        
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.alert_username,
            pass: process.env.alert_pass
        }
    });

    const mailOptions = {
        from: process.env.alert_username,
        to: email,
        subject: 'Alert from node',
        text: text,
        
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.log(err);
        else {
            console.log(info.response);

        }
    });

    return "true";
};



module.exports = alert;
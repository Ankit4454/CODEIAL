const nodemailer = require('../config/nodemailer');


exports.resetPass = (token)=>{
    let htmlString = nodemailer.renderTemplate({token: token}, '/resetPassword/new_password.ejs');

    nodemailer.transporter.sendMail({
        
        from:'yourEmail@gmail.com',
        to: token.user.email, // list of receivers
        subject: "Codeial | Link to reset password", // Subject line
       
        html: htmlString
    
    },(err,info)=>{
        if(err){
            console.log('error un sending mail ',err);
            return;
       }
       console.log('mail delivered',info);
       return;  

    })
}
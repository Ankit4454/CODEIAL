const crypto = require('crypto');
const Token = require('../models/reset_password');
const User = require('../models/user');
const resetpassMailer = require('../mailers/resetPassword_mailer');

/* before going to this function i should be on the sign in page */
module.exports.render_email_page = async (req, res) =>
{
    if (req.user)//user should not be logged in before accessing this page or using this action
    {
        return res.redirect('back');
    }
    return res.render('reset_password/check_email.ejs', { title: 'Codeial' });
}
/* send the mail to email id
store the token to change the password,
 */
module.exports.generate_token_and_send_mail = async (req, res) =>
{
    
    /* finding the user whose email is provided in the request (whose password needs to be changed) */
    

    if (!req.user){
        try {
            let token_string = crypto.randomBytes(40).toString('hex');
            var user = await User.findOne({ email: req.body.email });

            if (user){
                let token = await Token.create(
                    {
                        is_valid: true,
                        access_token: token_string,
                        user: user,
                    }
                );
                token = await token.populate('user', 'email').execPopulate();
                resetpassMailer.resetPass(token);
                req.flash('success', 'Email sent Successfully');
                return res.redirect('back');
            }
            req.flash('error', 'User not found!')
            return res.redirect('back');

            
        } catch(error){
            req.flash('error', error);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).json({
            message: 'Unauthorized!'
        });
    }

}
/* redirect to change password page */
module.exports.redirect_to_change_password_page = async function (req, res)
{
    if (req.user)//user should not be logged in before accessing this page or using this action
    {
        return res.redirect('back');
    }
    let token_in_link = req.query.access_token;

    try
    {
        let token = await Token.findOne({ access_token: token_in_link });
        if (!token.is_valid)
        {
            return res.redirect('back');
        }
        return res.render('reset_password/reset_password.ejs', { title: 'Codeial | Change Password', access_token: token_in_link });
    }
    catch (error)
    {
        if (error)
        {
            console.log('Unable to find the given token in the tokens model!');
            return;
        }
    }
}
/* change the password in the database */
module.exports.change_password = function (req, res)
{
    if (req.user)//user should not be logged in before accessing this page or using this action
    {
        return res.redirect('back');
    }
    let token_in_link = req.body.access_token;
    let pass1 = req.body.pass1;
    let pass2 = req.body.pass2;
    if (pass1 != pass2)
    {
        req.flash('error', 'Please enter same password in both the fields!');
        return res.redirect('back');
    }
    if (pass1 == "")
    {
        req.flash('error', 'Please enter a non empty password in both the fields!');
        return res.redirect('back');
    }
    /* 
        get the token
        get user.id from the token
        find (and update) the user with the given userid on the Users model
        mark the is_valid in the token as false.
        */
    Token.findOneAndUpdate({ access_token: token_in_link }, { $set: { is_valid: false } }, function (error, token)
    {
        console.log(token);
        if (error)
        {
            console.log('Error in finding the token with given access_token string!', error);
            return;
        }
        if (!token.is_valid)
        {
            return res.redirect('back');
        }
        User.findByIdAndUpdate(token.user, { $set: { password: pass1 } }, function (error, user)
        {
            if (error)
            {
                console.log('Error in finding the user with the provided token!');
                return;
            }
            console.log(user.password, token.is_valid);
            return res.redirect('/users/sign-in');
        });
    });
}
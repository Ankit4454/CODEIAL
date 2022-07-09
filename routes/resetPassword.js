const express = require('express');
const router = express.Router();

const resetPassword= require('../controllers/resetPassword_controller');


router.get('/enter_email', resetPassword.render_email_page);
router.post('/send_email', resetPassword.generate_token_and_send_mail);
router.get('/reset', resetPassword.redirect_to_change_password_page);
router.post('/password_changed', resetPassword.change_password);

module.exports=router;
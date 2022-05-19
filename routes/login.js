var router = require('express').Router();


router.get('/',function( request , response ){

    response.render('login.ejs');


});
module.exports = router;
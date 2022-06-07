var router = require('express').Router();


router.get('/',function( request , response ){

    response.render('login.ejs');


});


router.get('/fail',function( request , response ){
  
    response.redirect('/login');

});


module.exports = router;
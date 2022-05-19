var router = require('express').Router();


router.get('/',function( request , response ){

    response.render('login.ejs');


});


router.get('/fail',function( request , response ){
  
    alert('로그인에 실패했습니다!');
    response.redirect('/login');

});


module.exports = router;
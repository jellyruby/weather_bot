var router = require('express').Router();


router.get('/pet',function( request , response ){

    response.send('쇼핑할 수 있는 페이지입니다.');

});


router.get('/beauty',function( request , response ){   

    response.send('뷰티용품 안내 페이지입니다.');

});


module.exports = router;
let router = require('express').Router();


router.use(login_check);

function login_check(request,response,next) {

    if(request.user){
        next()
    } else {
        response.redirect('/login');
    }

}


//게시글 리스트
router.get('/',function( request , response ){

    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        response.render('list.ejs', {posts : result});
    });

});



//채팅방 개설 프로세스
router.post('/',function(request, response){
    
    let user_id =  request.user._id;

    
    console.log(request.body.title);

    db.collection('counter').findOne({
        name: '채팅방갯수'
    },function(error,result){

        console.log(result.totalPost);
        let totalPost = result.totalPost;
        let db_data = { _id : totalPost+1, 'title':user_id+'의 채팅방','author':user_id };



        db.collection('chatroom').insertOne( db_data , function(error,result){
            console.log('저장 완료');

            db.collection('counter').updateOne(
                {'name':'채팅방갯수'},
                { $inc : {'totalPost':1} },
                function(error,result){
                if(error) {
                    console.log(error);
                }
                response.redirect('/board/list');

            });
        });
    });
    
});


//게시글 수정
router.put('/',function(request, response){
    
    let id = request.body._id;
    let date = request.body.date;
    let title = request.body.title;
 
    console.log(request.body);

    db.collection('counter').findOne({
        name: '게시물갯수'
    }, function (error, result) {

        db.collection('post').updateOne(
            { _id: parseInt(id) },
            {
                $set:
                    { 'title': title, 'date': date, /*_id: 100*/ }
            }
            , function (error, result) {
                console.log('저장 완료');
                response.redirect('/board/list');
            });

            db.collection('post').updateOne(
                { _id: parseInt(id) },
                {
                    $set:
                        { 'title': title, 'date': date, /*_id: 100*/ }
                }
                , function (error, result) {
                    console.log('저장 완료');
                    response.redirect('/board/list');
                });
    });
    
});


module.exports = router;
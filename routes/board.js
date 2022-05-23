let router = require('express').Router();


router.use(login_check);

function login_check(request,response,next) {

    if(request.user){
        next()
    } else {
        response.redirect('/login');
    }

}

//게시글 쓰기 페이지
router.get('/write',function( request , response ){

    response.render('write.ejs');

});

//게시글 상세보기
router.get('/detail/:id',function( request , response ){

    db.collection('post').findOne({_id:parseInt(request.params.id)},function(error,result){
        console.log(result);
        response.render('detail.ejs', {data : result});
    });

});

//게시글 수정 페이지
router.get('/edit/:id', function (request, response) {

    db.collection('post').findOne({ _id: parseInt(request.params.id) }, function (error, result) {
        console.log(result);
        response.render('edit.ejs', { data: result, id: request.params.id });
    });

});

//게시글 리스트
router.get('/',function( request , response ){

    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        response.render('list.ejs', {posts : result});
    });

});
router.get('/list',function( request , response ){

    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        response.render('list.ejs', {posts : result});
    });

});

app.get('/search',function( request , response ){

    console.log(request.query);

    var search = [
        {
          $search: {
            index: 'title_search',
            text: {
              query: request.query.value,
              path: 'title'  // 제목날짜 둘다 찾고 싶으면 ['제목', '날짜']
            }
          }
        },
       { $sort : { _id : 1 } },
       { $limit : 10 },
       { $project : { 제목 : 1, _id : 0 , score : { $meta : "searchScore" } } }
    ] 
    db.collection('post').aggregate({ $text : { $search:request.query.value}}).toArray((error,result)=>
    {
        console.log(result);
        response.render('list.ejs', {posts : result});

    })
});

//게시글 쓰기 프로세스
router.post('/',function(request, response){
    
    
    let date = request.body.date;
    let title = request.body.title;
 
    console.log(request.body.title);

    db.collection('counter').findOne({
        name: '게시물갯수'
    },function(error,result){

        console.log(result.totalPost);
        let totalPost = result.totalPost;
        let db_data = { _id : totalPost+1, 'title':title,'date': date , author : request.user._id };



        db.collection('post').insertOne( db_data , function(error,result){
            console.log('저장 완료');

            db.collection('counter').updateOne(
                {'name':'게시물갯수'},
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
    });
    
});


module.exports = router;
let router = require('express').Router();


router.use(login_check);

function login_check(request,response,next) {

    if(request.user){
        next()
    } else {
        response.redirect('/login');
    }

}

//채팅방 리스트
router.get('/',function( request , response ){

    db.collection('chatroom').find().toArray(function(error,result){
        console.log(result);
        response.render('chatRoomList.ejs', {posts : result});
    });

});


//채팅방 보기
router.get('/:chatroomid',function( request , response ){



    db.collection('chatroom').find({"member" : request.user.id}).toArray(function(error,result){

        

        getChatMessage(request.params.chatroomid,(message)=>{
            response.render('chat.ejs', {chatrooms : result, user_id: request.user.id , "message" : message});
        })
        
    });

});



//채팅방 개설 프로세스
router.post('/chatroom/',function(request, response){
    
    let user_id =  request.user.id;
    let target =  request.body.target;
    let board_id =  request.body._id;

    console.log(request.body.title);

    db.collection('counter').findOne({
        name: '채팅방갯수'
    },function(error,result){

        console.log(result.totalChat);
        let totalChat = result.totalChat;
        let db_data = { _id : totalChat+1, 'title':user_id+'의 채팅방','author':user_id,'target':target,'board_id':board_id, 'member':[user_id,target],date:new Date()};



        db.collection('chatroom').insertOne( db_data , function(error,result){
            console.log('저장 완료');

            db.collection('counter').updateOne(
                {'name':'채팅방갯수'},
                { $inc : {'totalChat':1} },
                function(error,result){
                if(error) {
                    console.log(error);
                }
                response.redirect('/chat');

            });
        });
    });
    
});


//채팅방 수정
router.put('/',function(request, response){
    
    let id = request.body._id;
    let date = request.body.date;
    let title = request.body.title;
 
    console.log(request.body);

    db.collection('counter').findOne({
        name: '채팅방갯수'
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

function getLeftMenu (){

    db.collection('chatroom').find().toArray(function(error,result){
        console.log(result);
        response.render('list.ejs', {posts : result});
    });


}

function getChatMessage(chatroom_id,_callback){

    console.log(chatroom_id);
    let message_array = [];

    db.collection('chat_message').find({"chatroom_id":parseInt(chatroom_id)}).toArray(function(error,result){
        console.log(result);
        _callback(result);
    });


}

function setChatMessage(chatroom_id){

}


module.exports = router;
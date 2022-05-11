const { response } = require('express');
const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const app = express();
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use('/public', express.static('public'))
app.set('view engine', 'ejs');


MongoClient.connect('mongodb+srv://yjw001206:secondcoming7@cluster0.rx43y.mongodb.net/todoapp?retryWrites=true&w=majority',
function(error,client){

    if(error) return console.log(error);

    db = client.db('todoapp');

    app.listen(8080, function(){
    
        console.log('listening on 8080');
    
    });

});


app.get('/pet',function( request , response ){

    response.send('쇼핑할 수 있는 페이지입니다.');

});


app.get('/beauty',function( request , response ){   

    response.send('뷰티용품 안내 페이지입니다.');

});

app.get('/',function( request , response ){

    response.render('index.ejs');

});

app.get('/write',function( request , response ){

    response.render('write.ejs');

});

app.get('/edit/:id', function (request, response) {

    db.collection('post').findOne({ _id: parseInt(request.params.id) }, function (error, result) {
        console.log(result);
        response.render('edit.ejs', { data: result, id: request.params.id });
    });

});

app.get('/list',function( request , response ){

    db.collection('post').find().toArray(function(error,result){
        console.log(result);
        response.render('list.ejs', {posts : result});
    });

});

app.get('/detail/:id',function( request , response ){

    db.collection('post').findOne({_id:parseInt(request.params.id)},function(error,result){
        console.log(result);
        response.render('detail.ejs', {data : result});
    });

});

app.get('/login',function( request , response ){
  
    response.render('login.ejs');

});

app.get('/fail',function( request , response ){
  
    response.redirect('/login');

});


app.post('/todo',function(request, response){
    
    response.send('전송 완료');

    let date = request.body.date;
    let title = request.body.title;
 
    console.log(request.body.title);

    db.collection('counter').findOne({
        name: '게시물갯수'
    },function(error,result){
        console.log(result.totalPost);
        let totalPost = result.totalPost
        db.collection('post').insertOne( { _id : totalPost+1, 'title':title,'date': date , /*_id: 100*/}, function(error,result){
            console.log('저장 완료');

            db.collection('counter').updateOne(
                {'name':'게시물갯수'},
                { $inc : {'totalPost':1} },
                function(error,result){
                if(error) {
                    console.log(error);
                }
            });
        });
    });
    
});

app.post('/login',passport.authenticate('local',{
    failureRedirect: '/fail'
}),function(request, response){
    response.redirect('/');
});



app.put('/todo',function(request, response){
    
    response.send('전송 완료');

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
            });
    });
    
});



app.delete('/delete',function( request , response ){

    request.body._id = parseInt(request.body._id);
    db.collection('post').deleteOne( request.body ,function(error,result){
        console.log('삭제완료');
        response.status(200).send({
            message:'성공했습니다.'
        });
    });

});




passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (id, pw, done) {
    console.log(id);
    db.collection('login').findOne({ id: id }, function (error, result) {
      if (error) return done(error)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
      console.log(pw);
      if (pw == result.pw) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id)
  });
  
  passport.deserializeUser(function (id, done) {
    done(null, {})
  }); 
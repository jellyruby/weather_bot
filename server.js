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

    app.listen(8089, function(){
    
        console.log('listening on 8089');
    
    });

});


app.use('/shop',require('./routes/shop.js'));

app.use('/login',require('./routes/login.js'));
app.use('/board',require('./routes/board.js'));


app.get('/',function( request , response ){

    response.render('index.ejs');

});


function login_check(request,response,next) {

    if(request.user){
        next()
    } else {
        response.redirect('/login');
    }

}



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




app.get('/mypage',login_check,function( request , response ){
  
    response.render('mypage.ejs',{user:request.user});

});




app.post('/login',passport.authenticate('local',{
    failureRedirect: '/fail'
}),function(request, response){
    response.redirect('/');
});

app.post('/register',function(request, response){
    
    db.collection('login').findOne({ id: request.body.id }, function (error, result) {
        if (error) return done(error)
    
        if (result) return done(null, false, { message: '아이디가 존재합니다.' })

        db.collection('login').insertOne( { id : request.body.id, pw: request.body.pw}, function(error,result){
            console.log('생성 완료');
    
            response.redirect('/');
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
    db.collection('login').findOne(
        { id: id }, 
        function (error, result) {

            done(null, result)
        });
    
  }); 

  


app.delete('/delete',function( request , response ){

    request.body._id = parseInt(request.body._id);

    db_data = { _id : request.body._id, author:  request.user._id }

    
    
    db.collection('post').deleteOne(db_data,function(error,result){
        console.log('삭제완료');
        let result_msg = '성공했습니다.';
        if(!result) {
            result_msg ='자신의 게시물을 삭제해주세요.';
        }
        response.status(200).send({
            message: result_msg
        });
    });

});

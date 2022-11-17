require("dotenv").config();

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

let multer = require('multer');
var storage = multer.diskStorage({

  destination : function(req, file, cb){
    cb(null, './public/image')
  },
  filename : function(req, file, cb){
    cb(null, file.originalname )
  }

});

var upload = multer({storage : storage});


MongoClient.connect('mongodb+srv://yjw001206:secondcoming7@cluster0.rx43y.mongodb.net/todoapp?retryWrites=true&w=majority',
function(error,client){

    if(error) return console.log(error);

    db = client.db('todoapp');

    app.listen(8080, function(){
    
        console.log('listening on 8080');
    
    });

});


app.use('/shop',require('./routes/shop.js'));
app.use('/login',require('./routes/login.js'));

var himawari = require('@ungoldman/himawari');


app.get('/image',function( request , response ){

  var himawari = require('@ungoldman/himawari');


  himawari({
      zoom: 1,
    outfile: process.env.PROJECTDIR+'images/earth.jpg',
      date: 'latest',
    infrared: false,
      success: function () {
        console.log("Complete!");
        process.exit();
      },
      chunk: function (info) {
        console.log('COMPLETE', (info.part+'/'+info.total), '(' + ((info.part / info.total)*100).toFixed(0)+'%' + ')');
      }
    });
  response.sendFile( process.env.PROJECTDIR+'images/earth.jpg' );

});

app.get('/crawling',async (request,response)=>{
  const crawling = require('./crawling');
  const StormInfo = crawling.GetStormInfo;
  console.log(StormInfo);

  response.send(StormInfo);


})


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

app.get('/image/:imageName', function(request, response){
    response.sendFile( __dirname + '/public/image/' + request.params.imageName )
  })

app.get('/upload', function(request, response){
    response.render('upload.ejs')
  }); 



app.get('/mypage',login_check,function( request , response ){
  
    response.render('mypage.ejs',{user:request.user});

});


app.post('/upload', upload.single('profile'), function(request, response){
    response.send('업로드완료')
  }); 

app.post('/login',passport.authenticate('local',{
    failureRedirect: '/login/fail'
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

var path = require('path');

var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        /*var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('PNG, JPG만 업로드하세요'))
        }*/
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024 * 1024
    }
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

app.use('/board',require('./routes/board.js'));
app.use('/chat',require('./routes/chat.js'));



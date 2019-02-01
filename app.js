var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var io = require("socket.io")();




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.io= io;

console.log("server running")
var arrUser=[];
var tontai=true;
io.sockets.on("connection",(socket)=>{
    console.log("co ket noi: "+socket.id);
    socket.on('client-send-data',(data)=>{
        console.log(data);
        io.sockets.emit('sever-send-data',{noidung:data})//gửi cho tất cả user
    })

    socket.on('client-register-user',(data)=>{
    if (arrUser.indexOf(data)==-1) {
        arrUser.push(data)
        tontai=false;
        console.log('Đăng ký thành công: '+data);
        //gán tên user cho socket
        socket.un=data;
        //gửi ds data user về tất cả máy
        io.sockets.emit('sever-send-user',{danhsach:arrUser})
        
    }
    else{
        tontai=true;
        console.log('user đã tồn tại: '+data);
    }

    socket.emit('server-send-result',{ketqua:tontai});//chỉ trả về cho 1 user
        
    })

    socket.on('client-send-chat',(noidung)=>{
        io.sockets.emit('server-send-chat',{chatcontent:socket.un+': '+noidung})
    })
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

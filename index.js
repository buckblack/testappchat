var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require('socket.io').listen(server);
var fs=require("fs");
server.listen(process.env.PORT || 3000);

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

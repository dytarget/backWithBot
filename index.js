var express=require('express');
var cors=require('cors');
var mysql= require('mysql');
var bodyParser=require('body-parser');
var nodemailer = require('nodemailer');
var http=require('http').createServer(app);
var io=require('socket.io')(http);
var fs = require("fs");



// const { TelegramClient } = require('messaging-api-telegram');


// const client = TelegramClient.connect('921219048:AAFxab3v0b_TpfudR1QdKbHKMrM-WfyQI9Q');

const TelegramBot = require('node-telegram-bot-api');

// // replace the value below with the Telegram token you receive from @BotFather
const token = '706253737:AAFv3LfLPKyJRVonj8bXCLYtBh6kJW5j1sI';

// // Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


var chatIdMain="-322927052";


bot.onText(/\/startBot/,(msg) => {
  chatIdMain=msg.chat.id;
  bot.sendMessage(chatIdMain,'Бот успешно подключен. Теперь сюда будут приходить сообщения от сайта porsche-almaty.kz')
  // send a message to the chat acknowledging receipt of their message
});


// client.getWebhookInfo().catch(error => {
//     console.log(error); // formatted error message
//     console.log(error.stack); // error stack trace
//     console.log(error.config); // axios request config
//     console.log(error.request); // HTTP request
//     console.log(error.response); // HTTP response
//   });


//   setInterval(()=>{client.getUpdates({limit:10}).then(res=>{
//     console.log(res);
    
// })},1000);

// client.getUpdates({limit:10}).then(res=>{
//     console.log(res);
    
// })


var app=express();



app.use(cors());
app.use(bodyParser.json());


// var connection=mysql.createConnection({
//     host     : 'localhost',
//     user     : 'bekzat',
//     password : 'Kizilorda-2000',
//     database : 'porsche'
// });

// connection.connect();
var connections=[];
io.sockets.on('connection',function(socket){
    connections.push(socket);
    
    socket.emit('message',{sendBy:'m',id:Math.floor(Math.random()*(999-100+1)+100),msg:'Добрый день, можем ли мы вам чем то помочь?'});
    socket.on('message',function(msg){
        socket.emit('message',{sendBy:'c',id:msg.id,msg:msg.msg});
        bot.sendMessage(chatIdMain,'Клиент '+msg.id+': '+msg.msg);       
    });
    bot.on('message', (msg) => {
        if (msg.reply_to_message) {
            var id=msg.reply_to_message.text.split(':')[0].split(' ')[1];
            socket.emit('message',{id:parseInt(id),sendBy:'m',msg:msg.text});
        }
    });
    socket.on('disconnect',function(){
        connections.splice(connections.indexOf(socket),1);
    });
});


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'pervyi.cifrovoi@gmail.com',
           pass: 'Kizilorda-2000'
       }
   });


app.post("/voprsy",(req,res)=>{
    const mailOptions = {
        from: 'pervyi.cifrovoi@gmail.com', // sender address
        to: 'makhanbet.kyzylorda@gmail.com', // list of receivers
        subject: 'Поступила заявка', // Subject line
        html: `<p>${req.body.name} оставил заявку на сайте porsche-almaty.kz <br/> Номер телефона: ${req.body.phone_number} <br/> E-mail: ${req.body.email}</p>`// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);    
          res.status(200).send();
    });
   
});
app.get('/voprsy',(req,res)=>{
    res.send('Hello')
});

// app.post('/voprsy',(req,res)=>{
//     connection.query("insert into voprsy(name,email,phone_number) values(?,?,?)",
//         [req.body.name,req.body.email,req.body.phone_number,req.body.message]
//         ,(error,result)=>{
//         if (error) {
//             console.log(error);
//         }
//         else{
//             res.status(200);
//             res.send("Inserted");
//         }
//     }); 
// });

// app.post('/voprsy/delete',(req,res)=>{
//     connection.query("delete from voprsy where id=?",
//         [req.body.id]
//         ,(error,result)=>{
//         if (error) {
//             console.log(error);
//         }
//         else{
//             res.status(200);
//             res.send("Deleted");
//         }
//     }); 
// });



http.listen(5000,'localhost',(err)=>{
    if (err) {
        console.log(err);
    }
    else{
        console.log("Listening port 5000");
    }
});

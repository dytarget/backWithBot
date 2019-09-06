var express=require('express');
var cors=require('cors');
var mysql= require('mysql');
var bodyParser=require('body-parser');
var nodemailer = require('nodemailer');


var app=express();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'pervyi.cifrovoi@gmail.com',
           pass: 'Kizilorda-2000'
       }
   });



app.use(cors());
app.use(bodyParser.json());


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



app.listen(4999,(err)=>{
    if (err) {
        console.log(err);
    }
    else{
        console.log("Listening port 5000");
    }
});

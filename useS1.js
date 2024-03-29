// import thu vien
const express = require('express')
const mailer = require('nodemailer')

// Tao doi tuong sever
const useS1 = express()

// Tao transporter
let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'giangpxph34542@fpt.edu.vn',
        "pass": 'fksn kkyp vbtj ioti'
    }
})

// Chuan bi thong tin
let mailOption = {
    from: 'giangpxph34542@fpt.edu.vn',
    to: 'phungxuangiang.hanoi@gmail.com',
    subject: 'test email',
    text: 'Day la email test'
}

// Gui email
transporter.sendMail(mailOption,(error, info) => {
    if(error){
        console.error(error)
    }else{
        console.log("Gui thanh cong: " + info.messageId);
    }
})

// Khoi dong server
useS1.listen(2004, ()=>{
    console.log('Sever dang chay o cong 2004')
})
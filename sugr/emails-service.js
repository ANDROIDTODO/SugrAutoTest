let nodemailer = require('nodemailer')


let emailer = {


    send: function (to, subject ,text ,attachment) {


        let transporter = nodemailer.createTransport({
            service: 'smtp.exmail.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: 'jeromeyang@sugrsugr.com',
                pass: 'Sugr140331',
            }
        })

        let mailOptions

        if (attachment != null){
            mailOptions = {
                from: '"SugrAutoTest Engine" <jeromeyang@sugrsugr.com>',
                to: to, //发送多个用逗号(,)隔开
                subject: subject,
                text: text,
                attachments:[
                    attachment
                ]
            }
        }else {
            mailOptions = {
                from: '"SugrAutoTest Engine" <jeromeyang@sugrsugr.com>',
                to: to, //发送多个用逗号(,)隔开
                subject: subject,
                text: text
            }
        }



        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        })
    },

    send: function (to, subject, text) {
        send(to,subject,text,null)
    }
}

module.exports = emailer







// attachments: [
//     {   // utf-8 string as an attachment
//         filename: 'text1.txt',
//         content: 'hello world!'
//     },
//     {   // binary buffer as an attachment
//         filename: 'text2.txt',
//         content: new Buffer('hello world!','utf-8')
//     },
//     {   // file on disk as an attachment
//         filename: 'text3.txt',
//         path: '/path/to/file.txt' // stream this file
//     },
//     {   // filename and content type is derived from path
//         path: '/path/to/file.txt'
//     },
//     {   // stream as an attachment
//         filename: 'text4.txt',
//         content: fs.createReadStream('file.txt')
//     },
//     {   // define custom content type for the attachment
//         filename: 'text.bin',
//         content: 'hello world!',
//         contentType: 'text/plain'
//     },
//     {   // use URL as an attachment
//         filename: 'license.txt',
//         path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
//     },
//     {   // encoded string as an attachment
//         filename: 'text1.txt',
//         content: 'aGVsbG8gd29ybGQh',
//         encoding: 'base64'
//     },
//     {   // data uri as an attachment
//         path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
//     },
//     {
//         // use pregenerated MIME node
//         raw: 'Content-Type: text/plain\r\n' +
//         'Content-Disposition: attachment;\r\n' +
//         '\r\n' +
//         'Hello world!'
//     }
// ]



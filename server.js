const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuid_v4 } = require('uuid');
const fs = require('fs');
const guestbookData = require('./data/guestbook.json');

const app = express();
const HTTP_PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// // create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: testAccount.user, // generated ethereal user
//         pass: testAccount.pass, // generated ethereal password
//     },
// });

app.get('/guestbook_data', (req, res) => {
    res.json(guestbookData);
})

app.post('/guestbook_submit', (req, res) => {
    const { name, message } = req.body;
    const guestbookDataCopy = [...guestbookData];
    guestbookDataCopy.push({ id: uuid_v4(), name, message, currentDate: getDate() });
    fs.writeFileSync('./data/guestbook.json', JSON.stringify(guestbookDataCopy));
})

app.post('/email', async (req, res) => {
    console.log(req.body);
    // try {
    //     await transporter.sendMail({
    //         from: req.body.email, // sender address
    //         to: "petropoulosalex@gmail.com", // list of receivers
    //         subject: req.body.subject, // Subject line
    //         text: req.body.message, // plain text body
    //     })
    // } catch (e) {
    //     console.error(e);
    // }
})

app.listen(HTTP_PORT, () => {
    console.log(`Express server listening on port ${HTTP_PORT}`);
})

const getDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
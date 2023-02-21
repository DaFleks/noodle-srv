require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { v4: uuid_v4 } = require('uuid');
const cors = require('cors');
const fs = require('fs');

const app = express();
const HTTP_PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static('public'));

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blah', // generated ethereal user
        pass: 'blah', // generated ethereal password
    },
});

app.get('/guestbook_data', (req, res) => {
    const data = fs.readFileSync('./data/guestbook.json');
    const guestbook = JSON.parse(data);
    res.status(200).json(guestbook);
})

app.post('/guestbook_submit', (req, res) => {
    const { name, message } = req.body;

    const data = fs.readFileSync('./data/guestbook.json');
    let guestbook = JSON.parse(data);

    guestbook.push({ id: uuid_v4(), name, message, currentDate: getDate() });

    try {
        fs.writeFileSync('./data/guestbook.json', JSON.stringify(guestbook));
    } catch (e) {
        console.error(e);
    }

    res.status(200).json(guestbook);
})

app.post('/email', async (req, res) => {
    try {
        await transporter.sendMail({
            from: `${req.body.name} <${req.body.email}>`, // sender address
            to: "blah", // list of receivers
            subject: req.body.subject, // Subject line
            text: `Name: ${req.body.name}\nEmail: ${req.body.email} <-- Click this email to respond.\n\n${req.body.message}`, // plain text body
        })
    } catch (e) {
        res.status(500).json({ message: e, status: 500 });
    }
    res.status(200).json({ message: `Email Successfully Sent!`, status: 200 })
})

app.listen(HTTP_PORT, () => {
    console.log(`Express server listening on port ${HTTP_PORT}`);
})

const getDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
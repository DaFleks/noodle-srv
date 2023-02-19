const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuid_v4 } = require('uuid');
const fs = require('fs');
const app = express();
const HTTP_PORT = process.env.PORT || 5000;
const guestbookData = require('./data/guestbook.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/guestbook_data', (req, res) => {
    res.json(guestbookData);
})

app.post('/guestbook_submit', (req, res) => {
    const { name, message } = req.body;
    const guestbookDataCopy = [...guestbookData];
    guestbookDataCopy.push({ id: uuid_v4(), name, message, currentDate: getDate() });
    fs.writeFileSync('./data/guestbook.json', JSON.stringify(guestbookDataCopy));
})

app.listen(HTTP_PORT, () => {
    console.log(`Express server listening on port ${HTTP_PORT}`);
})

const getDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
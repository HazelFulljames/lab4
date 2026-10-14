const express = require('express');
const path = require('path');
const { messages } = require('./lang/en/en.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Server side code to handle localhost:3000/getDate?name=NAME
app.get('/getDate', (req, res) => {
    const name = req.query.name;
    const date = new Date();
    // Must return "Hello <NAME>. Server current time and date is <DATE> in blue text color"
    res.send(`<span style="color:blue">${messages.GETDATE.replace('%1', name).replace('%2', date)}</span>`);
});

app.get('/writeFile', (req, res) => {
    const text = req.query.text;
    const fs = require('fs');
    const filePath = path.join(__dirname, 'file.txt');

    fs.appendFile(filePath, text + '\n', (err) => {
        if (err) {
            res.status(500).send(messages.FILEWRITEERROR);
        } else {
            res.send(messages.FILESUCCESS.replace('%1', text));
        }
    });
});

app.get('/readFile/:filename', (req, res) => {
    const filename = req.params.filename;
    const fs = require('fs');
    const filePath = path.join(__dirname, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.status(404).send(messages.FILENOTFOUND.replace('%1', filename));
            } else {
                res.status(500).send(messages.FILEREADERROR);
            }
        } else {
            res.send(data);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

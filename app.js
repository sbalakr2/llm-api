const express = require('express');
const bodyParser = require('body-parser');
const {spawn} = require('child_process');
const multer  = require('multer')
const cors = require('cors'); 

const upload = multer({ dest: 'uploads/' })

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('OK'));

app.post('/llm', (req, res) => {
    let dataToSend;
    
    const messages = req.body;
    console.log(messages, typeof messages, JSON.stringify(messages));

    // spawn new child process to call the python script
    const python = spawn('python3', ['chatbot.py', JSON.stringify(messages)]);

    // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();

    console.log(`result: ${dataToSend}`);

    });

    python.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);

    // send data to browser
    res.send(dataToSend);
    });
});

app.post('/llm/file', upload.single('files'), function (req, res, next) {
    let dataToSend;
    const file = req.file;
    const filename = file.path;
    const prompt = req.body.prompt;

    console.log('prompt', prompt);
    console.log('file', file);

     // spawn new child process to call the python script
     const python = spawn('python3', ['pdfbot.py', prompt, filename]);

      // collect data from script
    python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();

    console.log(`result: ${dataToSend}`);

    });

    python.stderr.on('data', data => {
        console.log(`stderr: ${data}`);
    });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);

    // send data to browser
    res.send(dataToSend);
    });
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));
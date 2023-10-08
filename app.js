const express = require('express');
const cors = require('cors'); 

const app = express();
const port = 5001;

app.use(cors());

app.get('/', (req, res) => res.send('OK'));

app.get('/llm', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Express app running on port ${port}!`));
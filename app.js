const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const port = 9000;
const cors = require("cors");
const axios = require("axios");


const apiRouter = require('./routes/api');

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(cookieParser());
app.use(express.json());


app.use('/api', apiRouter);


app.listen(port, () => {
	console.log(`listening on port: ${port}`);
});

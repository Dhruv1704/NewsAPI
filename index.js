const express = require('express');
const request = require('request');
const cors = require('cors')
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req, res)=>{
    res.send("Server Start")
})

app.post(`/getNews`, (req, res) => {

    const {country, category, page, pageSize} = req.body;

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;

    const options = {
        url: apiUrl,
        headers: {
            'User-Agent': 'News-Bulletin/1.0' // Replace with your app's identifier
        }
    };

    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
});

app.listen(port, () => {
    console.log('Proxy server listening on port 5000');
});


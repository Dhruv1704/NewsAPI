const Redis = require("ioredis");
const express = require('express');
const request = require('request');
const cors = require('cors')
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const client = new Redis(process.env.REDIS_URL);

app.get('/',(req, res)=>{
    res.send("Server Start")
})

app.post(`/getNews`, async (req, res) => {

    const {country, category, page, pageSize} = req.body;

    const cacheKey = `${country}-${category}-${page}-${pageSize}`;

    const cacheValue = await client.get(cacheKey);
    if (cacheValue) {
        res.send(JSON.parse(cacheValue));
        return;
    }

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`;

    const options = {
        url: apiUrl,
        headers: {
            'User-Agent': 'News-Bulletin/1.0'
        }
    };

    request(options, async(error, response, body) => {
        if (!error && response.statusCode === 200) {
            await client.set(cacheKey, JSON.stringify(body), 'EX', 7200);
            res.send(body);
        } else {
            res.status(response.statusCode).send(error);
        }
    });
});

app.listen(port, () => {
    console.log('Proxy server listening on port 5000');
});


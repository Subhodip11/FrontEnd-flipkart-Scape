const express = require('express');
const app = express();
const cors = require('cors');
const homePageData = require('./homePageScrape.js');
const fetchedData = require('./scrapedData.js');
const availableItems = require('./availableItemsData.js')

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/homePageData', async(req, res) => {
    return res.json(await homePageData())
})

app.get('/fetchedData/:searchFor', async(req, res) => {
    let { searchFor } = req.params;
    const responseData = await fetchedData(searchFor);
    return res.json({ responseLength: responseData.length, responseData })

})

app.listen(1234, () => console.log('Server started at port 1234...'))
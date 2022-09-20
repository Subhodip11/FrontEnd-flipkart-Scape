const request = require('request-promise');
const cheerio = require('cheerio');

const fetchHomePage = async() => {
    URL = `https://www.flipkart.com/`
    const response = await request(URL, {
        method: 'get',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9"
        },
        gzip: true
    })
    if (response) {
        const images = { images: await formatData(response) }
        return images;
    } else
        console.log("Unable to load home page")
}


async function formatData(responseHTML) {
    const $ = cheerio.load(responseHTML);
    let homePage = [];
    //Extracting all the images from the image slider (class name grabbed is unique)
    const homePageImageSlider = $(`._1mIbUg`);
    homePageImageSlider.each((i, ele) => {
        const imagesTag = $(ele).children(`._1ve3GO`).children(`._2a3TMW`).children('._1bEAQy');
        imagesTag.each(async(index, element) => {
            let src = await element.children[1].attribs.src;
            homePage.push(JSON.parse(JSON.stringify(src)));
        })
    })
    return homePage;
}

module.exports = fetchHomePage
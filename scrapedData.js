const request = require('request-promise');
const cherrio = require('cheerio');


const fetchData = async(searchFor) => {
    let pageNo = 1;
    const pageLimit = 2;
    let totalResponseData = []
        // console.log(searchFor)
    while (pageNo <= pageLimit) {
        URL = `https://www.flipkart.com/search?q=${searchFor}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&page=${pageNo}`;
        const response = await request(URL, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-Fetch-Mode": "no-cors",
                "Sec-Fetch-Site": "cross-site"
            },
            gzip: true
        })
        if (response) {
            const responseData = await formatData(response);
            for (let i = 0; i < responseData.length; i++)
                totalResponseData.push(responseData[i]);

        } else
            console.log('Unable to get data')
        pageNo++;
    }
    // console.log(totalResponseData)
    return totalResponseData;
}


const formatData = async(html) => {
    const $ = cherrio.load(html);
    let imageStore = [],
        nameStore = [],
        priceStore = [],
        ratingsStore = [],
        detailStore = []


    //Extracting all the images from the divs
    const image = $(`div[class='_2kHMtA'] > a[class='_1fQZEK'] > div[class='MIXNux'] > div[class='_2QcLo-'] > div > div[class='CXW8mj'] > img[class='_396cs4 _3exPp9']`);
    // console.log(image.attr('src'))
    image.each((i, ele) => {
        let imageObjects = ele.attributes;
        imageObjects.forEach(src => {
            if (src.name === 'src') {
                // console.log(src.value)
                imageStore.push(src.value);
            }
        })
    })

    //Extracting all the names from the div _3pLy-c row
    const names = $(`._2kHMtA > ._1fQZEK > div[class='_3pLy-c row'] > div[class='col col-7-12'] > ._4rR01T`);
    names.each((i, ele) => {
        nameStore.push($(ele).html())
            //console.log(ele.children[0].data)
            // console.log($(ele).html()) //alternative way
    })

    //Extracting all the ratings from the div _3pLy-c row
    const ratings = $(`._2kHMtA > ._1fQZEK > div[class='_3pLy-c row'] > div[class='col col-7-12'] > .gUuXy- > ._1lRcqv > ._3LWZlK`)

    ratings.each((i, ele) => {
        ratingsStore.push({
                rating: ele.children[0].data,
                review: $(ele.parent.parent.lastChild).text()
            })
            // specfic rating
            // console.log(ele.children[0].data)
            // total number of people given ratings and reviews 
            // console.log($(ele.parent.parent.lastChild).text())
    })

    //Extracting all the details from the div _3pLy-c row
    const details = $(`._2kHMtA > ._1fQZEK > div[class='_3pLy-c row'] > div[class='col col-7-12'] > .fMghEO > ._1xgFaf`)
        // console.log(details.html())

    details.each((i, ele) => {
        // console.log('-----' + i + '------')
        let temp = []
        ele.children.forEach((li) => {
            temp.push($(li).html())
                // console.log($(li).html())
        })
        detailStore.push(temp)
    })


    const priceTag = $(`._2kHMtA > ._1fQZEK > div[class='_3pLy-c row'] > div[class='col col-5-12 nlI3QM'] > ._3tbKJL > ._25b18c  `)

    priceTag.each((i, ele) => {
            let prices = ele.children
            priceStore.push({
                    price: $(prices[0]).text(),
                    actualPrice: $(prices[1]).text(),
                    discount: $(prices[2]).text()
                })
                // console.log('Prices :' + $(prices[0]).text())
                // console.log('Actual Price :' + $(prices[1]).text())
                // console.log('Discount Price :' + $(prices[2]).text())

        })
        // console.log(imageStore.length)
        // console.log(priceStore.length)
        // console.log(nameStore.length)
        // console.log(detailStore.length)
        // console.log(ratingsStore)

    let totalDataDict = []

    for (let i = 0; i < imageStore.length; i++) {
        if (ratingsStore[i])
            totalDataDict.push({
                itemImageSrc: imageStore[i],
                itemName: nameStore[i],
                itemRating: ratingsStore[i].rating,
                itemReview: ratingsStore[i].review,
                itemDetails: detailStore[i],
                itemPrice: priceStore[i].price,
                itemActualPrice: priceStore[i].actualPrice,
                itemPriceDiscount: priceStore[i].discount
            });
    }

    return totalDataDict;
}

module.exports = fetchData
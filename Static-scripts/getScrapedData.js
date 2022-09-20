let containerSelector = document.getElementById('container');
document.getElementById('search-btn').addEventListener('click', (e) => {
    containerSelector.innerHTML = ''
    const searchValue = document.getElementById('input-box').value;
    getData("mobile")

})

async function getData(searchValue) {
    URL = `http://localhost:1234/fetchedData/${searchValue}`
    fetch(URL, {
        method: 'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        mode: 'cors'
    }).then(data => {
        data.json().then(response => {
            populateDom(response)
        }).catch(err => console.log(err.message))
    }).catch(err => console.log(err.message))


    async function populateDom(res) {

        if (await res.responseLength === 0) {
            containerSelector.innerHTML = `<h4>No Data found</h1>`;
            return;
        }

        let HTML = '';

        let data = await res.responseData;

        for (let i = 0; i < await data.length; i++) {
            let itemSelector = document.createElement('div');
            itemSelector.setAttribute('class', 'item-container');
            let liList = '';
            await data[i].itemDetails.forEach(ele => liList += `<li>${ele}</li>`);

            HTML = `
 
<div class="image-container">
<img  src="${await data[i].itemImageSrc}" alt="Image Not found">
</div>
<div class="rest-container">
    <div class="name-container">
        <span>${await data[i].itemName}</span>
    </div>
    <div class="ratings-container">
        <span class="item-rating">${await data[i].itemRating}<span><img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTYuNSA5LjQzOWwtMy42NzQgMi4yMy45NC00LjI2LTMuMjEtMi44ODMgNC4yNTQtLjQwNEw2LjUuMTEybDEuNjkgNC4wMSA0LjI1NC40MDQtMy4yMSAyLjg4Mi45NCA0LjI2eiIvPjwvc3ZnPg==' /></span></span>
        <span class="item-review">${await data[i].itemReview}</span>
    </div>

<div class="details-container">
<ul class="details-ul-list">
    ${liList}
</ul>
</div>
<div class="price-container">
    <div class="item-price">${await data[i].itemPrice}</div>
    <div class="item-actual-price">${await data[i].itemActualPrice}
    </div>
    <div class="item-discount">${await data[i].itemPriceDiscount}   
    </div>
</div>
</div>
</div>

`;

            itemSelector.innerHTML = HTML;
            containerSelector.appendChild(itemSelector);

        }

    }
}

getData("wasing machine")
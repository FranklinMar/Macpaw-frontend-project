
const likeSvg = '<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 30 26">\n<path fill="#FF868E" fill-rule="evenodd" d="M8.071 2a6.071 6.071 0 0 0-4.293 ' +
    '10.364L15 23.586l11.222-11.222a6.071 6.071 0 1 0-8.586-8.586l-1.929 1.93a1 1 0 0 1-1.414 0l-1.929-1.93A6.071 ' +
    '6.071 0 0 0 8.071 2ZM0 8.071a8.071 8.071 0 0 1 13.778-5.707L15 3.586l1.222-1.222a8.071 8.071 0 0 1 11.414 ' +
    '11.414l-11.929 11.93a1 1 0 0 1-1.414 0L2.364 13.777A8.071 8.071 0 0 1 0 8.071Z" clip-rule="evenodd"/>\n</svg>';

const smileSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30">\n' +
    '<path fill="#97EAB9" fill-rule="evenodd" d="M0 15C0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 ' +
    '15-15 15-8.284 0-15-6.716-15-15ZM15 2C7.82 2 2 7.82 2 15s5.82 13 13 13 13-5.82 13-13S22.18 2 15 2Zm-5 ' +
    '10H8v-2h2v2Zm12 0h-2v-2h2v2ZM9.2 16.6l.6.8c2.6 3.467 7.8 3.467 10.4 0l.6-.8 1.6 1.2-.6.8c-3.4 4.533-10.2 ' +
    '4.533-13.6 0l-.6-.8 1.6-1.2Z" clip-rule="evenodd"/>\n</svg>';

const sadSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none" viewBox="0 0 30 30">\n' +
    '<path fill="#FFD280" fill-rule="evenodd" d="M0 15C0 6.716 6.716 0 15 0c8.284 0 15 6.716 15 15 0 8.284-6.716 ' +
    '15-15 15-8.284 0-15-6.716-15-15ZM15 2C7.82 2 2 7.82 2 15s5.82 13 13 13 13-5.82 13-13S22.18 2 15 2Zm-5 ' +
    '10H8v-2h2v2Zm12 0h-2v-2h2v2ZM7.6 20.2l.6-.8c3.4-4.533 10.2-4.533 13.6 ' +
    '0l.6.8-1.6 1.2-.6-.8c-2.6-3.467-7.8-3.467-10.4 0l-.6.8-1.6-1.2Z" clip-rule="evenodd"/>\n</svg>';

let buttons = document.getElementById("menu").getElementsByTagName("input");
// let check = null, checkBreedId = null;
let check = [];
// let home = document.getElementById("home");
// let options = document.getElementById("options");
let titleNode = document.getElementById("title");
let content = document.getElementById('content');

let galleryContent = document.getElementById("gallery-content");
let otherContent = document.getElementById("other");
let prev = document.getElementById("prev");
let next = document.getElementById("next");

let galleryBreeds = document.getElementById("galleryBreeds");

let breedsBreeds = document.getElementById("breedsBreeds");
let breedIdLabel = document.getElementById("breed-id-label");
let breedName = document.getElementById("breed-name");
let breedInfo = document.getElementById("breed-info");
let breedDesc = document.getElementById("breed-description");
let breedColumn = document.getElementById("breed-column");
let imageSelection = document.getElementById("image-selection")

let voteBreedImg = document.getElementById("vote-breed-img");
let logs = document.getElementById("logs");
let favVote = document.getElementById("fav-vote")

const key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
const sub = "user-123";
// const breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
const breedsListUrl = "https://api.thecatapi.com/v1/breeds?";
// let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page={1}&order=ASC";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search";
let favUrl = "https://api.thecatapi.com/v1/favourites";
let votesUrl = "https://api.thecatapi.com/v1/votes";


let favourites;

(async function(){
    favourites = await ajax(favUrl + `?sub_id=${sub}`, "GET");
    favourites = favourites.data;
})();


class QueryParams {
    constructor(dictionary, query, list=[], listLength) {
        this.dict = dictionary;
        this.query = query;
        this.list = list;
        this.listLength = listLength == null ? list.length : listLength;
    }
    set change(func) {
        this.changeItems = func;
    }
}


let gallery = new QueryParams({"limit": 5, "page": 0, "order": null, "breed_id": null, "mime_types": null},
    gallerySearchUrl + "?size=thumb");
gallery.change = (function () {
    let items = document.getElementsByClassName("item");

    let index = 0;
    let fav;
    // favourites = await ajax(favUrl + `?sub_id=${sub}`, "GET");
    // favourites = favourites.data;
    // console.log(favourites);
    for (let i of items) {
        i.setAttribute("data-id", this.list[index].id);
        fav = favourites.find(obj => obj['image_id'] === this.list[index].id);
        // if (favourites.some((element) => element["image_id"] === this.list[index].id)) {
        if (fav) {
            i.classList.add("fav");
            i.setAttribute("data-fav-id", fav.id);
        }
        i.style.setProperty('--background', `url(${this.list[index].url})`);
        for (let j of i.querySelectorAll(".breeds-selector")) {
            j.style.display = "none";
        }
        for (let j of i.getElementsByClassName("gallery-selector")) {
            // j.style.display = "initial";
            j.style.removeProperty("display");
        }
        index++;
    }
});


// TODO В сраку їхню пагінацію. Треба створити власну і не паритись
let breeds = new QueryParams({"limit": 5, "page": 0}, breedsListUrl);
breeds.check = document.querySelector('input[name="sort"]:checked');//null; CHECKBOX
    breeds.change = (function () {
    let items = document.getElementsByClassName("item");
    let index = 0;
    for (let i of items) {
        // i.setAttribute("data-id", this.list[index].id);
        i.setAttribute("data-breed-id", this.list[index].id);
        i.getElementsByTagName("p")[0].innerText = this.list[index].name;
        i.style.setProperty('--background', `url(${this.list[index].image.url})`);
        for (let j of i.querySelectorAll(".gallery-selector")) {
            j.style.display = "none";
        }
        for (let j of i.getElementsByClassName("breeds-selector")) {
            j.style.display = "flex";
            /*j.style.removeProperty("display");*/
        }
        index++;
    }
});
let currentParam;

let voteObject;


// Buttons check listener
function buttonsListener(bool=true) {
    /*if (check.length !== 0 && check[0] !== this) {
        check[0].checked = false;
    }*/
    if (bool) {
        let checkBoxes = document.querySelectorAll('input[name="group"]:checked');

        for (let box of checkBoxes) {
            if (box !== this) {
                box.checked = false;
            }
        }
        check[0] = this.checked ? this : null;
    }

    for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector, .voting-selector," +
        " .breeds-page-selector")) {
        i.style.display = "none";
    }

    /*check[0] = this;
    if (this.checked) {*/
    titleNode.classList.remove("fade");
    if (check[0]) {
        let title;
        $("#home").hide();
        $("#content").fadeIn();
        content.style.display = "flex";
        for (let i of document.getElementsByClassName(/*this*/check[0].id.toString() + "-selector")) {
            i.style.removeProperty("display");
        }

        if (/*this*/check[0].id === 'breeds') {
            title = "BREEDS";
            currentParam = breeds;

            // if (checkBreedId == null) {
            if (check.length < 2/*!check[1]*/) {
                void changePage(breeds, galleryContent, breeds.list.length === 0);
            } else {
                titleNode.classList.add("fade");
                void showBreed();
            }
        } else if (/*this*/check[0].id === 'gallery') {
            title = "GALLERY";
            currentParam = gallery;
            void changePage(gallery, galleryContent, gallery.list.length === 0);
        } else if (/*this*/check[0].id === 'voting') {
            title = "VOTING";
            void votesHandler();
        }
        // currentParam.changeItems();
        titleNode.innerText = title;
    } else {

        for (let button of buttons) {
            button.checked = false;
        }
        /*for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector")) {
            i.style.display = "none";
        }*/
        $("content").fadeOut();
        content.style.display = "none";
        $("#home").fadeIn();
    }
}

async function voteListener(value) {
    let body = {
        "image_id": voteObject.id,
        "sub_id": sub
    };
    let url, method;
    let fav = favourites.find(obj => obj['image_id'] === voteObject.id);
    if (Number(value) >= 0) {
        body["value"] = value;
        url = votesUrl;
        method = "POST";
    } else {
        url = fav ? favUrl + `/${fav.id}` : favUrl;
        method = fav ? "DELETE" : "POST";
        body = fav ? undefined : body;
        if (fav) {
            favVote.classList.remove("fav");
        } else {
            favVote.classList.add("fav");
        }
    }
    await ajax(url, method, body);
    if (Number(value) >= 0) {
        await votesHandler();
    } else {
        favourites = await ajax(favUrl + `?sub_id=${sub}`, "GET");
        favourites = favourites.data;
    }
}

async function votesHandler() {
    favVote.classList.remove("fav");
    voteObject = await ajax(gallerySearchUrl + `?size=full`, "GET");
    voteObject = voteObject.data[0];
    let votes = await ajax(votesUrl + `?order=DESC&sub_id=${sub}`, "GET");
    // console.log(votes.data);
    votes.data = votes.data.concat(favourites);
    votes.data.sort((a, b) => (a['created_at'] < b['created_at'] ? 1 :
        (b['created_at'] < a['created_at'] ? -1 : 0)));
    logs.innerHTML = "";
    let date, log, strong, p;
    for (let i of votes.data) {
        log = document.createElement("div");
        log.classList.add("log");
        strong = document.createElement("strong");
        date = new Date(i['created_at']);
        strong.innerText = `${date.getHours()}:${date.getMinutes()}`;
        log.appendChild(strong);
        p = document.createElement("p");
        p.innerHTML = `Image ID: <span>${i['image_id']}</span> was added to `;
        if (i.hasOwnProperty('value')) {
            p.innerHTML += i.value > 0 ? "Likes" : "Dislikes";
            log.appendChild(p);
            log.innerHTML += ((i.value > 0) ? smileSvg : sadSvg);
        } else {
            p.innerHTML += 'Favourites';
            log.appendChild(p);
            log.innerHTML += likeSvg;
        }
        // p.innerHTML = `Image ID: <span>${i['image_id']}</span> was added to ${ i.value > 0 ? "Likes" : "Dislikes"}`;
        // console.log(date);
        logs.appendChild(log);
    }
    // console.log(votes[0]);
    // console.log(image);
    // console.log(image.url);
    voteBreedImg.src = voteObject.url;/*image.url;*/
}

function limitBreeds(element){
    // breeds.dict.page = 0 ;

    breeds.dict.limit = element.options[element.selectedIndex].value;
    breeds.dict.page = 0;
    breedsBreeds.value = "0";
    breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
        (breeds.dict.page + 1) * breeds.dict.limit);
    void changePage(breeds, galleryContent, false);
}

function sortListener(element) {
    // breeds.check = document.querySelector('input[name="sort"]:checked');
    // breeds.dict.page = breeds.check.value === "ASC" ? 0 : Math.ceil(breeds.listLength/breeds.dict.limit) - 1;

    breeds.check = element;
    breedsBreeds.value = "0";
    breeds.dict.page = 0;
    breeds.fullList.sort((a, b) => (a.name > b.name) ? 1 : -1);
    if (breeds.check.value === "DESC") {
        breeds.fullList.reverse();
        // console.log("Reversed");
    }
    breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
        (breeds.dict.page + 1) * breeds.dict.limit);
    void changePage(breeds, galleryContent, false);
    /* CHECKBOX
    breeds.dict.page = 0;
    let checkBoxes = document.querySelectorAll('input[name="sort"]:checked');

    for (let box of checkBoxes) {
        if (box !== element) {
            box.checked = false;
        }
    }
    breeds.check = element.checked ? element : null;
    // console.log(breeds.check ? breeds.check.id : breeds.check);
    // let value = document.querySelector('input[name="sort"]:checked');
    let value = breeds.check;*/
}

async function breedsListener(element) {
    breeds.dict.page = 0;

    let breed = element.options[element.selectedIndex].value;
    if (breed !== "0") {
        breeds.list = [Object.assign({}, breeds.fullList.find(i => i.id === breed))];
        // console.log()
        breeds.list[0].image = (await ajax(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
            breed}`, "GET")).data[0];
    } else {
        breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
            (breeds.dict.page + 1) * breeds.dict.limit);
    }
    await changePage(breeds, galleryContent, false);
    next.setAttribute("disabled", "");
}

async function showBreed() {
    for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector, .voting-selector")) {
        i.style.display = "none";
    }
    for (let i of document.querySelectorAll(".breeds-page-selector")) {
        i.style.removeProperty("display");
    }
    breedIdLabel.innerText = check[check.length - 1];
    // let id = check[1];
    let breed = breeds.fullList.find(obj => obj.id === check[1]);
    if (!breed){
        check.pop();
        buttonsListener(false);
    }
    // console.log(breed);
    // voteBreedImg.src = breed.image.url;
    let page = ".page";
    $(page).fadeOut();
    let images = await ajax(gallerySearchUrl + `?size=full&breed_ids=${breed.id}&limit=100`, "GET");
    images = images.data;
    $(page).fadeIn();
    console.log(images)
    // voteBreedImg.src = images[0].url;
    imageSelection.innerHTML = "";
    let svg;
    for (let i of images) {
        svg = document.createElement("svg");
        if (i === images[0]) {
            svg.classList.add("active");
            voteBreedImg.src = i.url;
        }
        svg.setAttribute("data-img-url", i.url);
        svg.addEventListener('click', function () {
            // $("vote-breed-img").fadeTo("fast", 0);
            imageSelection.querySelector(".active").classList.remove("active");
            this.setAttribute("class", "active");
            voteBreedImg.src = this.getAttribute("data-img-url");
            // $("vote-breed-img").fadeTo("fast", 1);
        })
        imageSelection.appendChild(svg);
    }
    breedName.innerText = breed.name;
    breedInfo.innerText = breed['alt_names'];
    breedDesc.innerHTML = `<span>Temperament:</span><br>${breed['temperament']}`;
    let p = breedColumn.getElementsByTagName("p");
    p[0].innerHTML = `<span>Origin:</span> ${breed.origin}`;
    p[1].innerHTML = `<span>Weight:</span> ${breed.weight['metric']} kgs`;
    p[2].innerHTML = `<span>Life span:</span> ${breed['life_span']} years`;
}

function limitGallery(element){
    // galleryPage = 0;
    gallery.dict.page = 0;

    gallery.dict.limit = element.options[element.selectedIndex].value;

    void changePage(gallery, galleryContent);
}

function prevPage(element, params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }

    if (params.dict.page > 0) {
        params.dict.page--;
        void changePage(params, galleryContent, checking(params));
    }
}

function nextPage(element, params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }
    let pages = params.listLength/params.dict.limit;
    if (params.dict.page < pages) {
        params.dict.page++;
        void changePage(params, galleryContent, checking(params));
    }
}

function orderListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    prev.setAttribute("disabled", "");
    gallery.dict.order = element.options[element.selectedIndex].value;
    void changePage(gallery, galleryContent);
}

function galleryBreedsListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    let breed = element.options[element.selectedIndex].value;
    gallery.dict.breed_id = (breed === "none") ? null : breed;
    void changePage(gallery, galleryContent);
}

function typeListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    let type = element.options[element.selectedIndex].value;
    gallery.dict.mime_types = (type === "none") ? null : type;
    void changePage(gallery, galleryContent);
}

async function changePage(params, grid, queryBool=true) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }
    if (queryBool) {
        let query = params.query;
        for (let i in params.dict) {
            if (params.dict[i] != null) {
                query += `&${i}=${params.dict[i]}`;
            }
        }
        let obj = await ajax(query, "GET");
        params.list = obj.data;
        params.listLength = obj.length == null ? params.list.length : obj.length;
    }

    if (params.dict.limit > (Math.ceil(params.list.length / 5) * 5)) {
        itemGenerator(params.list.length);
    }


    let items = grid.getElementsByClassName("item");//galleryContent.getElementsByClassName("item");

    if (Math.min(params.list.length, params.dict.limit) !== items.length) {
        itemGenerator(Math.min(params.list.length, params.dict.limit));
    }

    if (params.dict.page === 0) {
        prev.setAttribute("disabled", "");
    } else {
        prev.removeAttribute("disabled");
    }

    // let listLen = queryBool ? params.listLength : params.fullList.length;
    if (Math.ceil(Number(/*listLen*/params.listLength/params.dict.limit)) <= /*breeds - <; gallery - <=*/ Number(params.dict.page + 1) ||
        (params.dict.hasOwnProperty("order") && (params.dict.order === "RANDOM" || params.dict.order == null))) {
        next.setAttribute("disabled", "");
    } else {
        next.removeAttribute("disabled");
    }
    params.changeItems();
}

function itemGenerator(curLimit) {
    let items = galleryContent.getElementsByClassName(`item`).length;

    if (curLimit !== items) {
        let sections = galleryContent.getElementsByTagName("section");

        let section, item, p;
        section = sections[sections.length - 1];
        if (Number(curLimit) > Number(items)) {
            for (let i = 0; i < curLimit - items; i++) {
                if (section == null || section.childElementCount % 5 === 0) {
                    section = document.createElement("section");
                    galleryContent.append(section);
                }

                item = document.createElement("div");
                item.setAttribute("class", `item`);
                item.style.setProperty("--background", "none");
                item.innerHTML = likeSvg;
                item.getElementsByTagName("svg")[0].classList.add("gallery-selector");
                item.addEventListener('click', clickListener);
                p = document.createElement("p");
                p.setAttribute("class", "breeds-selector");
                item.appendChild(p);
                section.appendChild(item);
            }
        } else {
            let items = galleryContent.getElementsByClassName(`item`);
            let parent;

            for (let i = items.length - 1; i >= curLimit; i--) {
                parent = items[i].parentNode;
                items[i].remove();

                if(parent.childElementCount === 0) {
                    parent.parentElement.removeChild(parent);
                }
            }
        }
    }
}

async function clickListener() {
    if (check[0].id === 'breeds') {
        let breedId = this.getAttribute("data-breed-id");
    // if (check.id === 'breeds') {
        // checkBreedId = id;
        // check[1] = id;

        check.push(breedId);
        titleNode.classList.add("fade");
        await showBreed();
    } else if (check[0].id === 'gallery') {
        let id = this.getAttribute("data-id");
        if (!this.classList.contains("fav")) {
            let body = {
                "image_id": id,
                "sub_id": sub
            };
            let fav = await ajax(favUrl, "POST", body);
            fav = fav.data;
            // void ajax(favUrl + `?sub_id=${sub}`, "GET");
            this.classList.add("fav");
            this.setAttribute("data-fav-id", fav.id);
        } else {
            // void ajax(favUrl + `/${this.getAttribute("data-id")}`, "DELETE");
            void await ajax(favUrl + `/${this.getAttribute("data-fav-id")}`, "DELETE");
            this.classList.remove("fav");
        }
        favourites = await ajax(favUrl + `?sub_id=${sub}`, "GET");
        favourites = favourites.data;
    }
}

function checking(params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }

    let bool;
    if (params.hasOwnProperty("fullList")) {
        bool = false;
        params.list = params.fullList.slice(params.dict.page * params.dict.limit,
            (params.dict.page + 1) * params.dict.limit);
    } else {
        bool = true;
    }
    return bool;
}

async function ajax(url, method, body) {
    console.log(url);
    let object = {
        method: method,
        headers: { 'x-api-key': key, "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
    /*if (method === "POST") {
        object.body = body;
    }*/
    // console.log(response);
    /*for (let i of response.headers.keys()) {
        console.log(`${i} : ${response.headers.get(i)}`);
    }*/


    let response = await fetch(url, object);
    object = {};
    for (let i of response.headers.keys()) {
        object[i] = response.headers.get(i);
    }
    console.log(object);
    let data = await response.json();
    console.log(data);
    return {"data": data, "length": object["pagination-count"]};

    /*return fetch(url, object).then(response => {
        object = {};
        for (let i of response.headers.keys()) {
            object[i] = response.headers.get(i);
        }
        console.log(object);
        return response.json();
    }).then(data => {
        console.log(data);
        // console.log({"data": data, "length": object["pagination-count"]});
        return {"data": data, "length": object["pagination-count"]};
    }).catch(function(err) {
        console.log(err);
    });*/
    /*let xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            // console.log(this.getAllResponseHeaders());
        }
    });
    xmlHttp.open(method, url, false);
    xmlHttp.setRequestHeader("x-api-key", key);
    // xmlHttp.setRequestHeader("Access-Control-Expose-Headers", "Pagination-Count");
    xmlHttp.send();

    let pages;
    try {
        pages = xmlHttp.getResponseHeader("Pagination-Count");
    } catch (e) {
        pages = null;
    }
    return {"data": JSON.parse(xmlHttp.responseText), "length": pages};*/
    /*xmlHttp.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
        let pages;
        try {
            pages = xmlHttp.getResponseHeader("Pagination-Count");
        } catch (e) {
            pages = null;
        }
        return {"data": JSON.parse(xmlHttp.responseText), "length": pages};
    });
    xmlHttp.open("GET", url);
    xmlHttp.setRequestHeader("x-api-key", key);
    // xmlHttp.setRequestHeader("Access-Control-Expose-Headers", "Pagination-Count");
    xmlHttp.send();*/
    // console.log(xmlHttp.getAllResponseHeaders());//getResponseHeader("Pagination-Count"));


    // return {"data": JSON.parse(xmlHttp.responseText), "length": galleryOrder !== "RANDOM" ?
    //         xmlHttp.getResponseHeader("Pagination-Count") : 0};
}

// Adding buttons listeners
for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}

// Initializing breeds list
// let breedsObj = ajax(breedsListUrl);
(async function(){
    let option;
    // let obj = await ajax(breedsListUrl, "GET");
    // console.log(obj);
    // console.log(obj.data);
    // breeds.fullList = obj.data;
    breeds.fullList = await ajax(breedsListUrl, "GET");
    breeds.fullList = breeds.fullList.data;
    for (let item of breeds.fullList/*breedsObj.data*//*breeds.list*/) {
        option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.name;
        galleryBreeds.appendChild(option);
        breedsBreeds.appendChild(option.cloneNode(true));

        if (!item.image) {
            item.image = await ajax(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
                    item.id}`, "GET");
            item.image = item.image.data[0];
        }
}
breeds.listLength = breeds.fullList.length;
})();
// Add "skeleton" of content grid
itemGenerator(5);


function popUp(bool=true) {
    if (bool) {
        $("#fade").fadeIn();
    } else {
        $("#fade").fadeOut();
    }
}

popUp(false);
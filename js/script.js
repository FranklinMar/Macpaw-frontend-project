
const likeSvg = '<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 30 26" ' +
    'class="gallery-selector">\n<path fill="#FF868E" fill-rule="evenodd" d="M8.071 2a6.071 6.071 0 0 0-4.293 ' +
    '10.364L15 23.586l11.222-11.222a6.071 6.071 0 1 0-8.586-8.586l-1.929 1.93a1 1 0 0 1-1.414 0l-1.929-1.93A6.071 ' +
    '6.071 0 0 0 8.071 2ZM0 8.071a8.071 8.071 0 0 1 13.778-5.707L15 3.586l1.222-1.222a8.071 8.071 0 0 1 11.414 ' +
    '11.414l-11.929 11.93a1 1 0 0 1-1.414 0L2.364 13.777A8.071 8.071 0 0 1 0 8.071Z" clip-rule="evenodd"/>\n</svg>';

let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
// let home = document.getElementById("home");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
// let options = document.getElementById("options");
let content = document.getElementById('content');
let mainContent = document.getElementById("main-content");
let galleryBreeds = document.getElementById("galleryBreeds");
let breedsBreeds = document.getElementById("breedsBreeds");

const key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
const sub = "user-123";
// const breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
const breedsListUrl = "https://api.thecatapi.com/v1/breeds?";
// let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page={1}&order=ASC";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=thumb";
let favUrl = "https://api.thecatapi.com/v1/favourites";


let favourites;

(async function(){
    favourites = await ajax_get(favUrl + `?sub_id=${sub}`, "GET");
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
    gallerySearchUrl);
gallery.change = (function () {
    let items = document.getElementsByClassName("item");

    let index = 0;
    let fav;
    // favourites = await ajax_get(favUrl + `?sub_id=${sub}`, "GET");
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
        for (let j of i.getElementsByClassName("gallery-selector")) {
            j.style.display = "initial";
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
        i.getElementsByTagName("p")[0].innerText = this.list[index].name;
        i.style.setProperty('--background', `url(${this.list[index].image.url})`);
        for (let j of i.getElementsByClassName("breeds-selector")) {
            j.style.display = "flex";
        }
        index++;
    }
});
let currentParam;



// Buttons check listener
function buttonsListener() {
    if (check && check !== this) {
        check.checked = false;
    }

    for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector, .voting-selector")) {
        i.style.display = "none";
    }

    check = this;
    if (this.checked) {
        let title = null;
        $("#home").hide();
        $("#content").fadeIn();
        content.style.display = "flex";
        for (let i of document.getElementsByClassName(this.id.toString() + "-selector")) {
            i.style.removeProperty("display");
        }

        if (this.id === 'breeds') {
            title = "BREEDS";
            currentParam = breeds;

            void changePage(breeds, breeds.list.length === 0);
        } else if (this.id === 'gallery') {
            title = "GALLERY";
            currentParam = gallery;
            void changePage(gallery, gallery.list.length === 0);
        } else if (this.id === 'voting') {
            title = "VOTING";
        }
        // currentParam.changeItems();
        document.getElementById("title").innerText = title;
    } else {

        for (let button of buttons) {
            button.checked = false;
        }
        for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector")) {
            i.style.display = "none";
        }
        $("content").fadeOut();
        content.style.display = "none";
        $("#home").fadeIn();
    }
}

function limitBreeds(element){
    // breeds.dict.page = 0 ;

    breeds.dict.limit = element.options[element.selectedIndex].value;
    breeds.dict.page = 0;
    breedsBreeds.value = "0";
    breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
        (breeds.dict.page + 1) * breeds.dict.limit);
    void changePage(breeds, false);
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
    void changePage(breeds, false);
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
        breeds.list[0].image = (await ajax_get(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
            breed}`, "GET")).data[0];
    } else {
        breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
            (breeds.dict.page + 1) * breeds.dict.limit);
    }
    await changePage(breeds, false);
    next.setAttribute("disabled", "");
}

function limitGallery(element){
    // galleryPage = 0;
    gallery.dict.page = 0;

    gallery.dict.limit = element.options[element.selectedIndex].value;

    void changePage(gallery);
}

function prevPage(element, params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }

    if (params.dict.page > 0) {
        params.dict.page--;
        void changePage(params, checking(params));
    }
}

function nextPage(element, params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }
    let pages = params.listLength/params.dict.limit;
    if (params.dict.page < pages) {
        params.dict.page++;
        void changePage(params, checking(params));
    }
}

function orderListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    prev.setAttribute("disabled", "");
    gallery.dict.order = element.options[element.selectedIndex].value;
    void changePage(gallery);
}

function galleryBreedsListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    let breed = element.options[element.selectedIndex].value;
    gallery.dict.breed_id = (breed === "none") ? null : breed;
    void changePage(gallery);
}

function typeListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    let type = element.options[element.selectedIndex].value;
    gallery.dict.mime_types = (type === "none") ? null : type;
    void changePage(gallery);
}

async function changePage(params, queryBool=true) {
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
        let obj = await ajax_get(query, "GET");
        params.list = obj.data;
        params.listLength = obj.length == null ? params.list.length : obj.length;
    }

    if (params.dict.limit > (Math.ceil(params.list.length / 5) * 5)) {
        itemGenerator(params.list.length);
    }


    let items = mainContent.getElementsByClassName("item");

    if (Math.min(params.list.length, params.dict.limit) !== items.length) {
        itemGenerator(Math.min(params.list.length, params.dict.limit));
    }

    if (params.dict.page === 0) {
        prev.setAttribute("disabled", "");
    } else {
        prev.removeAttribute("disabled");
    }

    if (Math.ceil(Number(params.listLength/params.dict.limit)) <= /*breeds - <; gallery - <=*/ Number(params.dict.page + 1) ||
        (params.dict.hasOwnProperty("order") && (params.dict.order === "RANDOM" || params.dict.order == null))) {
        next.setAttribute("disabled", "");
    } else {
        next.removeAttribute("disabled");
    }
    params.changeItems();
}

function itemGenerator(curLimit) {
    let items = mainContent.getElementsByClassName(`item`).length;

    if (curLimit !== items) {
        let sections = mainContent.getElementsByTagName("section");

        let section, item, p;
        section = sections[sections.length - 1];
        if (Number(curLimit) > Number(items)) {
            for (let i = 0; i < curLimit - items; i++) {
                if (section == null || section.childElementCount % 5 === 0) {
                    section = document.createElement("section");
                    mainContent.append(section);
                }

                item = document.createElement("div");
                item.setAttribute("class", `item`);
                item.style.setProperty("--background", "none");
                item.innerHTML = likeSvg;
                item.addEventListener('click', clickListener);
                p = document.createElement("p");
                p.setAttribute("class", "breeds-selector");
                item.appendChild(p);
                section.appendChild(item);
            }
        } else {
            let items = mainContent.getElementsByClassName(`item`);
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
    if (check.id === 'breeds') {

    } else if (check.id === 'gallery') {
        if (!this.classList.contains("fav")) {
            let body = {
                "image_id": this.getAttribute("data-id"),
                "sub_id": sub
            };
            let fav = await ajax_get(favUrl, "POST", body);
            fav = fav.data;
            // void ajax_get(favUrl + `?sub_id=${sub}`, "GET");
            this.classList.add("fav");
            this.setAttribute("data-fav-id", fav.id);
        } else {
            // void ajax_get(favUrl + `/${this.getAttribute("data-id")}`, "DELETE");
            void await ajax_get(favUrl + `/${this.getAttribute("data-fav-id")}`, "DELETE");
            this.classList.remove("fav");
        }
        favourites = await ajax_get(favUrl + `?sub_id=${sub}`, "GET");
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

async function ajax_get(url, method, body) {
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
// let breedsObj = ajax_get(breedsListUrl);
(async function(){
    let option;
    // let obj = await ajax_get(breedsListUrl, "GET");
    // console.log(obj);
    // console.log(obj.data);
    // breeds.fullList = obj.data;
    breeds.fullList = await ajax_get(breedsListUrl, "GET");
    breeds.fullList = breeds.fullList.data;
    for (let item of breeds.fullList/*breedsObj.data*//*breeds.list*/) {
        option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.name;
        galleryBreeds.appendChild(option);
        breedsBreeds.appendChild(option.cloneNode(true));

        if (!item.image) {
            item.image = await ajax_get(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
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
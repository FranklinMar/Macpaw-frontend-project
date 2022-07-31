const likeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="none" viewBox="0 0 20 24">\n' +
    '\t<path fill="#FF868E" fill-rule="evenodd" d="M5.38 1.803c-2.235 0-4.047 2.451-4.047 5.475 0 1.452.427 2.844 ' +
    '1.186 3.87L10 21.269l7.481-10.12c.76-1.026 1.186-2.418 1.186-3.87 0-3.024-1.812-5.475-4.048-5.475-1.073 ' +
    '0-2.103.577-2.862 1.604l-1.286 1.74c-.26.351-.682.351-.942 0l-1.286-1.74C7.483 2.38 6.454 1.803 5.38 1.803ZM0 ' +
    '7.278C0 3.258 2.409 0 5.38 0c1.428 0 2.796.767 3.805 2.132L10 3.233l.815-1.101C11.824.767 13.192 0 14.619 0 ' +
    '17.591 0 20 3.258 20 7.278c0 1.93-.567 3.78-1.576 5.146L10.471 23.18c-.26.352-.682.352-.942 0L1.576 12.424C.566 ' +
    '11.059 0 9.208 0 7.278Z" clip-rule="evenodd"/>\n' +
    '</svg>\n';

let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
let home = document.getElementById("home");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
// let options = document.getElementById("options");
let mainContent = document.getElementById("main-content");
let galleryBreeds = document.getElementById("galleryBreeds");
let breedsBreeds = document.getElementById("breedsBreeds");

const key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
// const breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
const breedsListUrl = "https://api.thecatapi.com/v1/breeds?";
// let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page={1}&order=ASC";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=thumb";

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
gallery.change = function () {
    let items = document.getElementsByClassName("item");

    let index = 0;
    for (let i of items) {
        i.style.alignItems = "center";
        i.firstElementChild.style.width = "fit-content";
        i.firstElementChild.innerHTML = likeSvg;
        i.style.setProperty('--background', `url(${this.list[index].url})`);
        index++;
    }
}


// TODO В сраку їхню пагінацію. Треба створити власну і не паритись
let breeds = new QueryParams({"limit": 5, "page": 0}, breedsListUrl);
breeds.check = document.querySelector('input[name="sort"]:checked');//null; CHECKBOX
    breeds.change = function () {
    let items = document.getElementsByClassName("item");
    let index = 0;
    for (let i of items) {
        i.style.alignItems = "end";
        i.firstElementChild.style.width = "100%";
        i.firstElementChild.innerHTML = this.list[index].name;
        /*if (this.list[index].image) {
            i.style.setProperty('--background', `url(${this.list[index].image.url})`);
        } else {
            i.style.setProperty('--background', "url(" +
                ajax_get(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
                    this.list[index].id}`).data[0].url + ")");
        }*/
        i.style.setProperty('--background', `url(${this.list[index].image.url})`);
        index++;
    }
}
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
        home.style.display = "none";
        document.getElementById('content').style.display = "flex";
        for (let i of document.getElementsByClassName(this.id.toString() + "-selector")) {
            i.style.removeProperty("display");
        }

        if (this.id === 'breeds') {
            title = "BREEDS";
            currentParam = breeds;

            changePage(breeds, breeds.list.length === 0);
        } else if (this.id === 'gallery') {
            title = "GALLERY";
            currentParam = gallery;
            changePage(gallery, gallery.list.length === 0);
        } else if (this.id === 'voting') {
            title = "VOTING";
        }
        currentParam.changeItems();
        // document.getElementById("title").innerText = title;
        for (let i of document.getElementsByClassName("title")) {
            i.innerText = title;
        }
    } else {

        for (let button of buttons) {
            button.checked = false;
        }
        for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector")) {
            i.style.display = "none";
        }
        document.getElementById('content').style.display = "none";
        home.style.display = "initial";
    }
}

function limitBreeds(element){
    // breeds.dict.page = 0 ;

    /* OLD
    breeds.dict.limit = element.options[element.selectedIndex].value;
    breeds.dict.page = breeds.check.value === "ASC" ? 0 : Math.ceil(breeds.listLength/breeds.dict.limit) - 1;
    changePage(breeds);*/

    breeds.dict.limit = element.options[element.selectedIndex].value;
    breeds.dict.page = 0;
    breedsBreeds.value = "0";
    breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
        (breeds.dict.page + 1) * breeds.dict.limit);
    changePage(breeds, false);
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
    changePage(breeds, false);
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

function breedsListener(element) {
    breeds.dict.page = 0;

    let breed = element.options[element.selectedIndex].value;
    if (breed !== "0") {
        breeds.list = [Object.assign({}, breeds.fullList.find(i => i.id === breed))];
        // console.log()
        breeds.list[0].image = ajax_get(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
            breed}`).data[0];
    } else {
        breeds.list = breeds.fullList.slice(breeds.dict.page * breeds.dict.limit,
            (breeds.dict.page + 1) * breeds.dict.limit);
    }
    changePage(breeds, false);
    next.setAttribute("disabled", "");
}

function limitGallery(element){
    // galleryPage = 0;
    gallery.dict.page = 0;

    gallery.dict.limit = element.options[element.selectedIndex].value;

    changePage(gallery);
}

function prevPage(element, params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }

    if (params.dict.page > 0) {
        params.dict.page--;
        let bool;
        if (params.hasOwnProperty("fullList")) {
            bool = false;
            params.list = params.fullList.slice(params.dict.page * params.dict.limit,
                (params.dict.page + 1) * params.dict.limit);
        } else {
            bool = true;
        }
        changePage(params, bool);
    }
}

function nextPage(element, params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }
    let pages = params.listLength/params.dict.limit;
    if (params.dict.page < pages) {
        params.dict.page++;
        let bool;
        if (params.hasOwnProperty("fullList")) {
            bool = false;
            params.list = params.fullList.slice(params.dict.page * params.dict.limit,
                (params.dict.page + 1) * params.dict.limit);
        } else {
            bool = true;
        }
        changePage(params, bool);
    }
}

function orderListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    prev.setAttribute("disabled", "");
    gallery.dict.order = element.options[element.selectedIndex].value;
    changePage(gallery);
}

function galleryBreedsListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    let breed = element.options[element.selectedIndex].value;
    gallery.dict.breed_id = (breed === "none") ? null : breed;
    changePage(gallery);
}

function typeListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    let type = element.options[element.selectedIndex].value;
    gallery.dict.mime_types = (type === "none") ? null : type;
    changePage(gallery);
}

function changePage(params, queryBool=true) {
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
        let obj = ajax_get(query);
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

        let section, item, label;
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
                label = document.createElement("div");
                item.append(label);
                label.setAttribute("class", "label");
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

function ajax_get(url) {
    console.log(url);
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            // console.log(this.responseText);
            // console.log(this.getAllResponseHeaders());
        }
    });
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader("x-api-key", key);
    // xmlHttp.setRequestHeader("Access-Control-Expose-Headers", "Pagination-Count");
    xmlHttp.send();

    let pages;
    try {
        pages = xmlHttp.getResponseHeader("Pagination-Count");
    } catch (e) {
        pages = null;
    }
    return {"data": JSON.parse(xmlHttp.responseText), "length": pages};
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
let option;
breeds.fullList = ajax_get(breedsListUrl).data;
for (let item of breeds.fullList/*breedsObj.data*//*breeds.list*/) {
    option = document.createElement("option");
    option.value = item.id;
    option.innerText = item.name;
    galleryBreeds.appendChild(option);
    breedsBreeds.appendChild(option.cloneNode(true));

    if (!item.image) {
        item.image = ajax_get(`https://api.thecatapi.com/v1/images/search?size=thumb&order=ASC&breed_id=${
                item.id}`).data[0];
    }
}
breeds.listLength = breeds.fullList.length;

// Add "skeleton" of content grid
itemGenerator(5);
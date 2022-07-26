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
let options = document.getElementById("options");
let mainContent = document.getElementById("main-content");

const key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
const breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
// let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page={1}&order=ASC";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=thumb";

class QueryParams {
    constructor(dictionary, query, queryEnable=true, list=[], listLength) {
        this.dict = dictionary;
        this.query = query;
        this.queryBool = queryEnable;
        this.list = list;
        this.listLength = listLength == null ? list.length : listLength;
    }
    set change(func) {
        this.changeItems = func;
    }
}

/*let galleryPage = 0, galleryList = [], galleryLimit = 5,
    galleryListLength = galleryList.length, galleryBreed = null, type = null, galleryOrder = "RANDOM";*/
let gallery = new QueryParams({"limit": 5, "page": 0, "order": null, "breed_id": null, "mime_types": null},
    gallerySearchUrl);
gallery.change = function () {
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "center";
        i.firstElementChild.style.width = "fit-content";
        i.firstElementChild.innerHTML = likeSvg;
    }
}
/*let breedsPage = 0, breedsList = [], breedsLimit,
    breedsListLength = breedsList.length, breedsBreed = 0;*/
let breeds = new QueryParams({});
breeds.change = function () {
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "end";
        i.firstElementChild.style.width = "100%";
        i.firstElementChild.innerHTML = "Breed";
    }
}
let currentParam;
/*query += `&limit=${curLimit}`;

if (curPage != null) {
    query += `&page=${curPage}`;
}
if (curOrder != null) {
    query += `&order=${curOrder}`;
}
if (curBreed != null) {
    query += `&breed_id=${curBreed}`;
}
if (curType != null) {
    query += `&mime_types=${curType}`;
}*/


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
            /*let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "end";
                i.firstElementChild.style.width = "100%";
                i.firstElementChild.innerHTML = "Breed";
            }*/
            for (let i of options.getElementsByTagName("input")) {
                i.checked = false;
            }
        } else if (this.id === 'gallery') {
            title = "GALLERY";
            currentParam = gallery;
            // if (galleryOrder === "RANDOM") {
            // if (gallery.dict.order === "RANDOM" || gallery.dict.order == null) {
            //     next.setAttribute("disabled", "");
            // } else {
            //     next.removeAttribute("disabled");
            // }
            // galleryLimit(document.getElementById("galleryLimit"));
            // itemGenerator(galleryLimit/*limit < 5 ? 5 : limit*/);

            // if (galleryPage === galleryListLength/galleryLimit) {
            // if (gallery.dict.page === gallery.listLength/gallery.dict.limit) {
            //     next.setAttribute("disabled", "");
            // } else if(next.hasAttribute("disabled")) {
            //     next.removeAttribute("disabled");
            // }
            // changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);


            changePage(gallery);
            /*if (Number(gallery.listLength/gallery.list.length) >= Number(gallery.dict.page + 1)
                && (gallery.dict.order === "RANDOM" || gallery.dict.order == null)) {
                next.setAttribute("disabled", "");
            }*/



        } else if (this.id === 'voting') {
            title = "VOTING";
        }
        currentParam.changeItems();
        document.getElementById("title").innerText = title;
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
    breeds.dict.page = 0;
    // galleryPage = 0;
    // breeds = 0;
    // prev.setAttribute("disabled", "");
    // limit = element.options[element.selectedIndex].value;
    // changePage(limit, page);
    // itemGenerator(element.options[element.selectedIndex].value);


    //galleryLimit = element.options[element.selectedIndex].value;
    //changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);

    breeds.dict.limit = element.options[element.selectedIndex].value;
    changePage(breeds);
    /*let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "end";
        i.firstElementChild.style.width = "100%";
        i.firstElementChild.innerHTML = "Breed";
    }*/
}

function limitGallery(element){
    // galleryPage = 0;
    gallery.dict.page = 0;
    // prev.setAttribute("disabled", "");
    // limit = element.options[element.selectedIndex].value;
    // changePage(limit, page);


    // galleryLimit = element.options[element.selectedIndex].value;//curLimit;
    gallery.dict.limit = element.options[element.selectedIndex].value;

    // itemGenerator(galleryLimit);//element.options[element.selectedIndex].value);
    // changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);
    changePage(gallery);
    /*let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "center";
        i.firstElementChild.style.width = "fit-content";
        i.firstElementChild.innerHTML = likeSvg;
    }*/
}

function prevPage(element, params) {
    //console.log(page);
    /*if (galleryPage > 0) {
        galleryPage--;
        changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);

        next.removeAttribute("disabled");
    }*/
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }

    if (params.dict.page > 0) {
        params.dict.page--;
        // next.removeAttribute("disabled");
        changePage(params);
    }

    // if (galleryPage === 0) {
    /*if (params.dict.page === 0) {
        element.setAttribute("disabled", "");
    } else if(element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
    }*/
}

function nextPage(element, params) {
    //console.log(page);
    /*if (galleryPage < galleryListLength/galleryLimit) {
        galleryPage++;

        prev.removeAttribute("disabled");
        changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);
    }*/
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }
    let pages = params.listLength/params.dict.limit;
    if (params.dict.page < pages) {
        params.dict.page++;
        // prev.removeAttribute("disabled");
        changePage(params);
    }

    // if (galleryPage === galleryListLength/galleryLimit) {
    /*if (params.dict.page === pages) {
        element.setAttribute("disabled", "");
    } else if(element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
    }*/
}

function orderListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    prev.setAttribute("disabled", "");
    /*galleryOrder = element.options[element.selectedIndex].value;
    if (galleryOrder === "RANDOM") {*/
    gallery.dict.order = element.options[element.selectedIndex].value;
    /*if (gallery.dict.order === "RANDOM" || gallery.dict.order == null) {
        next.setAttribute("disabled", "");
        //console.log(true);
    } else {
        next.removeAttribute("disabled");
        //console.log(false);
    }
    changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);*/
    changePage(gallery);
    /*if (Number(gallery.listLength/gallery.list.length) >= Number(gallery.dict.page + 1) &&
        (gallery.dict.order === "RANDOM" || gallery.dict.order == null)) {
        next.setAttribute("disabled", "");
        //console.log(true);
    }*/
}

function galleryBreedsListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    // prev.setAttribute("disabled", "");
    /*galleryBreed = element.options[element.selectedIndex].value;
    if (galleryBreed === "none") {
        galleryBreed = null;
    }
    changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);*/
    let breed = element.options[element.selectedIndex].value;
    gallery.dict.breed_id = (breed === "none") ? null : breed;
    changePage(gallery);
}

function typeListener(element) {
    // galleryPage = 0;
    gallery.dict.page = 0;
    // prev.setAttribute("disabled", "");
    let type = element.options[element.selectedIndex].value;
    /*if (type === "none") {
        type = null;
    }*/
    gallery.dict.mime_types = (type === "none") ? null : type;
    // changePage(galleryLimit, galleryPage, galleryOrder, galleryBreed, type);
    changePage(gallery);
}

// function changePage(curLimit, curPage, curOrder, curBreed, curType) {
function changePage(params) {
    if (!(params instanceof QueryParams)) {
        throw new Error("Invalid type param");
    }
    // let query = gallerySearchUrl;
    // if (curLimit == null) {
    //     return;
    // }
    // if (!Array.isArray(curLimit)) {
    //     query += `&limit=${curLimit}`;
    //
    //     if (curPage != null) {
    //         query += `&page=${curPage}`;
    //     }
    //     if (curOrder != null) {
    //         query += `&order=${curOrder}`;
    //     }
    //     if (curBreed != null) {
    //         query += `&breed_id=${curBreed}`;
    //     }
    //     if (curType != null) {
    //         query += `&mime_types=${curType}`;
    //     }
    //     let obj = ajax_get(query);
    //     galleryList = obj.data;
    //     galleryListLength = obj.length;
    // } else {
    //     galleryList = curLimit;
    // }
    if (params.queryBool) {
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

    // let items = mainContent.getElementsByClassName("item");
    // console.log("WHY ISN'T IT WORKING?");
    // console.log(`LIMIT: ${limit} ; LENGTH: ${list.length}`);

    if (params.dict.limit > (Math.ceil(params.list.length / 5) * 5)) {
        // params.dict.limit = (Math.ceil(params.list.length / 5) * 5);
        itemGenerator(params.list.length);
    }


    /*if (galleryLimit > (Math.ceil(galleryList.length / 5) * 5)) {
        galleryLimit = (Math.ceil(galleryList.length / 5) * 5);
        // limit -= 5;
        // itemGenerator(limit - Math.ceil(list.length / 5) * 5);
        itemGenerator(galleryList.length);
        // items = mainContent.getElementsByClassName("item");
    }*/


    let items = mainContent.getElementsByClassName("item");

    if (params.list.length !== items.length) {
        itemGenerator(params.list.length);
    }
    /*if (galleryList.length !== items.length) {
        itemGenerator(galleryList.length);
    }*/
    let i = 0;


    // console.log(`ITEMS: ${items.length} ; LENGTH: ${list.length}`);
    // console.log("WORKED!");
    for (let item of items) {
        // item.style.toString().replace("/\\--background: url(.*?\\);/g", `--background: url(${list[i].url});`);
        // item.style.backgroundImage = `url(${list[i].url})`;
        /*if (list[i]) {
            console.log(list[i]);
            item.style.setProperty('--background', `url(${list[i].url})`);
        } else {
            item.remove();
        }*/
        // if (i > list.length - 1) {
        //     item.remove();
        // } else {
            item.style.setProperty('--background', `url(${params.list[i].url})`);
        // }
        i++;
    }

    if (params.dict.page === 0) {
        prev.setAttribute("disabled", "");
    } else {
        prev.removeAttribute("disabled");
    }

    // console.log(`CONDITION: (${params.listLength}/${params.dict.limit} = ${Math.round(Number(params.listLength/params.list.length))}) > ${params.dict.page + 1}`);
    if (Math.round(Number(params.listLength/params.dict.limit)) <= Number(params.dict.page + 1) ||
        (params.dict.hasOwnProperty("order") && (params.dict.order === "RANDOM" || params.dict.order == null))) {
        next.setAttribute("disabled", "");
        // console.log("disable");
    } else {
        next.removeAttribute("disabled");
    }
    params.changeItems();

    // items = mainContent.getElementsByClassName("item");
    // console.log(`ITEMS: ${items.length} ; LENGTH: ${list.length}`);


    /*let sections = mainContent.getElementsByTagName("section");
    for (let section of sections) {
        if (section.getElementsByClassName('item').length === 0) {
            section.remove();
        }
    }*/
}

function itemGenerator(curLimit) {
    let items = mainContent.getElementsByClassName(`item`).length;


    // console.log(`CURLIMIT: ${curLimit} ; ITEMLENGTH: ${items}`);


    if (curLimit !== items) {
        // content.innerHTML = "";
        let sections = mainContent.getElementsByTagName("section");

        let section, item, label;
        // console.log(sections);
        section = sections[sections.length - 1];
        // let iterator = list.entries();
        if (Number(curLimit) > Number(items)) {
            for (let i = 0; i < curLimit - items; i++) {
                if (section == null || section.childElementCount % 5 === 0) {
                    section = document.createElement("section");
                    // if (Math.round(i/5) % 2) {
                    //     section.setAttribute("reverse", "");
                    // }
                    mainContent.append(section);
                }

                item = document.createElement("div");
                item.setAttribute("class", `item`);
                item.style.setProperty("--background", "none");
                // item.setAttribute("style", "--background: url( );")
                // item.style = `--background: url(${list[i].url});`;
                // item.style = `--background: ${iterator.next().value.url};`;
                label = document.createElement("div");
                item.append(label);
                label.setAttribute("class", "label");
                section.appendChild(item);
            }
        } else {
            let items = mainContent.getElementsByClassName(`item`);
            // let items = mainContent.querySelector(".item .")
            //console.log((limit - curLimit)/5);
            let parent;


            // console.log(`INSIDE GENERATOR\nITEMS: ${items.length}\nCURLIMIT: ${curLimit}`)


            for (let i = items.length - 1; i >= curLimit; i--) {
                parent = items[i].parentNode;
                items[i].remove();


                // console.log(`INSIDE GENERATOR\nPARENT CHILD ITEMS: ${parent.childElementCount}`);


                if(parent.childElementCount === 0) {
                    parent.parentElement.removeChild(parent);
                }
            }

            /*let section = mainContent.getElementsByTagName("section");
            for (let i = (items - curLimit)/5; i >= curLimit/5; i--) {
                mainContent.removeChild(section[i]);
            }*/
        }
        //galleryLimit = curLimit;
    }
}

function ajax_get(url) {
    console.log(url);
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
            console.log(this.getResponseHeader("Pagination-Count"));
        }
    });
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader("x-api-key", key);
    // xmlHttp.setRequestHeader("Access-Control-Expose-Headers", "Pagination-Count");
    xmlHttp.send();
    // console.log(xmlHttp.getAllResponseHeaders());//getResponseHeader("Pagination-Count"));

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
let galleryBreeds = document.getElementById("galleryBreeds");
let breedsBreeds = document.getElementById("breedsBreeds");
let breedsArray = ajax_get(breedsListUrl).data;
let option;
for (let item of breedsArray) {
    option = document.createElement("option");
    option.value = item.id;
    option.innerText = item.name;
    galleryBreeds.appendChild(option);
    breedsBreeds.appendChild(option.cloneNode(true));
}

// Add "skeleton" of content grid
itemGenerator(5);
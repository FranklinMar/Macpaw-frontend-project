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
let mainContent = document.getElementById("main-content");

const key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
const breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
// let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page={1}&order=ASC";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=thumb";

let page = 0, listLength = 0, limit = 5;
let list = null, order = "RANDOM", breed = null, type = null;


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
            let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "end";
                i.firstElementChild.style.width = "100%";
                i.firstElementChild.innerHTML = "Breed";
            }
        } else if (this.id === 'gallery') {
            title = "GALLERY";
            if (order === "RANDOM") {
                next.setAttribute("disabled", "");
            } else {
                next.removeAttribute("disabled");
            }
            let breeds = document.getElementById("galleryBreeds");
            let breedsList = ajax_get(breedsListUrl).data;
            let option;
            for (let item of breedsList) {
                option = document.createElement("option");
                option.value = item.id;
                option.innerText = item.name;
                breeds.appendChild(option);
            }
            // galleryLimit(document.getElementById("galleryLimit"));


            if (page === listLength/limit) {
                next.setAttribute("disabled", "");
            } else if(next.hasAttribute("disabled")) {
                next.removeAttribute("disabled");
            }
            itemGenerator(limit/*limit < 5 ? 5 : limit*/);
            changePage(limit, page, order, breed, type);
            let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "center";
                i.firstElementChild.style.width = "fit-content";
                i.firstElementChild.innerHTML = likeSvg;
            }
        } else if (this.id === 'voting') {
            title = "VOTING";
        }
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

function breedsLimit(element){
    page = 0;
    prev.setAttribute("disabled", "");
    // limit = element.options[element.selectedIndex].value;
    // changePage(limit, page);
    itemGenerator(element.options[element.selectedIndex].value);
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "end";
        i.firstElementChild.style.width = "100%";
        i.firstElementChild.innerHTML = "Breed";
    }
    changePage(limit, page, order, breed, type);
}

function galleryLimit(element){
    page = 0;
    prev.setAttribute("disabled", "");
    // limit = element.options[element.selectedIndex].value;
    // changePage(limit, page);
    itemGenerator(element.options[element.selectedIndex].value);
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "center";
        i.firstElementChild.style.width = "fit-content";
        i.firstElementChild.innerHTML = likeSvg;
    }
    changePage(limit, page, order, breed, type);
}

function itemGenerator(curLimit) {
    let items = mainContent.getElementsByClassName("item").length;


    // console.log(`CURLIMIT: ${curLimit} ; ITEMLENGTH: ${items}`);


    if (curLimit !== items) {
        // content.innerHTML = "";
        let section, item, label;
        // let iterator = list.entries();
        if (Number(curLimit) > Number(items)) {
            for (let i = 0; i < curLimit - items; i++) {
                if (i%5 === 0) {
                    section = document.createElement("section");
                    // if (Math.round(i/5) % 2) {
                    //     section.setAttribute("reverse", "");
                    // }
                    mainContent.append(section);
                }

                item = document.createElement("div");
                item.setAttribute("class", "item");
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
            let items = mainContent.getElementsByClassName("item");
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
        limit = curLimit;
    }
}

function prevPage(element) {
    //console.log(page);
    if (page > 0) {
        page--;
        changePage(limit, page, order, breed, type);

        next.removeAttribute("disabled");
    }
    if (page === 0) {
        element.setAttribute("disabled", "");
    } else if(element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
    }
}

function nextPage(element) {
    //console.log(page);
    if (page < listLength/limit) {
        page++;

        prev.removeAttribute("disabled");
        changePage(limit, page, order, breed, type);
    }

    if (page === listLength/limit) {
        element.setAttribute("disabled", "");
    } else if(element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
    }
}

function orderListener(element) {
    page = 0;
    prev.setAttribute("disabled", "");
    order = element.options[element.selectedIndex].value;
    if (order === "RANDOM") {
        next.setAttribute("disabled", "");
        //console.log(true);
    } else {
        next.removeAttribute("disabled");
        //console.log(false);
    }
    changePage(limit, page, order, breed, type);
}

function galleryBreedsListener(element) {
    page = 0;
    prev.setAttribute("disabled", "");
    breed = element.options[element.selectedIndex].value;
    if (breed === "none") {
        breed = null;
    }
    changePage(limit, page, order, breed, type);
}

function typeListener(element) {
    page = 0;
    prev.setAttribute("disabled", "");
    type = element.options[element.selectedIndex].value;
    if (type === "none") {
        type = null;
    }
    changePage(limit, page, order, breed, type);
}

function changePage(curLimit, curPage, curOrder, curBreed, curType) {
    let query = gallerySearchUrl;
    if (curLimit != null) {
        query += `&limit=${curLimit}`;
    } else {
        return;
    }
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
    }
    let obj = ajax_get(query);
    list = obj.data;
    listLength = obj.length;

    // let items = mainContent.getElementsByClassName("item");
    // console.log("WHY ISN'T IT WORKING?");


    // console.log(`LIMIT: ${limit} ; LENGTH: ${list.length}`);


    if (limit > (Math.ceil(list.length / 5) * 5)) {
        limit = (Math.ceil(list.length / 5) * 5);
        // limit -= 5;
        // itemGenerator(limit - Math.ceil(list.length / 5) * 5);
        itemGenerator(list.length);
        // items = mainContent.getElementsByClassName("item");
    }
    let items = mainContent.getElementsByClassName("item");
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
            item.style.setProperty('--background', `url(${list[i].url})`);
        // }
        i++;
    }


    // items = mainContent.getElementsByClassName("item");
    // console.log(`ITEMS: ${items.length} ; LENGTH: ${list.length}`);


    /*let sections = mainContent.getElementsByTagName("section");
    for (let section of sections) {
        if (section.getElementsByClassName('item').length === 0) {
            section.remove();
        }
    }*/
}

function ajax_get(url) {
    console.log(url);
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });
    xmlHttp.open("GET", url, false);
    xmlHttp.setRequestHeader("x-api-key", key);
    // xmlHttp.setRequestHeader("Access-Control-Expose-Headers", "Pagination-Count");
    xmlHttp.send();
    // console.log(xmlHttp.getAllResponseHeaders());//getResponseHeader("Pagination-Count"));
    return {"data": JSON.parse(xmlHttp.responseText), "length": order !== "RANDOM" ?
            xmlHttp.getResponseHeader("Pagination-Count") : 0};
}

// Adding buttons listeners
for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}
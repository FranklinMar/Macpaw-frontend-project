var likeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="none" viewBox="0 0 20 24">\n' +
    '\t<path fill="#FF868E" fill-rule="evenodd" d="M5.38 1.803c-2.235 0-4.047 2.451-4.047 5.475 0 1.452.427 2.844 ' +
    '1.186 3.87L10 21.269l7.481-10.12c.76-1.026 1.186-2.418 1.186-3.87 0-3.024-1.812-5.475-4.048-5.475-1.073 ' +
    '0-2.103.577-2.862 1.604l-1.286 1.74c-.26.351-.682.351-.942 0l-1.286-1.74C7.483 2.38 6.454 1.803 5.38 1.803ZM0 ' +
    '7.278C0 3.258 2.409 0 5.38 0c1.428 0 2.796.767 3.805 2.132L10 3.233l.815-1.101C11.824.767 13.192 0 14.619 0 ' +
    '17.591 0 20 3.258 20 7.278c0 1.93-.567 3.78-1.576 5.146L10.471 23.18c-.26.352-.682.352-.942 0L1.576 12.424C.566 ' +
    '11.059 0 9.208 0 7.278Z" clip-rule="evenodd"/>\n' +
    '</svg>\n';

/*String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{(\d+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};*/


let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
let home = document.getElementById("home");

let key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
let breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
// let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page={1}&order=ASC";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=thumb";

let page = 0, listLength = 0, limit = 0;
let list = null, order = "RANDOM";


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
        // if (document.getElementById('breeds-check').checked) {
        if (this.id === 'breeds') {
            // resetGrid();
            // let content = document.getElementById("main-content");
            // content.innerHTML = "";

            title = "BREEDS";
            let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "end";
                i.firstElementChild.style.width = "100%";
                i.firstElementChild.innerHTML = "Breed";
            }
        } else if (this.id === 'gallery') {
            if (order === "RANDOM") {
                document.getElementById("next").setAttribute("disabled", "");
            } else {
                document.getElementById("next").removeAttribute("disabled");
            }

            // resetGrid();
            title = "GALLERY";
            // galleryLimit(document.getElementById("galleryLimit"));

            limitListener(limit < 5 ? 5 : limit, page);
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
    document.getElementById("prev").setAttribute("disabled", "");
    // limit = element.options[element.selectedIndex].value;
    // changePage(limit, page);
    limitListener(element.options[element.selectedIndex].value, page);
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "end";
        i.firstElementChild.style.width = "100%";
        i.firstElementChild.innerHTML = "Breed";
    }
}

function galleryLimit(element){
    page = 0;
    document.getElementById("prev").setAttribute("disabled", "");
    // limit = element.options[element.selectedIndex].value;
    // changePage(limit, page);
    limitListener(element.options[element.selectedIndex].value, page);
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "center";
        i.firstElementChild.style.width = "fit-content";
        i.firstElementChild.innerHTML = likeSvg;
    }
}

function limitListener(curLimit, curPage) {
    if (curLimit !== limit) {
        let content = document.getElementById("main-content");
        // content.innerHTML = "";
        let section, item, label;
        // let iterator = list.entries();
        if (Number(curLimit) > Number(limit)) {
            for (let i = 0; i < curLimit - limit; i++) {
                if (i%5 === 0) {
                    section = document.createElement("section");
                    // if (Math.round(i/5) % 2) {
                    //     section.setAttribute("reverse", "");
                    // }
                    content.append(section);
                }

                item = document.createElement("div");
                item.setAttribute("class", "item");
                // item.setAttribute("style", "--background: url( );")
                // item.style = `--background: url(${list[i].url});`;
                // item.style = `--background: ${iterator.next().value.url};`;
                label = document.createElement("div");
                item.append(label);
                label.setAttribute("class", "label");
                section.appendChild(item);
            }
        } else {
            let section = content.getElementsByTagName("section");
            //console.log((limit - curLimit)/5);
            for (let i = (limit - curLimit)/5; i >= curLimit/5; i--) {
                content.removeChild(section[i]);
            }
        }
        limit = curLimit;
    }
    changePage(curLimit, curPage, order);
}

function prevPage(element) {
    //console.log(page);
    if (page > 0) {
        page--;
        changePage(limit, page, order);

        document.getElementById("next").removeAttribute("disabled");
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

        document.getElementById("prev").removeAttribute("disabled");
        changePage(limit, page, order);
    }

    if (page === listLength/limit) {
        element.setAttribute("disabled", "");
    } else if(element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
    }
}

function orderListener(element) {
    page = 0;
    document.getElementById("prev").setAttribute("disabled", "");
    order = element.options[element.selectedIndex].value;
    if (order === "RANDOM") {
        document.getElementById("next").setAttribute("disabled", "");
        //console.log(true);
    } else {
        document.getElementById("next").removeAttribute("disabled");
        //console.log(false);
    }
    changePage(limit, page, order);
}

function changePage(curLimit, curPage, curOrder) {
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
    let obj = ajax_get(query);
    list = obj.data;
    listLength = obj.length;

    let content = document.getElementById("main-content");
    let items = content.getElementsByClassName("item");
    let i = 0;
    for (let item of items) {
        // item.style.toString().replace("/\\--background: url(.*?\\);/g", `--background: url(${list[i].url});`);
        // item.style.backgroundImage = `url(${list[i].url})`;
        item.style.setProperty('--background', `url(${list[i].url}`);
        i++;
    }
}

function ajax_get(url) {
    console.log(url);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });
    xmlhttp.open("GET", url, false);
    xmlhttp.setRequestHeader("x-api-key", key);
    // xmlhttp.setRequestHeader("Access-Control-Expose-Headers", "Pagination-Count");
    xmlhttp.send();
    console.log(xmlhttp.getAllResponseHeaders());//getResponseHeader("Pagination-Count"));
    return {"data": JSON.parse(xmlhttp.responseText), "length": order !== "RANDOM" ?
            xmlhttp.getResponseHeader("Pagination-Count") : 0};
}

// Adding buttons listeners
for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}

// Initializing Grid page block
//resetGrid();

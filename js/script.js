var likeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="none" viewBox="0 0 20 24">\n' +
    '\t<path fill="#FF868E" fill-rule="evenodd" d="M5.38 1.803c-2.235 0-4.047 2.451-4.047 5.475 0 1.452.427 2.844 ' +
    '1.186 3.87L10 21.269l7.481-10.12c.76-1.026 1.186-2.418 1.186-3.87 0-3.024-1.812-5.475-4.048-5.475-1.073 ' +
    '0-2.103.577-2.862 1.604l-1.286 1.74c-.26.351-.682.351-.942 0l-1.286-1.74C7.483 2.38 6.454 1.803 5.38 1.803ZM0 ' +
    '7.278C0 3.258 2.409 0 5.38 0c1.428 0 2.796.767 3.805 2.132L10 3.233l.815-1.101C11.824.767 13.192 0 14.619 0 ' +
    '17.591 0 20 3.258 20 7.278c0 1.93-.567 3.78-1.576 5.146L10.471 23.18c-.26.352-.682.352-.942 0L1.576 12.424C.566 ' +
    '11.059 0 9.208 0 7.278Z" clip-rule="evenodd"/>\n' +
    '</svg>\n';

String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{(\d+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};


let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
let home = document.getElementById("home");

let key = "af5697f4-7d20-4967-9fad-94df7846fcd3";
let breedsListUrl = "https://api.thecatapi.com/v1/breeds?attach_breed=0";
let gallerySearchUrl = "https://api.thecatapi.com/v1/images/search?size=full&limit={0}&page=0&order=ASC&size=full";

let galleryPage = 0, breedsPage = 0;
let listGallery = null, listBreeds = null, list = null;


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
        for (let i of document.getElementsByClassName(this.id.toString().replace("check", "selector"))) {
            i.style.removeProperty("display");
        }
        // if (document.getElementById('breeds-check').checked) {
        if (this.id === 'breeds-check') {
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
        } else if (this.id === 'gallery-check') {

            // resetGrid();
            title = "GALLERY";
            let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "center";
                i.firstElementChild.style.width = "fit-content";
                i.firstElementChild.innerHTML = likeSvg;
            }
        } else if (this.id === 'voting-check') {
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
/*
// Limit listener
function limitListener() {

}

// Limit Select tags
function limitSelect(element) {
    // let select = document.getElementById(id);
    let value = element.options[element.selectedIndex].value;
    // value = value.toString().replace("Limit: ", "");
    let grid = document.getElementsByClassName("grid")[0];
    grid.innerHTML = "";
    // grid.innerHTML = sectionContent.repeat(value/5);
    console.log(value);
    for (let i = 0; i < value ; i++) {
        let section = document.createElement('section');
        if (i%2) {
            section.setAttribute("reverse", "");
            // section.innerHTML += sectionColumn2 + sectionColumn1;
            // } else {
            // section.innerHTML += sectionColumn1 + sectionColumn2;
        }
        for (let j = 0; j < 5; j++) {
            section.innerHTML += '<div class="item">\n' +
                '<div class="label">Hello</div>\n' +
                '</div>\n';
            // let item = document.createElement('div');
        }
        grid.append(section);
    }
}*/

/*function resetGrid(list=null){
    let content = document.getElementById("main-content");
    content.innerHTML = "";

    if (list == null) {
        content.append(document.createElement("section"));
        content = content.firstChild;
        // skip TextNodes and Comments
        while (content != null && content.nodeType !== 1){
            content = content.nextSibling;
        }

        let item, label;
        for (let i = 0; i < 5; i++) {
            item = document.createElement("div");
            item.setAttribute("class", "item");
            label = document.createElement("div");
            item.append(label);
            label.setAttribute("class", "label");
            // label.textContent = "Breed";
            content.appendChild(item);
        }
    }
}*/

function ajax_get(url/*, callback*/) {
    var xmlhttp = new XMLHttpRequest();
    /*xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 /!*this.DONE*!/ && xmlhttp.status === 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return null;
            }
            //callback(data);
            return data;
        }
    };*/

    xmlhttp.open("GET", url, false);
    xmlhttp.setRequestHeader("x-api-key", key);
    xmlhttp.send();
    return JSON.parse(xmlhttp.responseText);
    // return JSON.stringify(xmlhttp.responseText);
}

function limitQuery(element) {
    let value = element.options[element.selectedIndex].value;
    let content = document.getElementById("main-content");
    content.innerHTML = "";
    list = ajax_get(gallerySearchUrl.format(value));

    let index = 0;
    let section, item, label;
    // let iterator = list.entries();
    for (let i = 0; i < value; i++, index++) {
        // console.log(i%5);
        if (i%5 === 0) {
            section = document.createElement("section");
            if (Math.round(index/5) % 2) {
                section.setAttribute("reverse", "");
            }
            content.append(section);
        }

        item = document.createElement("div");
        item.setAttribute("class", "item");
        item.style = `--background: url(${list[index].url});`;
        // item.style = `--background: ${iterator.next().value.url};`;
        label = document.createElement("div");
        item.append(label);
        label.setAttribute("class", "label");
        // label.textContent = "Breed";
        section.appendChild(item);
    }
}

function breedsLimitListener(element){
    limitQuery(element);
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "end";
        i.firstElementChild.style.width = "100%";
        i.firstElementChild.innerHTML = "Breed";
    }
}

function galleryLimitListener(element){
    limitQuery(element);
    let items = document.getElementsByClassName("item");
    for (let i of items) {
        i.style.alignItems = "center";
        i.firstElementChild.style.width = "fit-content";
        i.firstElementChild.innerHTML = likeSvg;
    }
}

// Adding buttons listeners
for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}

breedsLimitListener(document.getElementById("breedsLimit"));

// Initializing Grid page block
//resetGrid();

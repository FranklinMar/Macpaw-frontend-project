
var sectionColumn1 = '<div class="column-small">\n' +
    '                <div class="item">\n' +
    '                  <div class="label">Hello</div>\n' +
    '                </div>\n' +
    '                <div class="item"></div>\n' +
    '              </div>';
var sectionColumn2 = '<div class="column">\n' +
    '                <div class="row">\n' +
    '                  <div class="item"></div>\n' +
    '                    <div class="item"></div>\n' +
    '                </div>\n' +
    '                <div class="item"></div>\n' +
    '              </div>';

let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
let home = document.getElementById("home");

function buttonsListener() {
    if (check && check !== this) {
        check.checked = false;
    }

    for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector")) {
        i.style.display = "none";
    }
    //console.log("worked");
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
            title = "BREEDS";
        // } else if (document.getElementById('gallery-check').checked){
        } else if (this.id === 'gallery-check') {
            title = "GALLERY";
            // for (let i of document.getElementsByClassName("breeds-selector")) {
            //     i.style.display = "none";
            // }
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

for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}

function limitSelect() {
    let select = document.getElementById("limit");
    let value = select.options[select.selectedIndex].value;
    value = value.toString().replace("Limit: ", "");
    let grid = document.getElementsByClassName("grid")[0];
    grid.innerHTML = "";
    // grid.innerHTML = sectionContent.repeat(value/5);
    for (let i = 0; i < value / 5; i++) {
        let section = document.createElement('section');
        if (i%2) {
            section.innerHTML += sectionColumn2 + sectionColumn1;
        } else {
            section.innerHTML += sectionColumn1 + sectionColumn2;
        }
        grid.append(section);
    }
}

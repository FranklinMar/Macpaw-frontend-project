
// var sectionColumn1 = '<div class="column-small">\n' +
//     '                <div class="item">\n' +
//     '                  <div class="label">Hello</div>\n' +
//     '                </div>\n' +
//     '                <div class="item"></div>\n' +
//     '              </div>';
// var sectionColumn2 = '<div class="column">\n' +
//     '                <div class="row">\n' +
//     '                  <div class="item"></div>\n' +
//     '                    <div class="item"></div>\n' +
//     '                </div>\n' +
//     '                <div class="item"></div>\n' +
//     '              </div>';
var likeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" fill="none" viewBox="0 0 20 24">\n' +
    '  <path fill="#FF868E" fill-rule="evenodd" d="M5.38 1.803c-2.235 0-4.047 2.451-4.047 5.475 0 1.452.427 2.844 1.186 3.87L10 21.269l7.481-10.12c.76-1.026 1.186-2.418 1.186-3.87 0-3.024-1.812-5.475-4.048-5.475-1.073 0-2.103.577-2.862 1.604l-1.286 1.74c-.26.351-.682.351-.942 0l-1.286-1.74C7.483 2.38 6.454 1.803 5.38 1.803ZM0 7.278C0 3.258 2.409 0 5.38 0c1.428 0 2.796.767 3.805 2.132L10 3.233l.815-1.101C11.824.767 13.192 0 14.619 0 17.591 0 20 3.258 20 7.278c0 1.93-.567 3.78-1.576 5.146L10.471 23.18c-.26.352-.682.352-.942 0L1.576 12.424C.566 11.059 0 9.208 0 7.278Z" clip-rule="evenodd"/>\n' +
    '</svg>\n';

let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
let home = document.getElementById("home");

function buttonsListener() {
    if (check && check !== this) {
        check.checked = false;
    }

    for (let i of document.querySelectorAll(".gallery-selector, .breeds-selector, .voting-selector")) {
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
            let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "end";
                i.firstElementChild.style.width = "100%";
                i.firstElementChild.innerHTML = "Breed";
            }
        // } else if (document.getElementById('gallery-check').checked){
        } else if (this.id === 'gallery-check') {
            title = "GALLERY";
            let items = document.getElementsByClassName("item");
            for (let i of items) {
                i.style.alignItems = "center";
                i.firstElementChild.style.width = "fit-content";
                i.firstElementChild.innerHTML = likeSvg;
            }
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

function limitSelect(thiss) {
    // let select = document.getElementById(id);
    let value = thiss.options[thiss.selectedIndex].value;
    // value = value.toString().replace("Limit: ", "");
    let grid = document.getElementsByClassName("grid")[0];
    grid.innerHTML = "";
    // grid.innerHTML = sectionContent.repeat(value/5);
    console.log(value);
    for (let i = 0; i < value /*/ 5*/; i++) {
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
}

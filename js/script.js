
let buttons = document.getElementById("menu").getElementsByTagName("input");
let check = null;
let home = document.getElementById("home");

function buttonsListener() {
    if (check && check !== this) {
        check.checked = false;
    }
    //console.log("worked");
    check = this;
    if (this.checked) {
        home.style.display = "none";
        if (document.getElementById('breeds-check').checked) {
            document.getElementById('breeds').style.display = "flex";
        }
    } else {
        for (let button of buttons) {
            button.checked = false;
        }
        document.getElementById('breeds').style.display = "none";
        home.style.display = "initial";
    }
}

for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}

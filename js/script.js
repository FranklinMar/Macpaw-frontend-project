
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
    } else {
        home.style.display = "contents";
    }
}

for (let button of buttons) {
    button.addEventListener('click', buttonsListener);
}

//////////////////////////////////////////
///// various effects and animations /////
//////////////////////////////////////////



// Creates a typewriter effect by adding text one character at a time, skips over spaces for a smoother animation
export async function typewriter() {

    let greetingBox = document.getElementById("typing"),
        welcomeBox = document.getElementById("welcome");

    let text = "Hi, I'm George",
        welcome = "Welcome to my portfolio website!";

    greetingBox.classList.add("start");

    typing(text, greetingBox, 150);

    await sleep(2100);

    welcomeBox.classList.add("start");
    greetingBox.removeAttribute("class");
    greetingBox.classList.add("noAfter");

    await sleep(1500);

    welcomeBox.removeAttribute("class");
    welcomeBox.classList.add("paused");

    typing(welcome, welcomeBox, 150);

    welcomeBox.classList.remove("paused");
    welcomeBox.classList.add("start");
}

async function typing(text, textbox, delay = 75) {
    for (let i = 0; i < text.length; i++) {
        textbox.innerHTML += text[i];
        await sleep(delay);
    }
}



// Toggles the flip class for the project cards, creating the fliping animation 
export function flip(x) {
    let card = document.getElementById(x.id);
    card.classList.toggle('flip');
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Next/previous controls
let slideIndex = 1;
async function plusSlides(n, captions) {
    slideshow(slideIndex += n, captions);
}


// adds listeners to the prev and next buttons for the slideshow
export function addListeners(captions) {
    let next = document.getElementById("next"),
        prev = document.getElementById("prev")

    prev.addEventListener("click", function () { slideshow(0, captions) });
    next.addEventListener("click", function () { slideshow(2, captions) })
}


// creates a slideshow to loop through project pictures
export function slideshow(n, captions) {
    let slideIndex = 1;

    let pictures = document.querySelectorAll(".slides"),
        number = document.getElementById("number"),
        caption = document.getElementById("caption"),
        totalPics = Number(pictures[pictures.length - 1].getAttribute("value")) + 1;

    if (n < 1) { slideIndex = pictures.length }

    for (let i = 0; i < pictures.length; i++) {
        pictures[i].style.display = "none";
    }
    pictures[slideIndex - 1].style.display = "inline-block";
    number.innerHTML = (Number(pictures[slideIndex - 1].getAttribute("value")) + 1) + "/" + totalPics;
    caption.innerHTML = captions[slideIndex - 1]

    return slideIndex - 1;
}



// maybe add more videos and randomize them
export default function keylogger() {
    let pattern = ['s', 'u', 'p', 'r', 'i', 's', 'e'],
        current = 0;

    let keyHandler = function (event) {

        if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
            current = 0;
            return;
        }

        current++;

        if (pattern.length === current) {
            current = 0;
            Swal.fire({
                heightAuto: false,
                showConfirmButton: false,
                background: "rgb(62, 105, 121)",
                customClass: 'alert',
                html: '<img style="overflow: visible; height: 50vh; width: 27vw;" autoplay unmuted src="./assets/videos/suprise.webp" id="suprise"></img>',
                timer: 8000
            })
        }
    };

    document.addEventListener('keydown', keyHandler, false);
}
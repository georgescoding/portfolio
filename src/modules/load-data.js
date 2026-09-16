import param from '../data/project-param.json' with {type: "json"};
import projectSummary from '../data/project-summary.json' with {type: "json"};
import homePage from '../data/home-text.json' with {type: "json"};
import wait from './wait.js';




//////////////////////////////////////////////
///// load data from json into HTML file /////
///// dynamically styles HTML files //////////
//////////////////////////////////////////////


// global variable to track which section the user is currently viewing
var currentSection;


export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// loads contents of the home page, adds event listeners and rescales recaptcha 
export function home() {

    document.getElementById("typing").classList.add("start");

    setHeight();

    // remove noscript
    document.getElementsByTagName("noscript")[0].remove();

    // paste text from JSON
    document.getElementById("overview1").innerHTML = homePage.overview1;
    document.getElementById("overview2").innerHTML = homePage.overview2;
    document.getElementById("overview3").innerHTML = homePage.overview3;
    document.getElementById("overview4").innerHTML = homePage.overview4;

    document.getElementById("workText1").innerHTML = homePage.plangroup1;
    document.getElementById("workText2").innerHTML = homePage.plangroup2;
    document.getElementById("workText3").innerHTML = homePage.plangroup3;
    document.getElementById("workText4").innerHTML = homePage.plangroup4;

    // styles home page elements, unhides page
    styleHome();

    let resizeSocials = new ResizeObserver(() => {
        scaleSocials();
    });

    // add event listeners to requried elements
    let prev = document.getElementById("prevSection"),
        next = document.getElementById("nextSection"),
        form = document.querySelector(".form"),
        ok = document.getElementById("ok");

    prev.addEventListener("click", function () { toggleSection(1) })
    next.addEventListener("click", function () { toggleSection(2) })

    wait(".form", 2).then(() => {
        scaleSocials();
        resizeSocials.observe(form);
    });

    wait("navbar", 1).then(() => {
        window.addEventListener("resize", () => { styleHome() });
        window.addEventListener("resize", () => { setHeight() });
    });

    wait(".g-recaptcha", 2).then(() => {
        scaleCaptcha();
        window.addEventListener('resize', () => { scaleCaptcha() });
    });
}

// shows the content of the collapsed navbar
export function showNav() {
    wait(".collapsedNav", 2).then(() => {
        let nav = document.querySelector(".collapsedNav");
        nav.addEventListener("click", () => { collapsedNav() })
    })
}


function collapsedNav() {
    let content = document.querySelector("#collapsed-content"),
        collapsedNav = document.querySelector(".collapsedNav");
    content.classList.toggle("show");

    if (collapsedNav.innerHTML.charCodeAt(0) == "9776") { collapsedNav.innerHTML = "&#10006" }
    else {
        collapsedNav.innerHTML = "&#9776"
    }

}


// switches CSS to fit landscape or portrait mode for individual project page
function styleProject() {

    // page measurements
    let viewport = document.documentElement.getBoundingClientRect(),
        navbarHeight = document.getElementById("navbar").getBoundingClientRect().height,
        vh = viewport.height - navbarHeight,
        vw = viewport.width;

    // project page elements
    let main = document.getElementById("main")

    // reset class lists
    main.className = "";

    // turns on portrait mode
    if (!(vw >= vh * 1.1)) {
        main.classList.add("portrait")
    }
}


// switches CSS to fit landscape or portrait mode for home page
function styleHome() {

    // main page measurements
    let viewport = document.documentElement.getBoundingClientRect(),
        navbarHeight = document.getElementById("navbar").getBoundingClientRect().height,
        vh = viewport.height - navbarHeight,
        vw = viewport.width;

    // changable parameters
    let unit;

    // navbar elements
    let rightnav = document.querySelector(".right-nav"),
        collapsedNav = document.querySelector(".collapsedNav"),
        collapsedContent = document.getElementById("collapsed-content");

    // main page elements
    let welcomePage = document.getElementById("welcomePage"),
        remind = document.getElementById("remind"),
        prevSection = document.getElementById("prevSection"),
        nextSection = document.getElementById("nextSection"),
        overviewText = document.getElementById("overviewText"),
        overview1 = document.getElementById("overview1"),
        overview2 = document.getElementById("overview2"),
        overview3 = document.getElementById("overview3"),
        overview4 = document.getElementById("overview4"),
        skillName = document.getElementById("skillName"),
        skillName2 = document.getElementById("skillName2"),
        overviewPoints = [].concat(overview1, overview2, overview3, overview4),
        workText = document.getElementById("workText"),
        sectionName = Array.from(document.querySelectorAll(".sectionName")),
        sectionPicture = Array.from(document.querySelectorAll(".sectionPicture")),
        workName = Array.from(document.querySelectorAll(".workName")),
        workDate = Array.from(document.querySelectorAll(".workDate")),
        workTitle = Array.from(document.querySelectorAll(".workTitle")),
        contact = document.getElementById("contact"),
        grid = document.querySelector("#contact .grid"),
        copyright = document.querySelector(".copyright"),
        elements = [].concat(sectionName, sectionPicture, workName, workDate, workTitle, rightnav, collapsedNav, overviewPoints);

    // reset class lists
    resetClasslist(elements);
    welcomePage.className = "section";
    grid.className = "grid"
    prevSection.className = "";
    nextSection.className = ""
    overviewText.className = "";
    skillName.className = "";
    skillName2.className = "";
    workText.className = ""
    collapsedContent.className = ""
    contact.className = "section";
    copyright.className = "copyright";

    // landscape mode
    if (vw >= vh * 1.5) {

        // remove font size
        overviewText.style.fontSize = "";
        overviewPoints.forEach((points) => { points.style.fontSize = ""; });

        workText.style.fontSize = "";
        workName.forEach((name) => { name.style.fontSize = ""; });
        workDate.forEach((date) => { date.style.fontSize = ""; });
        workTitle.forEach((title) => { title.style.fontSize = ""; });
        sectionName.forEach((section) => { section.style.fontSize = "" })

        // turns on landscape CSS
        overviewText.classList.add("landscape");
        workText.classList.add("landscape");
        skillName.classList.add("landscape");
        skillName2.classList.add("landscape");
        sectionName.forEach((section) => { section.classList.add("landscape") })
        sectionPicture.forEach((section) => { section.classList.add("landscape") })
        workName.forEach((name) => { name.classList.add("landscape") })
        workDate.forEach((date) => { date.classList.add("landscape") })
        workTitle.forEach((title) => { title.classList.add("landscape") })
        remind.removeAttribute("style");
    }

    // portrait mode
    else {
        // collapse navbar options into single menu
        rightnav.classList.add("collapsed")
        collapsedNav.classList.add("collapsed")

        // turns on landscape CSS
        skillName.classList.add("portrait");
        skillName2.classList.add("portrait");
        prevSection.classList.add("portrait");
        nextSection.classList.add("portrait")
        welcomePage.classList.add("portrait");
        overviewText.classList.add("portrait");
        workText.classList.add("portrait");
        sectionPicture.forEach((section) => { section.classList.add("portrait") })
        grid.classList.add("portrait");
        contact.classList.add("portrait");
        copyright.classList.add("portrait");
        remind.style.visibility = "hidden";


        // finds if width or height is greater
        if (vw > vh) {
            unit = "vw"
        }
        else {
            unit = "vh"
        }

        // changes font size for section based on size
        overviewPoints.forEach((points) => { points.style.fontSize = "2.2" + unit; });

        workText.style.fontSize = "2.2" + unit;
        workName.forEach((name) => { name.style.fontSize = "2.5" + unit; });
        workTitle.forEach((title) => { title.style.fontSize = "2.5" + unit; });
        workDate.forEach((date) => { date.style.fontSize = "2.5" + unit; });
        sectionName.forEach((section) => { section.style.fontSize = "4.6" + unit })
    }

    document.querySelector(".page").classList.remove("hide");
}


// scrolls to the next or previous section of main page
function toggleSection(selector) {

    let sections = document.querySelectorAll(".section");
    sections = Array.from(sections);

    if (currentSection === 'top' && selector === 1) {
        document.getElementById("top").scrollIntoView();
    }
    else if (currentSection === 'contact' && selector === 2) {
        document.getElementById("contact").scrollIntoView();
    }
    else {

        let index = getSectionNum(currentSection);

        if (selector == 1) {
            sections[index - 1].scrollIntoView();
        }
        else if (selector == 2) {
            sections[index + 1].scrollIntoView();
        }
        else {
            Swal.fire({
                icon: "error",
                heightAuto: false,
                confirmButtonColor: "rgb(23, 39, 45)",
                background: "rgb(62, 105, 121)",
                title: "<h5 style='color:white'>Catastrophic failure, please contact support@georgescoding.com</h5>"
            })
        }
    }
}


// creates an intersection observer to see when the user's viewport has crossed into the next or previous section
// accounts for height offset from navbar
export function observer() {
    let navbarHeight = document.getElementById("navbar").getBoundingClientRect().height.toString(),
        marginHeight = navbarHeight + "px 0px 0px",
        observer,
        options = {
            root: null,
            rootMargin: marginHeight,
            threshold: 0.5
        },
        target = document.querySelectorAll(".section");

    observer = new IntersectionObserver(handleIntersect, options);

    target.forEach(section => {
        observer.observe(section)
    })
}


// updates the navbar section style depending on the current section
async function handleIntersect(entries) {
    entries.forEach((entry) => {

        if (entry.intersectionRatio > 0) {
            let href,
                navSection = document.querySelectorAll(".navSection"),
                sectionIndex = getSectionNum(entry.target.id) - 1;

            navSection.forEach((section) => { section.classList.remove("highlight") })

            revealSection(entry.target);

            if (entry.target.id != "welcomePage") {
                href = "#" + entry.target.id;
                navSection[sectionIndex].classList.add("highlight")
            }

            else {
                href = "#top";
            }

            currentSection = href.slice(1);
        }
    })

}


// make each section fit exactly the entire pages
function setHeight() {

    let navbar = document.getElementById("navbar"),
        centerVertical = document.querySelectorAll(".centerVertical"),
        sections = document.querySelectorAll(".section");

    let navbarHeight = navbar.getBoundingClientRect().height,
        viewport = document.documentElement.getBoundingClientRect(),
        vh = viewport.height - navbarHeight,
        vw = viewport.width,
        sectionHeight = vh - navbarHeight,
        sectionHeightCSS = sectionHeight.toString() + "px",
        welcomeHeight = centerVertical[0].getBoundingClientRect().height,
        overviewHeight = centerVertical[1].getBoundingClientRect().height,
        workHeight = centerVertical[2].getBoundingClientRect().height;

    let overview = document.getElementById("overview"),
        styles = window.getComputedStyle(overview),
        padding = styles.getPropertyValue('padding-top').toString().replace("px", "");

    centerVertical.forEach((section) => section.style.top = "0px")
    centerVertical.forEach((section) => section.style.paddingTop = "")
    centerVertical[0].style.top = ((sectionHeight - welcomeHeight) / 2).toString() + "px";

    if (vw >= vh * 1.5) {
        centerVertical[1].style.paddingTop = ((sectionHeight - overviewHeight - padding * 3) / 2).toString() + "px";
        centerVertical[2].style.paddingTop = ((sectionHeight - workHeight - padding * 3) / 2).toString() + "px";
    }

    sections = Array.from(sections)
    sections.splice(4, 2)
    sections.forEach((section) => { section.style.height = sectionHeightCSS })
}


async function revealSection(currentSection) {
    let sections = document.querySelectorAll(".section"),
        remind = document.getElementById("remind");
    sections = [].slice.call(sections, 1)
    remind.classList.remove("fade");
    remind.classList.remove("hide");


    sections.forEach((section) => {
        if (section != currentSection) {
            section.classList.remove("fade");
        }
    })

    if (currentSection.id != "welcomePage") {
        currentSection.classList.add("fade");
        remind.classList.add("hide");
    }
    else if (getComputedStyle(document.querySelector("button#readmore")).opacity == 1) {
        await sleep(1000);
        remind.classList.add("fade");
    }
}


// loads each the project summary for each card
export function summary(mainPage) {
    scaleProjects(mainPage);
    window.addEventListener('resize', () => { scaleProjects(mainPage) });

    document.getElementById("multivibratorText").innerHTML += projectSummary.multivibrator;
    document.getElementById("chessText").innerHTML += projectSummary.chess;
    document.getElementById("breathalyzerText").innerHTML += projectSummary.breathalyzer;
    document.getElementById("blackjackText").innerHTML += projectSummary.blackjack;
    document.getElementById("sensorText").innerHTML += projectSummary.pHsensor;
    document.getElementById("minesweeperText").innerHTML += projectSummary.minesweeper;

    if (!mainPage) {
        document.getElementById("portfolioText").innerHTML += projectSummary.portfolio;
        document.getElementById("calculatorText").innerHTML += projectSummary.calculator;
        document.getElementById("aluText").innerHTML += projectSummary.alu;
    }
}


// helper function
// returns the project's order in the parameter list
function getProjectNum(projectName) {
    const projectMap = new Map([
        ["chess", 0],
        ["breathalyzer", 1],
        ["blackjack", 2],
        ["calculator", 3],
        ["minesweeper", 4],
        ["ph-sensor", 5],
        ["portfolio", 6],
        ["multivibrator", 7],
        ["alu", 8]
    ]);
    return projectMap.get(projectName.replace("/projects/", ""));
}


// helper function
// returns the section's order in the parameter list
function getSectionNum(sectionName) {
    const sectionMap = new Map([
        ["top", 0],
        ["overview", 1],
        ["skills", 2],
        ["experience", 3],
        ["projects", 4],
        ["contact", 5]
    ]);

    return sectionMap.get(sectionName);
}


// adds the video timer to the video
function videoTimer(video) {
    let mins = (video.duration / 60) | 0,
        seconds = (video.duration - (mins * 60)) | 0,
        currentMin = (video.currentTime / 60) | 0,
        currentSeconds = ((video.currentTime - (currentMin * 60)) | 0).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });
    document.getElementById("time").innerHTML = currentMin + ":" + currentSeconds + "/" + mins + ":" + seconds;
    document.getElementById("progressBar").value = Math.round((video.currentTime / video.duration) * 100);
}


// edits the template file for the project's individual page
function editTemplate(project, num) {
    let video = document.getElementById('video'),
        click = document.getElementById("clickable"),
        playpause = document.getElementById("videoButtons"),
        refresh = document.getElementById("refresh"),
        fullscreen = document.getElementById("fullscreen"),
        backward = document.getElementById("backward"),
        forward = document.getElementById("forward"),
        slideshow = document.getElementById("slideshowContainer"),
        progressBar = document.getElementById("progressContainer"),
        time = document.getElementById("time");

    // add or remove clickable button
    if (num == 6) {
        document.getElementById("button").innerHTML = "Click Me!";
        click.setAttribute("href", "portfolio/coming-soon");
    }
    else if (typeof project.download == 'undefined') {
        click.remove();
    }
    else {
        click.setAttribute("href", project.download);
    }

    // add pictures to template
    if (typeof project.video == 'undefined') {
        video.remove();
        playpause.remove();
        refresh.remove();
        fullscreen.remove();
        backward.remove();
        forward.remove();
        progressBar.remove();
        time.remove();

        // add pictures to slideshow
        if (typeof project.pictures != 'undefined') {
            let length = project.pictures.length,
                slides = [];

            for (let i = 0; i < length; i++) {
                let fade = document.createElement("div"),
                    image = document.createElement("img");

                fade.setAttribute("class", "slides fade");
                fade.setAttribute("value", i)
                image.setAttribute("src", project.pictures[i]);

                fade.appendChild(image);
                slideshow.appendChild(fade);

                slides.push(fade);
            }
            let prev = document.createElement("a"),
                next = document.createElement("a"),
                number = document.createElement("div"),
                caption = document.createElement("div"),
                buttonContainer = document.createElement("div"),
                captionContainer = document.createElement("div");

            prev.setAttribute("id", "prev");
            prev.setAttribute("title", "Previous picture")
            next.setAttribute("id", "next");
            next.setAttribute("title", "Next picture")

            number.setAttribute("id", "number");
            caption.setAttribute("id", "caption");

            buttonContainer.setAttribute("class", "center");
            captionContainer.setAttribute("class", "center")

            prev.innerHTML = "&#10094;";
            next.innerHTML = "&#10095;";

            buttonContainer.appendChild(prev);
            buttonContainer.appendChild(number);
            buttonContainer.appendChild(next);
            captionContainer.appendChild(caption)

            slideshow.appendChild(captionContainer)
            slideshow.appendChild(buttonContainer);

            number.innerHTML = "1/" + length;

            return false
        }
    }
    else { // add videos to template
        slideshow.remove();
        let source = document.createElement('source');
        source.setAttribute('src', project.video);
        source.setAttribute('type', 'video/mp4');
        video.appendChild(source);
        video.onloadedmetadata = function () {
            videoTimer(video);
            video.addEventListener("timeupdate", () => videoTimer(video))
        }
        return true
    }
}


// loads template html into individual project page using an XML request
export function template() {

    let request = new XMLHttpRequest();

    request.open('GET', '../../src/template', true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let text = request.responseText;

            document.querySelector('#main').innerHTML = text;
        }
    };

    request.send();
}


// adds text and media into template file
export async function project(projectName) {
    let num = getProjectNum(projectName);
    const projectParam = [param.chess, param.breathalyzer, param.blackjack, param.calculator, param.minesweeper, param.pHsensor, param.portfolio, param.multivibrator, param.alu];
    let project = projectParam[num];

    // wait untill the template page has loaded
    wait("projectName", 1).then(() => {
        document.getElementById("projectName").innerHTML = project.name;
        document.getElementById("tools").innerHTML += project.tools;
        document.getElementById("github").href = project.github;
        document.getElementById("text").innerHTML = project.description;
        let video = document.getElementById("video");

        // add event listeners to video elements
        if (editTemplate(project, num)) {
            import("./media-control.js").then((control) => {
                control.buttonPress()
                window.addEventListener("keydown", (e) => control.videoAction(e.key));
                video.addEventListener("click", () => control.play())
            });
        }
        else { // add event llisteners to slideshow elements and initializes the slideshow
            import("./effects.js").then((effects) => {
                effects.addListeners(project.captions)
                effects.slideshow(0, project.captions);
            })
        }
    });
}


function setInvisibleHeight() {
    let navbarHeight = document.getElementById("navbar").getBoundingClientRect().height,
        navSectionHeight = document.querySelector(".navSection").getBoundingClientRect().height,
        invisible = document.getElementById("invisible"),
        height = (navbarHeight - navSectionHeight) / 2;

    invisible.style.height = height.toString() + "px";
}


export function navbar() {
    wait("navbar", 1).then(() => {
        setInvisibleHeight();
        styleProject();
        window.addEventListener("resize", () => { setInvisibleHeight() });
        window.addEventListener("resize", () => { styleProject() });
    })

}


// scales project summary cards
function scaleProjects(mainPage) {
    let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    let card1 = document.getElementById("4"),
        card2 = document.getElementById("5"),
        card3 = document.getElementById("6"),
        cards = [].concat(card1, card2, card3);

    let grid = document.querySelector(".grid"),
        info = Array.from(document.querySelectorAll(".info")),
        back = Array.from(document.querySelectorAll(".back")),
        icons = Array.from(document.querySelectorAll("#icon")),
        learnMore = Array.from(document.querySelectorAll(".learnMore")),
        projects = Array.from(document.querySelectorAll(".text")),
        home = document.getElementById("home"),
        elements = [].concat(grid, info, back, icons, learnMore, projects, cards);

    if (home != null) {
        home.className = "fa-solid fa-house"
    }

    resetClasslist(elements)

    if (vw < 750 && vh < 550) {
        grid.classList.add("mobile-landscape")
    }

    if (vw < 500 || (vw < 750 && vh < 450)) {
        if (mainPage) {
            grid.classList.add("mainSmall")
        }
        else {
            grid.classList.add("subSmall")
            home.classList.add("big")
        }
        if (mainPage) {
            cards.forEach((card) => { card.classList.add("hide") })
        }
    }
    else if (vw < 750) {
        if (mainPage) {
            grid.classList.add("mainMedium")
        }
        else {
            grid.classList.add("subMedium")
            home.classList.add("small")
        }
    }
    else if (vw >= 750) {
        if (mainPage) {
            grid.classList.add("mainBig")
            grid.classList.add("mainHeight")

        }
        else {
            grid.classList.add("subBig")
            grid.classList.add("subHeight")
        }
    }


    if (vw < 1100 || vh < 500 || !mainPage && vw < 1350) {
        info.forEach((section) => {
            section.classList.add("less")
        })
        back.forEach((section) => {
            section.classList.add("less")
        })
        icons.forEach((icon) => {
            icon.classList.add("less")
        })
        learnMore.forEach((section) => {
            section.classList.add("less")
        })
        projects.forEach((section) => { section.classList.add("hide") })
    }
    else {
        info.forEach((section) => {
            section.classList.add("more")
        })
        icons.forEach((icon) => {
            icon.classList.add("more")
        })
        learnMore.forEach((section) => {
            section.classList.add("more")
        })
        projects.forEach((section) => { section.classList.add("show") })
    }
}

/* reset classlist to default class for all item(s) 
for multiple items, add them in an array*/
function resetClasslist(elements) {
    elements.forEach((subelement) => {
        let size = 1,
            classArr = Array.from(subelement.classList);

        if (subelement.classList.toString().includes("fa fa-github")) {
            size = 2
        }

        while (classArr.length > size) {
            classArr.splice(-1)
        }

        subelement.className = classArr.toString().replace(",", " ");
    })

}


// dynamically resizes recaptcha 
function scaleCaptcha() {
    let width = document.getElementById("recaptcha").offsetWidth,
        scale = width / 304,
        recaptcha = document.querySelector(".g-recaptcha");

    recaptcha.style.transform = 'scale(' + scale + ')';
    recaptcha.style.webkitTransform = 'scale(' + scale + ')';
    recaptcha.style.transformOrigin = '0 0';
}


// dynamically resizes the margins for socials to be aligned with the contact form
function scaleSocials() {
    let formHeight = document.querySelector(".form").offsetHeight,
        socials = document.querySelector(".socials"),
        resume = document.querySelector(".resume"),
        reportBug = document.querySelector(".reportBug"),
        grid = document.querySelector("#contact .grid"),
        margin = (formHeight - resume.offsetHeight * 3) / 4,
        marginCSS = margin.toString() + "px";

    if (grid.classList.contains("portrait")) {
        marginCSS = "";
    }

    socials.style.marginTop = marginCSS;
    resume.style.marginTop = marginCSS;
    reportBug.style.marginTop = marginCSS;
}


// completes copyright by inserting the current year
export function copyright() {

    let viewport, navbarHeight, vh, vw;

    wait("navbar", 1).then(() => {
        viewport = document.documentElement.getBoundingClientRect();
        navbarHeight = document.getElementById("navbar").getBoundingClientRect().height;
        vh = viewport.height - navbarHeight;
        vw = viewport.width;
    })

    wait(".copyright", 2).then(() => {
        let footer = document.querySelector(".copyright");
        footer.innerHTML += " " + new Date().getFullYear();
        footer.className = "copyright"
        if (!(vw >= vh * 1.5)) {
            footer.classList.add("portrait")
        }
    })

    // check console
    fetch("../../assets/pictures/capybara.txt")
        .then((res) => res.text())
        .then((text) => {
            console.log(text);
            console.log("I've see you found me...")
        })
        .catch((e) => console.error(e));
}
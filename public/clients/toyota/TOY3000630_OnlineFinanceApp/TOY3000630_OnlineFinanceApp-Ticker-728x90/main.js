var banner = {
    data: {},
    hasLooped: false,
};
var TIMELINE;
var lines;
var glitter;
//////////////////////////////////////////////////////////////////////////////////
// function onSplitFrames() { }

// INIT BANNER ----------------------------------
function init() {
    setBannerSize();
    gsap.set(".common, .scene", { display: "block" });
    gsap.set(".htmlMem", { skewX: 0.01, transformOrigin: "50% 50%" });

    addListeners(onMouseOver, onMouseLeave);

    StartBanner();
}

function onMouseOver() {
    document.querySelector(".cta").classList.add("over")
}
function onMouseLeave() {
    document.querySelector(".cta").classList.remove("over")
}

function showTerms() {
    gsap.set(".terms.panel", {display: "block"})
    gsap.set(".terms.button", {display: "none"})
    TIMELINE.pause()
}
function hideTerms() {
    gsap.set(".terms.panel", {display: "none"})
    gsap.set(".terms.button", {display: "block"})
    TIMELINE.play()
}

var counter = {
    time: 15,
    numbers: {
        "0": [1,1,1,1,1,1,0],
        "1": [0,0,0,1,1,0,0],
        "2": [1,0,1,1,0,1,1],
        "3": [0,0,1,1,1,1,1],
        "4": [0,1,0,1,1,0,1],
        "5": [0,1,1,0,1,1,1],
        "6": [1,1,1,0,1,1,1],
        "7": [0,0,1,1,1,0,0],
        "8": [1,1,1,1,1,1,1],
        "9": [0,1,1,1,1,1,1],
    }
}
function updateCountdown(){
    // get minutes
    var mins = Math.floor(counter.time);
    // get secs
    var secs = (Math.floor(counter.time % mins * 60)/100).toFixed(2).split(".")[1]
    
    // convert mins to string
    mins = mins.toString();

    var time = mins + secs;
    // make sure time is ALWAYS 4 characters long
    while(time.length < 4){
        time = "0" + time;
    }

    // cycle through all digits on counter.
    document.querySelectorAll("#counter g").forEach((_number, i)=>{
        var lightArray = counter.numbers[time[i]];
        // cycle through all lights on each digit.
        _number.querySelectorAll("polygon").forEach((poly, i)=>{
            if(lightArray[i]){
                poly.classList.add("red");
                poly.classList.remove("black");
            } else {
                poly.classList.add("black");
                poly.classList.remove("red");
            }
        })
    })
}

// convert time value into a base 10 decimal value, for GSAP to understand
function getTime(timeString){
    var _time = timeString.split(":");
    var _mins = _time[0];
    var _secs = parseInt(_time[1] * 100 / 60);
    console.log(parseFloat(_mins + "." + _secs))
    return parseFloat(_mins + "." + _secs);
}

function StartBanner() {
    gsap.set(".banner", { display: "block" });
    gsap.from(".htmlMem", { duration: 0.25, opacity: 0, ease: Power2.easeIn });


    var FRAME1 = new gsap.timeline()
        .call(function(){
            updateCountdown();
        })
    
    var FRAME2 = new gsap.timeline()
        .to(".frame1 .copy", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeIn })     
        .from(".frame2 .copy", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeOut})
    
    var FRAME3 = new gsap.timeline()
        .to(".frame2 .copy", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeIn })
        .to(".numbers", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeIn}, "-=0.66")
        .to(".terms.button", {duration: 0.66, color: "black", ease: Power2.easeIn}, "-=0.66")
        .from(".logo", {duration: 0.66, fill: "#fff", ease: Power2.easeIn}, "-=0.66")
        .from(".frame3", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeIn}, "-=0.66")
        .from(".frame3 .copy", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeIn})
        .from(".cta", {duration: 0.66, opacity: 0, display: "none", ease: Power2.easeIn}, "+=1.0")

    var LOOP = new gsap.timeline({onComplete: function(){
        banner.hasLooped = true;
    }})
        

    // MASTER TIMELINE
    TIMELINE = new gsap.timeline({repeat: 1})
    .add(FRAME1, 0)
    .add(FRAME2, 4.5)
    .add(FRAME3, 9)
    .call(function(){
        if(banner.hasLooped) TIMELINE.pause();
    })
    .add(LOOP, 13.5)
    .to(".fade", { duration: 0.5, opacity: 0, display: "none" }, 0)
    .to(counter, {duration: 10, time: getTime("14:50"), ease: Linear.easeNone, onUpdate: updateCountdown}, 1)
    updateCountdown();

    console.log(TIMELINE);
    // TIMELINE.play(10)
}

window.addEventListener("load", init);
// window.onload = function () {
//     if (Enabler.isInitialized()) {
//         init();
//     } else {
//         Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
//     }
// };

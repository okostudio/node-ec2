var banner = {
    data: {},
    ctaActive: true,
    time: Date.now()
}
var TIMELINE;
//////////////////////////////////////////////////////////////////////////////////
// function onSplitFrames() { }

// INIT BANNER ----------------------------------
function init() {
    setBannerSize();
    
    gsap.set(".common, .scene", { display: "block" });
    gsap.set(".htmlMem", { skewX: 0.03, transformOrigin: "50% 50%" });
    gsap.set(".banner", { display: "block" });
    gsap.from(".htmlMem", { duration: 0.25, opacity: 0, ease: Power3.easeOut })

    addListeners();

    // new ImagePreloader([
    //     "car-bmw.jpg",
    //     "car-mitsubishi.jpg",
    //     "car-toyota.jpg"
    // ],
    // startBanner)
    startBanner();
}

function onMouseOver() {
    if(banner.ctaActive){
        document.querySelector(".cta").classList.add("over")
    }
}
function onMouseLeave() {
    if(banner.ctaActive){
        document.querySelector(".cta").classList.remove("over")
    }
}

function startBanner() {
    createLines();

    var FRAME1 = new gsap.timeline()
        .from(".frame1 .line", {duration: 0.51, y: 20, opacity: 0, ease: Power3.easeOut, stagger: 0.1}, "+=0.35")

    // MASTER TIMELINE
    TIMELINE = new gsap.timeline({repeat: 0})
    .add(FRAME1)
    .to(".fade", {duration: 0.3, opacity: 0}, 0)   


    // TIMELINE.play(11)
}

function loop() {
    if(banner.looped){
        console.log("DONE C: ", banner.time - Date.now())
        TIMELINE.pause();
    } else {
        banner.looped = true;
    }
}

window.addEventListener("load", init);

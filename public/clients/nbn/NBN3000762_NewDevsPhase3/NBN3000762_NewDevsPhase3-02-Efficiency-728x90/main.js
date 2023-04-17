var banner = {
    data: {},
    hasLooped: false,
    time: new Date()
};
var TIMELINE;
var lines;

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
    gsap.to(".cta", { duration: 0.3, backgroundColor: "#FFFFFF", ease: Power3.easeOut });
    gsap.to(".cta .chevron", { duration: 0.3, x: 2, ease: Power3.easeOut });
}
function onMouseLeave() {
    gsap.to(".cta", { duration: 0.3, backgroundColor: "#A0E311", ease: Power3.easeOut });
    gsap.to(".cta .chevron", { duration: 0.3, x: 0, ease: Power3.easeOut });
}


function maskCanvas(_image, _mask, _target){
    // init canvas
    canvas = document.querySelector(_target)
    canvas.width = document.querySelector(".scene").offsetWidth * 2;
    canvas.height = document.querySelector(".scene").offsetHeight * 2;
    ctx = canvas.getContext("2d")

    var image = document.querySelector(_image);
    var mask = document.querySelector(_mask);

    function draw(src, scale){
        ctx.drawImage(src,0,0,src.width * scale,src.height * scale,0,0,canvas.clientWidth,canvas.clientHeight);
    }

    draw(image, 2);
    ctx.globalCompositeOperation = 'destination-in';
    draw(mask, 1);
}

function StartBanner() {
    gsap.set(".banner", { display: "block" });
    gsap.from(".htmlMem", { duration: 0.25, opacity: 0, ease: Power2.easeIn });

    maskCanvas(".scene .background", ".scene .mask", ".scene canvas")
    banner.time = new Date()


    convertSVGtoPaths();
    // 
    // Prepare lines / letters for animation
    // 
    function splitToLetters(){
        var tagline = document.querySelector(".tagline");
        splitLinesToLetters(tagline)
    }
    splitToLetters();
    createLines(".frame1 .copy")
    createLines(".frame2 .copy")
    createLines(".frame4 .copy")
    
    var LOGO = new gsap.timeline()
        .from(".logo", {duration: 0.4, opacity: 0, transformOrigin: "50% 50%", ease: Power2.easeOut}, 0) 
        .fromTo("#rings g", {opacity: 0},{duration: 0.4, opacity: 1, ease: Power2.easeOut, stagger: 0.1}, "-=0.2" )
    
    // animate lines
    var LINES = new gsap.timeline({repeat: 0, repeatDelay: 0})
    function addLines(line, _atTime, _duration, _repeat){
        var dur = _duration ? _duration : 1.5;
        var tl = new gsap.timeline({repeat: _repeat ? _repeat : 0, repeatDelay: 0})
            .fromTo(line, {drawSVG: "0% 0%"}, {duration: dur * 0.5, drawSVG: "0% 40%", ease: Power2.easeIn})
            .to(line, {duration: dur * 0.25, drawSVG: "60% 100%", ease: Linear.easeNone})
            .to(line, {duration: dur * 0.25, drawSVG: "100% 100%", ease: Linear.easeNone})
        LINES.add(tl, _atTime);
    }
    var whiteLines = document.querySelectorAll(".lines #white path");
    whiteLines.forEach((whiteLine, i) => {
        addLines(whiteLine, i * 0.25 + 0.5)
    })
    addLines(".lines #green path", 0, 3.0)



    var FRAME1 = new gsap.timeline()
        .from(".frame1 .line span", {duration: 0.5, y: 15, opacity: 0, display: "none", ease: Power3.easeOut, stagger: 0.08 }, "+=0.25")

    var FRAME2 = new gsap.timeline()
        .to(".frame1 .line span", {duration: 0.6, opacity: 0, display: "none", ease: Power3.easeIn })     
        .from(".frame2 .line span", {duration: 0.5, y: 15, opacity: 0, display: "none", ease: Power3.easeOut, stagger: 0.08 })
        .from(".scene canvas", {duration: 5, opacity: 0, ease: Power2.easeIn})
    
    var FRAME3 = new gsap.timeline()
        .to(".frame2 .line", {duration: 0.6, opacity: 0, display: "none", ease: Power3.easeIn })     
        .from(".frame3 .line", {duration: 0.5, y: 15, opacity: 0, display: "none", ease: Power3.easeOut, stagger: 0.08 })
    
    var FRAME4 = new gsap.timeline()
        .to(".frame3 .line", {duration: 0.6, opacity: 0, display: "none", ease: Power3.easeIn })     
        .from(".frame4 .line", {duration: 0.5, y: 15, opacity: 0, display: "none", ease: Power3.easeOut, stagger: 0.08 })

    var ENDFRAME = new gsap.timeline({onComplete: function(){console.log("time" + banner.width + "x" + banner.height, new Date() - banner.time)}})
        .to(".frame4 .line", {duration: 0.6, opacity: 0, display: "none", ease: Power3.easeIn })
        .to(".frame4, .scene canvas, .lines, .foreground", {duration: 1.2, y: "0%", ease: Power3.easeInOut }, "-=0.6")
        .from(".endframe", {duration: 1.2, y: "100%", ease: Power3.easeInOut }, "-=1.2")
        .add(LOGO, "-=0.5")

        .from(".tagline .letter", {opacity: 0, stagger: 0.05, duration: 0.4, ease: Linear.easeNone}, "-=1")
        .from(".cta", {duration: 0.6, y: 15, opacity: 0, ease: Power3.easeOut }, "-=0.25")
        .to(".tagline .letter", {color: "#A0E311", stagger: 0.03, duration: 0.1, ease: Linear.easeNone}, 1.5)
        .to(".tagline .letter", {color: "#FFFFFF", stagger: 0.03, duration: 0.2, ease: Power2.easeIn}, 1.6)
        



    // MASTER TIMELINE
    TIMELINE = new gsap.timeline()
    .add(FRAME1, 0)
    .add(FRAME2, "+=1.3")
    .add(FRAME3, "-=2.3")
    .add(FRAME4, "+=1.6")
    .add(ENDFRAME, "+=1.10")
    .add(LINES, 1)
    .to(".fade", { duration: 0.5, opacity: 0, display: "none" }, 0)
    .addLabel("end")

}


window.addEventListener("load", init);
// window.onload = function () {
//     if (Enabler.isInitialized()) {
//         init();
//     } else {
//         Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
//     }
// };

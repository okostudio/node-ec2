/////////////////////////////////////////////////////////
//
// Listeners
//
/////////////////////////////////////////////////////////
function addListeners(_over, _out) {

    var clickthrough = document.querySelector(".clickthrough");
    clickthrough.addEventListener("click", onClickThrough);
    clickthrough.addEventListener("mouseover", _over);
    clickthrough.addEventListener("mouseout", _out);
}

function onClickThrough() {
    console.log(">> Standard ClickThrough");
    window.open(window.clickTag);
    // Enabler.exitOverride("Default Clickthrough", banner.data.ClickThrough_URL.Url);
    // Enabler.exit("Default Clickthrough");
}

/////////////////////////////////////////////////////////
//
// Polyfills
//
/////////////////////////////////////////////////////////
ArrayFrom = function (list) {
    var array = [];
    for (i = 0; i < list.length; i++) {
        array.push(list[i]);
    }
    return array;
};

/////////////////////////////////////////////////////////
//
// Image Preloader
//
/////////////////////////////////////////////////////////
function ImagePreloader(images, callback) {
    this.images = images;
    this.callback = callback;
    this.imagesLoaded = 0;
    this.imgArray = [];
    var THIS = this;
    this.images.map(function (image, i) {
        THIS.imgArray.push(THIS.loadImage(image));
    });
    return this.imgArray;
}

ImagePreloader.prototype.loadImage = function (src) {
    var THIS = this;
    var newImage = new Image();
    newImage.src = src;
    newImage.onload = function (e) {
        THIS.imagesLoaded++;
        if (THIS.imagesLoaded == THIS.images.length) {
            console.log(">> ALL IMAGES LOADED");
            THIS.callback();
        }
    };
    return newImage;
};

/////////////////////////////////////////////////////////
//
// META DATA EXTRACTOR
//
/////////////////////////////////////////////////////////
// returns an object with width & height of banner.
function getAdSizeMeta() {
    var content;
    var metaTags = document.getElementsByTagName("meta");
    ArrayFrom(metaTags).map(function (meta) {
        if (meta.name == "ad.size") {
            content = meta.content.split(",");
        }
    });
    var size = {
        width: parseInt(content[0].substring(6)),
        height: parseInt(content[1].substring(7)),
    };
    return size;
}

// SET BANNER SIZE --------------------------------------------
function setBannerSize() {
    // check banner exists.
    if (!window.hasOwnProperty("banner")) window.banner = {};

    banner.width = getAdSizeMeta().width;
    banner.height = getAdSizeMeta().height;
    document.querySelector(".banner").style.width = banner.width + "px";
    document.querySelector(".banner").style.height = banner.height + "px";

    document.title = getAdSizeMeta().width + "x" + getAdSizeMeta().height;
}

///////////////////////////////////////////////////
//
//  Helpers
//
///////////////////////////////////////////////////
function randomRange(n) {
    return Math.random() * n - n * 0.5;
}

function createLines(target) {
    // var n = 0;
    var copy = document.querySelectorAll(target?target:".copy");
    copy.forEach(function(textBlock){
        var lines = textBlock.innerHTML.split("<br>");
        textBlock.innerHTML = '<div class="line"><span>' + lines.join('</span></div><div class="line"><span>') + '</span></div>';
    })
}

function splitLinesToWords() {
    
    var lines = ArrayFrom(document.querySelectorAll(".line"));
    lines.map(function (line, i) {
        var words = line.innerHTML.split(" ");
        words = words.map( function(word){
            if(word.indexOf("_") > -1){
                return( "<span class='word large'>"+word.split("_")[1]+"</span>" )
            } else {
                return(word)
            } 
        })
        line.innerHTML = "<span class='line-animate'>" + words.join(" ") + "</span>";
    });
}

function splitLinesToLetters(target) {
    var letters = target.innerHTML.split("");
    var html = "";
    letters.map(function (letter) {
        if(letter === " "){
            html += " ";
        } else {
            html += "<span class='letter'>" + letter + "</span>";
        }
    });
    target.innerHTML = html;
}


function convertPolyToPath(poly){
    var svgNS = poly.ownerSVGElement.namespaceURI;
    var path = document.createElementNS(svgNS,'path');
    var className = poly.getAttribute('class');
    var points = poly.getAttribute('points').split(/\s+|,/);
    var x0=points.shift(), y0=points.shift();
    var pathdata = 'M'+x0+','+y0+'L'+points.join(' ');
    if (poly.tagName=='polygon') pathdata+='z';
    path.setAttribute('id',poly.getAttribute('id'));
    path.setAttribute('class', className);
    path.setAttribute('d',pathdata);

    poly.parentNode.replaceChild(path,poly);
}
function convertLineToPath(line){
    var svgNS = line.ownerSVGElement.namespaceURI;
    var path = document.createElementNS(svgNS,'path');
    var x1 = line.getAttribute('x1');
    var y1 = line.getAttribute('y1');
    var x2 = line.getAttribute('x2');
    var y2 = line.getAttribute('y2');
    var pathdata = 'M'+x1+','+y1+'L'+x2+','+y2;
    path.setAttribute('id',line.getAttribute('id'));
    path.setAttribute('class',line.getAttribute('class'));
    path.setAttribute('d',pathdata);
    line.parentNode.replaceChild(path,line);
}
function convertSVGtoPaths(){
    [].forEach.call(document.querySelectorAll('polygon,polyline'),convertPolyToPath);
    [].forEach.call(document.querySelectorAll('line'),convertLineToPath);
}


// ==============================
//
// CANVAS SPRITES
// & Particle Systems
//
// ==============================
function newSprite(imageElement) {
    return {
        img: {
            x: 0,
            y: 0,
            width: imageElement.width,
            height: imageElement.height,
            src: imageElement
        },
        offset: { x: 0, y: 0, rotation: 0 },
        x: 0,
        y: 0,
        alpha: 1,
        rotation: 0,
        scale: 1,
    };
};
drawSprite = function (p, _ctx) {
    if (p) {
        _ctx.translate(
            p.x + p.offset.x,
            p.y + p.offset.y
        );
        _ctx.globalAlpha = p.alpha;
        _ctx.rotate(p.rotation + p.offset.rotation);
        _ctx.drawImage(
            // Source image element
            p.img.src,
            p.img.x,
            p.img.y,
            p.img.width,
            p.img.height,
            p.img.width * -0.5 * p.scale,
            p.img.height * -0.5 * p.scale,
            p.img.width * p.scale,
            p.img.height * p.scale
        );
        _ctx.rotate(-p.rotation);
        _ctx.translate(
            -p.x,
            -p.y
        );
    }
};


function initParticles(){
    var config = {
        count: 150
    }

    var _particles = []
    for(i = 0; i < config.count; ++i){
        var particle = newSprite(document.querySelector(".particle"))
        particle.x = 100 + (Math.random() * 400);
        particle.y = 150 + Math.random() * 400;
        particle.scale = 0.1 + Math.random() * 0.4;
        particle.alpha = 0.15 + Math.random() * 0.5;
        // particle.rotation = Math.random() * Math.PI * 2;

        _particles.push(particle);
    }
    return _particles;
}
// END PARTICLE SYSTEMS ---------------


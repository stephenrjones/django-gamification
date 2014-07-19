var project_visualizer = {canvas:null, $canvas:null, ctx:null, loadedImages:0, loadedArray:[]};
project_visualizer.imageArray = "canoe_green_sideways.png oar.png".split(" ");
project_visualizer.imageUrlPrefix = "/static/themes/camping/";

project_visualizer.init = function(){
    //Initialization

    project_visualizer.canvas = document.getElementById('badge_data_canvas');
    project_visualizer.$canvas = $(project_visualizer.canvas);
    if (project_visualizer.canvas && project_visualizer.canvas.getContext){
        project_visualizer.ctx = project_visualizer.canvas.getContext('2d');
        project_visualizer.preloadImages();
    } else {
        console.log("No Canvas Support");
        if (project_visualizer.$canvas) project_visualizer.$canvas.hide();
    }
};

project_visualizer.preloadImages = function() {
    for (var i = 0; i < project_visualizer.imageArray.length; i++) {
        project_visualizer.loadedArray[i] = new Image();
        project_visualizer.loadedArray[i].addEventListener("load", project_visualizer.trackProgress, true);
        var url = project_visualizer.imageArray[i];
        if (document.location.host != "") url = project_visualizer.imageUrlPrefix + url;
        project_visualizer.loadedArray[i].src = url;
    }
};

project_visualizer.trackProgress = function() {
    project_visualizer.loadedImages++;
    if (project_visualizer.loadedImages == project_visualizer.imageArray.length) {
        project_visualizer.imagesLoaded();
    }
};

project_visualizer.imagesLoaded = function() {
    //Run after all images are ready
    project_visualizer.draw_canoe_and_oars();
};

project_visualizer.draw_canoe_and_oars = function(){
    //Shortcuts
    var ctx = project_visualizer.ctx;
    var canoe = project_visualizer.loadedArray[0];
    var oar = project_visualizer.loadedArray[1];

    var canvas_width = project_visualizer.canvas.width;
    var canvas_height = project_visualizer.canvas.height;

    //Variables
    var canvas_spacing = 50;
    var canoe_spacing = 15;
    var canoe_spacing_right = 25;
    var canoe_width = canvas_width-(canvas_spacing*2);
    var canoe_height = 200 / (1460/canoe_width);
    var oar_width = 70;
    var num_oars = 20;
    if (project_info.badge_json.length < num_oars) num_oars = project_info.badge_json.length;

    var oar_spacing = parseInt((canoe_width-canvas_spacing-canoe_spacing_right-(canoe_spacing/2)) / (num_oars-1));
    ctx.font="bold 12px Verdana";

    var badges_max=0;
    var badges_min=100000000;
    for (var i=0;i<num_oars;i++){
        var badge = project_info.badge_json[i];
        var awards = badge[1].length;
        if (awards>badges_max) badges_max=awards;
        if (awards<badges_min) badges_min=awards
    }

    //Draw the oars
    for (var i=0;i<num_oars;i++){
        var badge = project_info.badge_json[i];
        var awards = badge[1].length;
        var name = badge[0];

        var oar_size = maths.sizeFromAmountRange(oar_width*0.75,oar_width*1.8,awards,badges_min,badges_max);

        //Draw the Oar
        var oar_x = canvas_spacing+canoe_spacing+(i*oar_spacing);
        var oar_y = 70 + maths.heightOnSin(0,1,i,num_oars-1,30);
        ctx.drawImage(oar,oar_x,oar_y,oar_size,oar_size);


        //Save oar location, and draw user name
        ctx.save();
        ctx.translate(oar_x+oar_size, oar_y+3);
        ctx.rotate(-Math.PI/4);
        ctx.textAlign = "left";
        ctx.fillText(name, 0, 0);


        //Draw Meatball
        var mb_spacing = maths.sizeFromAmountRange(15,25,awards,badges_min,badges_max);
        ctx.beginPath();
        ctx.arc(-mb_spacing, -3, mb_spacing/2, 0, 2 * Math.PI, false);
        var bgColor = maths.colorBlendFromAmountRange('#00ff00','#660000',awards,badges_min,badges_max);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

        //Draw Meatball text
        ctx.fillStyle = maths.idealTextColor(bgColor);
        ctx.textAlign = "center";
        ctx.font="bold "+(1+mb_spacing/2)+"px Verdana";
        var meatball =  awards;
        ctx.fillText(meatball, -mb_spacing, 1);

        ctx.restore();

    }

    ctx.drawImage(canoe,50,100,canoe_width,canoe_height);

    ctx.translate(canoe_width+30, 140);
    ctx.fillStyle = "white";
    ctx.rotate(-Math.PI/16);
    ctx.textAlign = "right";
    ctx.font="bold 16px Verdana";
    ctx.fillText(project_info.name, 0, 0);

};

$(document).ready(project_visualizer.init);

var maths = {};
maths.heightOnSin=function(theta_min,theta_max,step,steps,amplitude){
    var percent = step/steps;
    var theta = theta_min + ((theta_max-theta_min)*percent);
    return Math.sin(theta * Math.PI) * amplitude;
};
maths.sizeFromAmountRange=function(size_min,size_max,amount,amount_min,amount_max){
    var percent = (amount-amount_min)/(amount_max-amount_min);
    return size_min+ (percent * (size_max-size_min));
};
maths.colorBlendFromAmountRange=function(color_start,color_end,amount,amount_min,amount_max){
    var percent = (amount-amount_min)/(amount_max-amount_min);

    if (color_start.substring(0,1) =="#") color_start = color_start.substring(1,7);
    if (color_end.substring(0,1) =="#") color_end = color_end.substring(1,7);

    var s_r = color_start.substring(0,2);
    var s_g = color_start.substring(2,4);
    var s_b = color_start.substring(4,6);
    var e_r = color_end.substring(0,2);
    var e_g = color_end.substring(2,4);
    var e_b = color_end.substring(4,6);

    var n_r = Math.abs(parseInt((parseInt(s_r, 16) * percent) + (parseInt(e_r, 16) * (1-percent))));
    var n_g = Math.abs(parseInt((parseInt(s_g, 16) * percent) + (parseInt(e_g, 16) * (1-percent))));
    var n_b = Math.abs(parseInt((parseInt(s_b, 16) * percent) + (parseInt(e_b, 16) * (1-percent))));
    var rgb = maths.decimalToHex(n_r) + maths.decimalToHex(n_g) + maths.decimalToHex(n_b);

    return "#"+rgb;
};
maths.decimalToHex = function(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
};
maths.idealTextColor=function(bgColor) {

   var nThreshold = 150;
   var components = maths.getRGBComponents(bgColor);
   var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

   return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
};
maths.getRGBComponents=function(color) {

    var r = color.substring(1, 3);
    var g = color.substring(3, 5);
    var b = color.substring(5, 7);

    return {
       R: parseInt(r, 16),
       G: parseInt(g, 16),
       B: parseInt(b, 16)
    };
};
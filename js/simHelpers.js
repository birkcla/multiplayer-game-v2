//var maxHeight = window.innerHeight;
//var maxWidth = window.innerWidth;
var nextStep = (function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60);};})();

window.addEventListener("touchmove", function(e) {e.preventDefault()})

async function beforeStart() {
  var allscripts = [...document.querySelectorAll("script")].reduce(function(old, current) {return old + current.textContent;}, "");
  var fetchScripts = [...document.querySelectorAll("script[src]")]
  for(let s of fetchScripts) {
    allscripts += await fetch(s.getAttribute("src")).then(r=>r.text())
  }
  
  var imgpaths = [...allscripts.matchAll(/img:\s?"(.*)"/g)].map(function(el) {return el[1];});
  preloadImages(imgpaths, function() {
    console.log("images preloaded")
  })
}

function loopStart() {
  if(typeof loopExtension == "function") {
    loopExtension();
  }
  loop();
  nextStep(loopStart);
};

function mapPropsToActor(proparray, actor) {
  for(var i =0; i < proparray.length; i++) {
    var n = proparray[i];
    actor[n] = window[n] || null;
  }
}

sqrt = Math.sqrt;
sqr = function(a) {return a*a;};
sin = Math.sin;
cos = Math.cos;

function pyth(c1, c2) {
  return window.Math.sqrt(c1 * c1 + c2 * c2);
}
function dist(obj1, obj2) {
  return pyth(obj1.x - obj2.x, obj1.y - obj2.y);
}
function solveQuadratic(a, b, c) {
  var diskr = b*b - 4*a*c;
  if (diskr<0) {
    return [];
  }
  else if(diskr === 0) {
    return [-b/2/a];
  }
  else {
    return [(-b+window.Math.sqrt(diskr))/2/a, (-b-window.Math.sqrt(diskr))/2/a];
  }
}


log = console.log.bind(console);

var testmode = true;
var watches = [];

function watch() {
  
}

//myWatch------------------------------------------------------------------------------------------------

// z console.log(`TODO WATCHDIV`)


// document.documentElement.insertAdjacentElement("beforeEnd", `
//   <div id='myWatch' style='position:absolute; top:${innerHeight - 200}px; left:${innerHeight - 550}px; height:150px; width:180px; background-color:black; overflow: auto; font-size: 0.7em'></div>
// `)    
// $("").appendTo('body')
//     .css('overflow','auto').css('font-size', '0.7em');
//     $("<table id='myWatchTable'></table>").appendTo('#myWatch').css('color', 'white');
//     $("<button id='clearWatch' style='position:absolute; top:" + (innerHeight - 200) + "px; left:" + (innerWidth - 400) + "px; height:20px; width:50px; font-size:0.5em'>ClearWatch</button>").appendTo('body');
//     $('#clearWatch').on('click', function() {$('#myWatch').html("-----");});
      
//     $('#clearWatch').hide();
//     $('#myWatch').hide();
    
//     var myWatch = function myWatch(key) {
//         if (testmode) {
//         $("<tr><td>" + key + "</td><td id = 'watch" + watches.length + "'>" + eval(key) + "</td></tr>").appendTo('#myWatchTable');
//         watches.push(key);
//       }
//     };
//     var actualizeWatches = function() {
//       for (i=0; i<watches.length; i++) {
//       $("#watch" + i).html(Math.round(eval(watches[i])));
//       }
//     };


//END MY Watch---------------------------------------------------------------------------------


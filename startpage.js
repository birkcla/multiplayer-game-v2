var windowx = window.innerWidth
var windowy = window.innerHeight
let loopref


function adjustsize(){
    if (windowx != window.innerWidth || windowy != window.innerHeight){
        console.log("sizechange")

        windowx = window.innerWidth
        windowy = window.innerHeight
        getreferences()
        updatePlayerbox()
    }
    requestAnimationFrame(adjustsize)
}

adjustsize()

function stringconvert(text){
    characters = []
    for (let i =0; i < text.length; i++){
        currentchar = text.charAt(i)
        characters[i] = currentchar
    }
    

    newstring = ""
    random = Math.floor(Math.random() * text.length)
    for (let i = 0; i < text.length; i++){

        if (random == i){
            if (characters[i] == characters[i].toUpperCase()){
                newstring += characters[i].toLowerCase()
            }else{
                newstring += characters[i].toUpperCase()
            }
        }else{
        newstring += characters[i]
        }
    }
        //console.log(newstring)
        return(newstring)
        

}


function caseflickerstep(element) {
    let text = element.textContent;
    newtext = stringconvert(text)
    element.innerHTML = newtext;
    //console.log("flickerstep")
}


function buildstep(element, text){
    
    //console.log("buildstep")
    let otext = element.textContent;

    if (otext.length < text.length){
        otext += text.charAt(otext.length)
        element.innerHTML = otext;
    }
    buildprog += 1
}

function translationstep(id){
    translationstepcount += 1
    currentpos = translationstartpos + translationamount * animationspeed(translationstepcount / translationlength) 
    //console.log(document.getElementById(id))
    element.style.top = currentpos+"%"
    

}



function unhidestep(element, start, dur){
    element.style.opacity = (timems - (hideuntil * 1000)) / (unhidedur * 1000)
}




function startgame(){
    triggertime = timems

    getreferences();
    buildmap();
    setup();
    loopref = loopStart();

    if (animations == true){
        gamestarted = true
        setTimeout(rungame, ((fadeoutdur * 1000) + 200))
    }else{
        startscreen.style.display = "none"
        rungame()
    }

    
    
}


function fadeout(element, start, dur) {
    element.style.opacity = (1 - (((timems - start) / (1000 * dur))))
    if (timems > (start + (dur * 1000))) {
        element.style.display = "none"
        fadeoutdone = true
    }
}



function rungame(){
    gamerunning = true
    document.querySelector(".game").style.display = "block"
    ws.sendToAll(['start'])
}



async function animationstep(){
    timestep += 1
    //console.log(timestep)
    timems = timestep * (1000 / framerate)

    //do buildstep
    if (timestep > 0 && buildprog <= buildlength && buildprog < (timems / buildstepdur)) {
        buildstep(element, buildtext)
    }

    //do flickerstep
    if (flickercount < (timems / flickerstepdur)) {
        caseflickerstep(element)
        flickercount += 1
    }

    //do translationstep
    if (timems >= (animationstarttime * 1000)) {
        translationstep(element)
    }

    //do unhide step
    if (timems >= (hideuntil * 1000) && timems <= ((hideuntil + unhidedur) * 1000)) {
        unhidestep(elementtounhide, hideuntil, unhidedur)
    }
    
    //fade to black if game starts
    if (gamestarted == true && fadeoutdone == false) {
        fadeout(startscreen, triggertime, fadeoutdur)
        console.log("doing fadeout")
    }

    if (gamerunning == false){
        requestAnimationFrame(animationstep)
    }

    adjustsize()
}






//1800sttt


/* 
// test the function:
for (let i = 0; i < 1000; i++){
    x = i / 1000
    y = animationspeed(x)
    console.log(x+"-"+y)
}
 */












//script ----------------------------------------------




if (animations == true) {


    //id of whole startscreen
    startscreen = document.getElementById("startscreen")
    fadeoutdur = 0.2


    //what element to animate:
    elementid = "animatedtitle"
    element = document.getElementById(elementid)
    console.log("element is :"+element)
    //what timestep to start:
    timestep = -5


    //buildanimationlength
    buildduration = 1


    //flickerfrequency
    flfr = 8


    //trtanslation animation length:
    translationlength = 50
    animationstarttime = 1.5
    //position before translation
    translationstartpos = 50
    //position after translation
    translationendpos = 25

    function animationspeed(x){
        y = 1 / (1 + (Math.exp(-10*x + 5)))
    return y
    }



    hideuntil = 2
    unhidedur = 0.4
    elementtounhide = document.getElementById("startmenubox")

    //agonew

    //initialize


    var timems = 0
    var triggertime = 0
    gamestarted = false
    fadeoutdone = false

    
    startmenubox.style.opacity = 0
    element.style.top = translationstartpos+"%"

    buildtext = element.textContent
    buildlength = buildtext.length
    console.log("buildlength is", buildlength)
    element.innerHTML = ""
    buildprog = 0
    buildstepdur = buildduration * 1000 / buildlength

    flickercount = 0
    flickerstepdur = 1000 / flfr

    translationstepcount = 0
    translationamount = translationendpos - translationstartpos


    uhidecount = 0


    ypos = translationstartpos
    //start animationloop

    //setInterval(animationstep, 1000/framerate)

    requestAnimationFrame(animationstep)
   


}
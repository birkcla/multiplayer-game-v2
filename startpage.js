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
}

function translationstep(id){
    translationstepcount += 1
    //stepsize = translationamount * animationspeed(translationstepcount / translationlength)
    //console.log(document.getElementById(id))
    ypos += 0.1
    element.style.top = ypos+"%"
    

}







async function animationstep(){
    timestep += 1
    //console.log(timestep)

    //do buildstep
    if (timestep > 0 && timestep <= buildlength) {
        buildstep(element, buildtext)
    }

    //do flickerstep
    caseflickerstep(element)

    //do translationstep
    translationstep(element)

}






//1800sttt











//script ----------------------------------------------

//what element to animate:
elementid = "animatedtitle"
element = document.getElementById(elementid)
console.log("element is :"+element)
//what timestep to start:
timestep = -5

//trtanslation animation length:
translationlength = 100
//position before translation
translationstartpos = 50
//position after translation
translationendpos = 30

function animationspeed(x){
    1 / (1 + e**-x)
return x
}





//initialize
buildtext = element.textContent
buildlength = buildtext.length
console.log("buildlength is", buildlength)
element.innerHTML = ""

translationstepcount = 0
translationamount = translationendpos - translationstartpos


ypos = translationstartpos
//start animationloop
animationloop_startscreen = setInterval(animationstep, 100)


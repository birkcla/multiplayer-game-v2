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


function caseflickerstep(id) {
    let text = document.getElementById(id).textContent;
    newtext = stringconvert(text)
    document.getElementById(id).innerHTML = newtext;
    //console.log("flickerstep")
}


function buildstep(id, text){
    //console.log("buildstep")
    let otext = document.getElementById(id).textContent;

    if (otext.length < text.length){
        otext += text.charAt(otext.length)
        document.getElementById(id).innerHTML = otext;
    }
}

function translationstep(id){
    translationstepcount += 1
    //stepsize = translationamount * animationspeed(translationstepcount / translationlength)
    console.log(document.getElementById(id))
    

}







async function animationstep(){
    timestep += 1
    //console.log(timestep)

    //do buildstep
    if (timestep > 0 && timestep <= buildlength) {
        buildstep(elementid, buildtext)
    }

    //do flickerstep
    caseflickerstep(elementid)

    //do translationstep
    translationstep(elementid)

}






//1800sttt











//script ----------------------------------------------

elementid = "animatedtitle"
timestep = -5

translationlength = 100
translationstartpos = 50
translationendpos = 30

function animationspeed(x){
    1 / (1 + e**-x)
return x
}





//initialize
buildtext = document.getElementById(elementid).textContent
buildlength = buildtext.length
console.log("buildlength is", buildlength)
document.getElementById(elementid).innerHTML = ""

translationstepcount = 0
translationamount = translationendpos - translationstartpos


//start animationloop
animationloop_startscreen = setInterval(animationstep, 100)


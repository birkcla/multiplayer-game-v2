debugger
const endscreenelement = document.getElementById("endscreen")
const winnerboxelement = document.getElementById("winnerbox")
//set endpage fade in duration
const epfadedur = 0.2



function toggleEndscreen() {
    ws.sendToUser(['winner'], winner.id)	

    let winnercolor = hsvToHex(winner.colorhsv)
    console.log(winnercolor)
    winnerbox.style.backgroundColor = winnercolor
    if (animations == true) {
        endscreenelement.style.opacity = 0
        endscreenelement.style.display = "block"
        endpagefadestep()
    }else{
        endscreenelement.style.display = "block"
    }
}

function endpagefadestep() {
    debugger
    let oldop = parseFloat(endscreenelement.style.opacity)
    endscreenelement.style.opacity = oldop + (1 / (epfadedur * framerate))
    if (oldop < 1){
        requestAnimationFrame(endpagefadestep)
    }else{
        endscreenelement.style.opacity = 1
    }
}



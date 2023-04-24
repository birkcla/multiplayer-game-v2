
playerboxelement = document.getElementById("playerboxrender")
width = playerboxelement.clientWidth
height = playerboxelement.clientHeight
stepsize = 1
const noplayerbox = document.getElementById("noplayerbox")


playerbox = new World({
    hUnits: height,
    wUnits: width,
    hPx: height,
    wPx: width,
    bgColor: "0x191919",
    //coords: {step: 50},
    unit: "px",
    minUnits: {x: 0, y: 0},
    fontColor: "#ffffff",
    object: playerboxelement
});

//circle = new playerboxCircle({r:30, x:20, y:20, color: "0xffffff"})


let colorsdrawn = []



function updatePlayerbox(){
        

    if (colors.length > 0) {
        noplayerbox.style.display = "none"
    }else{
        noplayerbox.style.display = "block"

    }
    for (let i of colorsdrawn){
        i.destroy()
    }
    colorsdrawn = []

    w = playerboxelement.clientWidth
    h = playerboxelement.clientHeight


    playerbox.hPx = h
    playerbox.wPx = w
    

    center = [w/2, h/2]
    //x = new playerboxCircle({r:30, x:center[0], y:center[1], color: "0x00ff00"})
    let radius = (0.9 * h)/2
    let step = (w - (2 * radius)) / colors.length
    playerbox.renderer.view.width = w
    playerbox.renderer.view.height = h
    let posx = center[0]-((colors.length -1) * step / 2)
    for (i = 0; i < colors.length; i++){
        let color = colors[i]
        colorsdrawn[i] = new playerboxCircle({r:radius, x:posx, y:center[1], color: color})
        posx += step
    }

    playerbox.renderer.render(playerbox.stage)
    

}



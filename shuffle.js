function shuffle(array){
    const l = array.length
    for (i = 0; i < 2*l; i++){
        let r1 = Math.round(Math.random() * (l -1))
        let r2 = Math.round(Math.random() * (l -1))
        let x = array[r1]
        let y = array[r2]
        array[r1] = y
        array[r2] = x
    }
    return array
}



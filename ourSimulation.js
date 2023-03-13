
circle2size = 70
circlesize = 60
color = [(Math.floor(Math.random() * 12)*30), ((Math.floor(Math.random() * 3) * 20) + 60), ((Math.floor(Math.random() * 4) * 20) + 40)]
console.log(color);


let ws;

async function startSocket() {
	sessionStorage.user = sessionStorage.user || `Host`;
	ws = await WS.connect('kugelspiel6', sessionStorage.user);
	console.log(`${ws.username} connected!`, ws);
	ws.onMessage(message);
	ws.onUserStatus(userchange);
}	


function changecolor(){
	color[0] = (color[0] + 60) %360
	color[1] += 20
	color[2] += 20

	if (color[1] > 100) {
		color[1] -= 80
	}

	if (color[2] > 100) {
		color[2] -= 80
	}
}




function buildWorld() {
	
	world = new World({
		hUnits: 150,
		wPx: window.innerHeight,
		coords: {step: 10},
		unit: "m",
		minUnits: {x: -85, y: -75},
		fontColor: "#ffffff"
	});

	//l = drawLine({from: {x: 0, y: 100}, to: {x: 6000, y: 0}})
	//world.add(l)
	
	temp = hsvToHex([0, 0, 100])
	temp2 = hsvToHex([255, 0, 0])
	circlecolor = parseInt(temp.slice(1), 16)
	//circle = new PassiveSprite({x: 0, y: 0, wUnits: 2*circlesize, color: circlecolor})
	let color2 = parseInt(temp2.slice(1), 16)
	spawncircle = new Circle({r: circle2size, x:0, y: 0, color: color2 })
	worldcircle = new Circle({r: circlesize, x: 0, y: 0, color: circlecolor}) 
	

	ws = startSocket()

}

players = []



function create_player(id) {
	
	let temp = hsvToHex(color)
	let color2 = parseInt(temp.slice(1), 16)
	let player = new Circle({r: 3.5, x: 0, y: 0, color:color2});
	player.vx = 0
	player.vy = 0
	player.ax = 0
	player.ay = 0
	player.boost = 0
	player.id = id
	player.colorhsv = [color[0], color[1], color[2]]
	console.log('playercolor is', color)
	players.push(player)
	changecolor()
	
	return player
}

function checkifoffmap() {
	for (let p of players) {
		if (p.x**2 + p.y**2 > (circlesize/25*26)**2) {
			killplayer(p)
		}
	}
}

function killplayer(p) {
	//p.x = -420000
	ws.sendToUser('GameOver', p.id)
	players = players.filter(function(name) {return name !== p.id})
	p.stepstogo = 128
}




function setup() {
	t = 0;
	dt = 0.016;       // Zeitschritt in Sekunden


	testi1 = create_player("testi1")
	testi1.x = 10

	testi2 = create_player("testi2")
	testi2.x = 20
	testi2.y = 16
	testi2.vx = -50
	testi2.vy = -80

}



//window.addEventListener("keydown", taste);

/* function taste(event) {
	console.log("connected!`", event.key)
	
}  */


function loop() {

	
	

	for (let p of players) {
		p.vx += 4*(p.ax/(2**0.5)) 
		p.vy -= 4*(p.ay/(2**0.5)) 
		p.vx = 0.995 * p.vx
		p.vy = 0.995 * p.vy 			//* (0.995 * (0.05*p.boost+1)) //braucht noch ein speedlimit damit es spielbar ist
		p.x += p.vx * dt 
		p.y += p.vy * dt 
//* (0.995 * (0.05*p.boost+1))
//* (0.995 * (0.05*p.boost+1)) //braucht noch ein speedlimit damit es spielbar ist

	}

	
	checkifoffmap()

	world.update();

	checkcollision(7)
}



function message(msg) {
	input = msg
	console.log(input)
	
	player = findPlayerById(input.from)
	player.ax = input.data[0]
	player.ay = input.data[1]
	player.boost = input.data[2]	//boost dazubauen

}

function findPlayerById(id) {
	for(let p of players) {
		if(p.id == id) {
			return p
		}
	}
	return false
}


function userchange(data) {
	console.log(data);
	for (let i of data.slice(1)){
		player = findPlayerById(i)
		if (!player){
			player = create_player(i)
			msg = ['color', player.colorhsv[0], player.colorhsv[1], player.colorhsv[2]]
			ws.sendToUser(msg, i)
		}
		

	}
	
}

function checkcollision(radius){
	count = 0
	for (let p of players){
		count += 1
		for (let p2 of players.slice(count)){
			distancex = p.x - p2.x
			distancey = p.y - p2.y
			distance = (distancex**2 + distancey**2)**0.5

			if (distance <= radius) {
				collide(p, p2)
			}

		}
	}
}

function collide(p1, p2) {
	nvrawx = p1.x - p2.x
	nvrawy = p1.y - p2.y
	betrag = (nvrawx**2 + nvrawy**2)**0.5

	//normalvektor achse
	nvx = nvrawx / betrag
	nvy = nvrawy / betrag

	//vektobetrag entlang normalachse
	skalarproduktp1 = (p1.vx * nvx) + (p1.vy * nvy)
	skalarproduktp2 = (p2.vx * nvx) + (p2.vy * nvy)

	
	//vektorbetrag  entlang normalachse aufteilung auf x y
	p1velnorx = skalarproduktp1 * nvx
	p1velnory = skalarproduktp1 * nvy

	p2velnorx = skalarproduktp2 * nvx
	p2velnory = skalarproduktp2 * nvy

	//vektorbetrag entlang tangens achse aufteilung auf x y
	p1veltanx = p1.vx - p1velnorx
	p1veltany = p1.vy - p1velnory

	p2veltanx = p2.vx - p2velnorx
	p2veltany = p2.vy - p2velnory


	//addistion der beiden vektoren
	p1vnx = p1veltanx + p2velnorx
	p1vny = p1veltany + p2velnory

	p2vnx = p2veltanx + p1velnorx
	p2vny = p2veltany + p1velnory


	//zuweisung
	p1.vx = p1vnx
	p1.vy = p1vny

	p2.vx = p2vnx
	p2.vy = p2vny
	

}







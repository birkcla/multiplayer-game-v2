circlesize = 60
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

	circle = new PassiveSprite({img: "img/circle.png", x: 0, y: 0, wUnits: 2*circlesize})
	//flugi = new Actor({img: "img/flugi50.png", x: -40, y: 60, wUnits: 14});
	//glider = new Actor({img: "img/Segelflieger50.png", x: 0, y: 100, wUnits: 14});

	startSocket()
}

players = []



function create_player(id) {
	let player = new Actor({img: "img/Red-Ball-Transparent.png", x: 0, y: 0, wUnits: 7});
	player.vx = 0
	player.vy = 0
	player.ax = 0
	player.ay = 0
	player.boost = 0
	player.id = id
	players.push(player)
	return player
}

function checkifoffmap() {
	for (let p of players) {
		if (p.x**2 + p.y**2 > (circlesize/25*26)**2) {
			p.x = -420000
			players = players.filter(function(name) {return name !== p.id})
		}
	}
}



function setup() {
	t = 0;
	dt = 0.016;       // Zeitschritt in Sekunden


	//create_player()

}



//window.addEventListener("keydown", taste);

/* function taste(event) {
	console.log("connected!`", event.key)
	
}  */


function loop() {

	

	for (let p of players) {
		p.vx += (p.ax/(2**0.5)) 
		p.vy -= (p.ay/(2**0.5)) 
		p.vx = p.vx * (0.995 * (0.05*p.boost+1))
		p.vy = p.vy * (0.995 * (0.05*p.boost+1)) //braucht noch ein speedlimit damit es spielbar ist
		p.x += p.vx * dt 
		p.y += p.vy * dt 

	}

	
	checkifoffmap()

	world.update();

	checkcollision(7)
}

async function startSocket() {
	sessionStorage.user = sessionStorage.user || `Host`;
	const ws = await WS.connect('kugelspiel5', sessionStorage.user);
	console.log(`${ws.username} connected!`, ws);
	ws.onMessage(message);
	ws.onUserStatus(userchange)
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
			create_player(i)
		}
		

	}
	
}

function checkcollision(radius){
	count = 0
	for (let p in players){
		count += 1
		for (let p2 in players.slice(count)){
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
	nvx = nvrawx / betrag
	nvy = nvrawy / betrag

	skalarproduktp1 = (p1.x * nvx) + (p1.y * nvy)
	skalarproduktp2 = (p2.x * nvx) + (p2.y * nvy)

	//velocity assignement
	p1velnorx = skalarproduktp1 * nvx
	p1velnory = skalarproduktp1 * nvy

	p1veltanx = p1.vx - p1velnorx
	p1veltany = p1.vy - p1velnory

	p2velnorx = skalarproduktp2 * nvx
	p2velnory = skalarproduktp2 * nvy

	p2veltanx = p2.vx - p2velnorx
	p2veltany = p2.vy - p2velnory

	p1vnx = p1veltanx + p2velnorx
	p1vny = p1veltany + p2velnory

	p2vnx = p2veltanx + p1velnorx
	p2vny = p2veltany + p1velnory



	p1.vx = p1vnx
	p1.vy = p1vny

	p2.vx = p2vnx
	p2.vy = p2vny
	

}

circlesize = 30
function buildWorld() {
	
	world = new World({
		hUnits: 100,
		wPx: window.innerHeight,
		coords: {step: 10},
		unit: "m",
		minUnits: {x: -50, y: -50},
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
		p.vx = p.vx * 0.985
		p.vy = p.vy * 0.985
		p.x += p.vx * dt 
		p.y += p.vy * dt 
		p.boost*2 += p.vx
		p.boost*2 += p.vy
	}

	checkifoffmap()

	world.update();
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

//checkcollision()
//	for (let p in players){

//	}



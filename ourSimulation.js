
circle2size = 70
circlesize = 60
const playerradius = 10
color = [(Math.floor(Math.random() * 12)*30), ((Math.floor(Math.random() * 3) * 20) + 60), ((Math.floor(Math.random() * 4) * 20) + 40)]
console.log(color);

let ws = startSocket()
let sizereference

buildWorld();



function equal(v1, v2) {
	let delta = [(v2[0] - v1[0]), (v2[1] - v1[1])]
	let dist = (delta[0]**2 + delta[1]**2)**0.5
	if (dist < 0.0001) {
		return true
	}else{
		return false
	}

}


const spawnpointpos = [
	{n: 1, x: 65, y: 70},
	{n: 2, x: 25, y: 30},
	{n: 3, x: 60, y: 180},
	{n: 4, x: 180, y: 150},

	{n: 5, x: 250, y: 30},
	{n: 6, x: 260, y: 120},
	{n: 7, x: 130, y: 140},
	{n: 8, x: 125, y: 25},
	
]


// obstacles have to be updated after creating in order to pass them the sizereference which is defined later in the script
//the x & y position is where their left upper corner should be on the game map which has the aspect ration of 2/3.
//the max coordinates are x = 300 & y = 200
obstacle_data = [
	{id: 0001, xg: 40, yg: 100, width: 10, height: 90, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0002, xg: 70, yg: 100, width: 50, height: 10, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0003, xg: 40, yg: 50, width: 40, height: 10, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0003, xg: 180, yg: 75, width: 80, height: 15, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0003, xg: 220, yg: 150, width: 10, height: 50, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0003, xg: 150, yg: 180, width: 10, height: 50, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0003, xg: 50, yg: 165, width: 110, height: 10, radius: 3, color: 0x804d4d, csyst: "game"},
	{id: 0003, xg: 140, yg: 80, width: 10, height: 60, radius: 3, color: 0x804d4d, csyst: "game"}

]



var spawnpoints = []
var obstacles = []
var zeropos = []

async function startSocket() {
	sessionStorage.user = sessionStorage.user || `Host`;
	ws = await WS.connect('kugelspiel6', sessionStorage.user);
	//console.log(`${ws.username} connected!`, ws);
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
		hUnits: window.innerHeight,
		wUnits: window.innerWidth,
		hPx: window.innerHeight,
		wpx: window.innerWidth,
		bgColor: "0x000000",
		coords: {step: 100},
		unit: "px",
		minUnits: {x: 0, y: 0},
		fontColor: "#ffffff"
	});

	//l = drawLine({from: {x: 0, y: 100}, to: {x: 6000, y: 0}})
	//world.add(l)
	
	temp = hsvToHex([0, 0, 100])
	temp2 = hsvToHex([255, 0, 0])
/* 	circlecolor = parseInt(temp.slice(1), 16)
	//circle = new PassiveSprite({x: 0, y: 0, wUnits: 2*circlesize, color: circlecolor})
	let color2 = parseInt(temp2.slice(1), 16)

	
 */

}

players = []



function create_player(id) {
	
	let temp = hsvToHex(color)
	let color2 = parseInt(temp.slice(1), 16)
	let player = new PCircle({r: 20, x: 0, y: 0, color:color2});
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
		let collided = (plattform.checkifcollided(p.x, p.y, p.r, sizereference))[0]
		//console.log(p.x, p.y, collided)
		if (collided == "true") {
			plattform.color = 0xcc0000
		}else{
			plattform.color = 0x00cc00
		}
		plattform.updateshape(sizereference)
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


/* 	testi1 = create_player("testi1")
	testi1.x = 10

	testi2 = create_player("testi2")
	testi2.x = 20
	testi2.y = 16
	testi2.vx = -50
	testi2.vy = -80 */

	//build scene
	

}

function getreferences() {
		if ((window.innerHeight / window.innerWidth) > 2/3){
			console.log("zuhoch")
			sizereference = window.innerWidth * 0.9
		}else{
			console.log("zubreit")
			sizereference = window.innerHeight * 0.9 * 3/2
			

		}
		console.log("sizereference is now :" + sizereference)

}

function buildmap() {
	plattform = new RoundedRectangle({color: 0xffffff, sizereference: sizereference, drawoncreation: "false"}) 
	//plattform = new Circle({r: 200, x: 0, y: 0, color: 0xffbb00})
	
	plattform.height = 200 * (sizereference / 300)
	plattform.width = 300 * (sizereference / 300)
	plattform.radius = 3 * (sizereference / 300)
	plattform.x = (window.innerWidth / 2) - (plattform.width / 2)
	plattform.y = (window.innerHeight / 2) + (plattform.height / 2)

	zeropos = [(window.innerWidth / 2) - (plattform.width / 2),
	(window.innerHeight / 2) - (plattform.height / 2)]
	console.log(zeropos)


	plattform.updateshape()


	//load and create spawnpoints
	
	for (let i = 0; i < spawnpointpos.length; i++) {
		pos = [spawnpointpos[i].x, spawnpointpos[i].y]
		cpoint = new spawnpoint({position: pos})
		spawnpoints[i] = cpoint
		cpoint.radius = playerradius * 2
		cpoint.active = true
		cpoint.updateshape()
		console.log(cpoint)

	}


	//load and create obstacles
	for (let i = 0; i < obstacle_data.length; i++) {
		obstacles[i] = new RoundedRectangle(obstacle_data[i])
		obst = obstacles[i]
		w = obst.width
		h = obst.height
		r = obst.radius
		obst.width = w * (sizereference / 300)
		obst.height = h * (sizereference / 300)
		obst.radius= r * (sizereference / 300)
		obst.draw()
		obst.updateshape()
	}

	//place players
	shuffledspawnpoints = shuffle(spawnpointpos)
	for (i = 0; i > players.length; i++) {
		const p = players[i]
		let x = shuffledspawnpoints[i].x
		let y = shuffledspawnpoints[i].y
		p.x = x
		p.y = y
	}





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
	//console.log(input)
	
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
	console.log("user just changed"+data);
	for (let i of data.slice(1)){
		player = findPlayerById(i)
		if (!player){
			player = create_player(i)
			msg = ['color', player.colorhsv[0], player.colorhsv[1], player.colorhsv[2]]
			console.log("now would be the time to send"+msg+"----"+i)
			ws.sendToUser(msg, i)
		}
		

	}
	
}

function checkcollision(radius){
	//check for barrier collisions




	count = 0
	for (let p of players){
		count += 1
		
		
		//check for obstacle collisions
		for (let obstacle of obstacles) {
			//console.log(obstacle)
			let [collided, distance, lot] = obstacle.checkifcollided(p.x, p.y, p.r, sizereference)
			if (collided == "true") {
				//console.log(distance+"/"+lot)
				


		 		//player velocity markdown
				let v1 = [p.vx, p.vy]
				//normalize => betrag = 1
				let betrag = (v1[0]**2 + v1[1]**2)**0.5
				let v1n = [(v1[0] / betrag), (v1[1] / betrag)]
			/*	
				//get temppos
				let pos = [p.x, p.y]
				let tomove = [(lot[0] * (distance * -1)), (lot[1] * (distance * -1))]
				let temppos = [(pos[0] + (v1n[0] * -1 * distance)), (pos[1] + (v1n[1] * -1 * distance))]
				console.log(("pos: "+pos+"------"+"temppos"+temppos))
				
				 */
				
				p1 = [(p.x - (p.vx * dt)), (p.y - (p.vy * dt))]
				p2 = [p.x, p.y]
				let i = 0
				while (!equal(p1, p2)) {
					if(i++>100) break
					//debugger
					let deltapos = [(p2[0] - p1[0]), (p2[1] - p1[1])]
					let postocheck = [(p1[0] + (deltapos[0]/ 2)), (p1[1] + (deltapos[1]/ 2))]
					let [collided, distance, lot] = obstacle.checkifcollided(p.x, p.y, p.r, sizereference)
					if (collided == "true") {
						p2 = postocheck
					}else{
						p1 = postocheck
					}
				}

				truedistance = ((p.x - p1[0])**2 + (p.x - p1[0])**2)**0.5

				let temppos = p1

				//mirror axis:

				//anteil von v1 entlang des lots (normalachse) "wie viel vom lot"
				let skalarprodukt = (v1n[0] * lot[0]) + (v1n[1] * lot[1])
				let v1normal = [lot[0] * skalarprodukt, lot[1] * skalarprodukt]

				//anteil von v1 entlang der tangente "wie viel vom tangent"
				let v1tangent = [(v1n[0] - v1normal[0]), (v1n[1] - v1normal[1])]

				//mirror v1tangent
				let temp = v1normal
				v1normal = [(temp[0] * -1), (temp[1] * -1)]

				let vnewn = [v1tangent[0] + v1normal[0], [v1tangent[1] + v1normal[1]]]

				//assign new position to player
				let newpos = [(temppos[0] + (vnewn[0] * truedistance)), (temppos[1] + (vnewn[1] * truedistance))]
				p.x = newpos[0]
				p.y = newpos[1]
				let vnew = [(vnewn[0] * betrag), (vnewn[1] * betrag)]
				p.vx = vnew[0]
				p.vy = vnew[1]
				
			}
		}
	
		
	
	
	
		for (let p2 of players.slice(count)){
			distancex = p.x - p2.x
			distancey = p.y - p2.y
			distance = (distancex**2 + distancey**2)**0.5

			if (distance <= radius) {
				collidep(p, p2)
			}

		}
	}
}

function collidep(p1, p2) {
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


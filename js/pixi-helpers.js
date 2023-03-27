//preload Images first!!

function preloadImages(imgArray, callback) {
  if(!imgArray.length) return callback()
  var assetLoader = new PIXI.AssetLoader(imgArray);
  assetLoader.onComplete = callback;
  return assetLoader.load();
}

function World(params) {
  params = params || {};
  this.wPx = params.wPx || window.innerWidth;
  this.hPx = params.hPx || window.innerHeight;
  this.bgColor = params.bgColor || 0x000000;
  this.fontColor = params.fontColor || "ffffff";
  
  this.renderer = new PIXI.autoDetectRenderer(this.wPx, this.hPx);
  document.querySelector(".game").appendChild(this.renderer.view);  

  this.stage = new PIXI.Stage(this.bgColor);
  
  if(params.img) {
    var bgTexture = new PIXI.Texture.fromImage(params.img)
    var background = new PIXI.Sprite(bgTexture);
    var bgScale = Math.min(this.wPx/bgTexture.width, this.hPx/bgTexture.height) 
    background.scale.x = bgScale;
    background.scale.y = bgScale;
    this.wPx = bgTexture.width*bgScale;
    this.hPx = bgTexture.height*bgScale;
    this.renderer.resize (this.wPx, this.hPx)
    this.stage.addChild(background);
    this.renderer.render(this.stage);
  }
  
    
  if(params.pxPerUnit) {
    this.pxPerUnit = params.pxPerUnit;
    this.wUnits = this.wPx / this.pxPerUnit;
    this.hUnits = this.hPx / this.pxPerUnit;
  }
  else if (params.wUnits) {
    this.wUnits = params.wUnits;
    this.pxPerUnit = this.wPx / this.wUnits;
    this.hUnits = this.hPx / this.pxPerUnit;
  }
  else if (params.hUnits) {
    this.hUnits = params.hUnits;
    this.pxPerUnit = this.hPx / this.hUnits;
    this.wUnits = this.wPx / this.pxPerUnit;
  }
  else {
    this.pxPerUnit = 1;
    this.wUnits = this.wPx / this.pxPerUnit;
    this.hUnits = this.hPx / this.pxPerUnit;
  }
  
  this.unit = params.unit || "m";
  this.minUnits = params.minUnits || {x: -this.wUnits/2, y: -this.hUnits/2};
  this.maxUnits = params.maxUnits || {x: this.minUnits.x + this.wUnits, y: this.minUnits.y + this.hUnits};
  
  if(params.coords) {
    this.koordinatenachse(params.coords);
  }
  
  this.actors = [];

  return this;
}

World.prototype.render = function() {this.renderer.render(this.stage);};
World.prototype.add = function(obj) {this.actors.push(obj); this.stage.addChild(obj.sprite);};
World.prototype.xToPx = function(xUnit) {return (xUnit - this.minUnits.x) * this.pxPerUnit;}
World.prototype.yToPx = function(yUnit) {return this.hPx - (yUnit - this.minUnits.y) * this.pxPerUnit;}
World.prototype.unitsToPx = function(units) {return {x: this.xToPx(units.x), y: this.yToPx(units.y)};}
World.prototype.xToUnit = function(xPx) {return xPx / this.pxPerUnit + this.minUnits.x;}
World.prototype.yToUnit = function(yPx) {return (this.hPx - yPx) / this.pxPerUnit + this.minUnits.y;}
World.prototype.pxToUnits = function(px) {return {x: this.xToUnit(px.x), y: this.yToUnit(px.y)};}

// Koordinatenachse
World.prototype.koordinatenachse = function(params) {
  var params = params || {};
  var step = params.step || 100;
  var world = this;
//  var koordinatenachse = new PIXI.Graphics();
//  koordinatenachse.lineStyle(4, 0xFFFFFF, 1);
//  koordinatenachse.moveTo(0, maxHeight);
//  koordinatenachse.lineTo(0, 0);
//  stage.addChild(koordinatenachse);
  var createLabel = function(val, axis) {
    var number = axis=="x" ? world.xToPx(val) : world.yToPx(val)
    var skala = new PIXI.Text(val + " " + world.unit, {font: "bold 12px Tahoma" , fill: world.fontColor});
    skala.position.x = axis=="x" ? number : offset.x;
    skala.position.y = axis=="y" ? number : world.hPx - offset.y;
    skala.anchor.x = axis=="x" ? 0.5 : 0;
    skala.anchor.y = axis=="y" ? 0.5 : 1;
    world.stage.addChild(skala);
  };
  
  var offset = {x: 5, y: 2} //px von Rand;
  
  if(!params.onlyX) {
    for(var i = step * Math.ceil((world.minUnits.y + 0.1*step)/step); i < this.maxUnits.y - 0.1 * step; i += step) {createLabel(i, "y");}
  }
  if(!params.onlyY) {
    for(var i = step * Math.ceil((world.minUnits.x - 0.1*step)/step); i < this.maxUnits.x - 0.1 * step; i += step) {createLabel(i, "x");}
  }
  this.render();
};

World.prototype.update = function() {
  for(var i = 0; i < this.actors.length; i++) {
    this.actors[i].draw();
  }
  this.render();
}




/** function drawArrow()
 * 
 * @param {object} params from, x1, y1, to, x2, y2, color, thickness, alpha, headsize, pointiness
 * @returns {undefined}
 */
function drawArrow(params) {
  var params = params || {};
  params.from = params.from || {};
  params.to = params.to || {};
  var x1 = params.x1 || params.from.x || 0;
  var y1 = params.y1 || params.from.y || 0;
  var x2 = params.x2 || params.to.x || 0;
  var y2 = params.y2 || params.to.y || 0;
  var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  var angle = Math.atan2((y2-y1), (x2-x1));
  var color = params.color || "#900";
  var thickness = params.thickness || 3;
  var alpha = params.alpha || 1;
  var headsize = params.headsize || Math.min(10+10*thickness, length/3);
  var pointiness = params.pointiness || 0.2;

  var arrow = new PIXI.Graphics();
  
  arrow.lineStyle(thickness, color, alpha);
  arrow.moveTo(x1, y1);
  arrow.lineTo(x2 - 0.8*headsize*Math.cos(angle), y2 - 0.8*headsize*Math.sin(angle));
  arrow.lineStyle(color, 0, 0);
  arrow.beginFill(color, alpha);
  arrow.moveTo(x2, y2);
  arrow.lineTo(x2+headsize*Math.cos(angle+Math.PI+pointiness), y2+headsize*Math.sin(angle+Math.PI+pointiness));
  arrow.lineTo(x2+headsize*Math.cos(angle+Math.PI-pointiness), y2+headsize*Math.sin(angle+Math.PI-pointiness));
  arrow.lineTo(x2, y2);
  arrow.endFill();
  
  //stage.addChild(arrow);
  //renderer.render(stage);
  
  return arrow;
}

class Line {
  constructor(params) {
    var params = params || {};
    this.world = params.world || world;
    params.from = params.from || {};
    params.to = params.to || {};
    var x1 = this.world.xToPx(params.x1 || params.from.x || 0);
    var y1 = this.world.yToPx(params.y1 || params.from.y || 0);
    var x2 = this.world.xToPx(params.x2 || params.to.x || 0);
    var y2 = this.world.yToPx(params.y2 || params.to.y || 0);
    var color = params.color || 0x000099;
    var thickness = params.thickness || 3;
    var alpha = params.alpha || 1;

    this.graphicsline = new PIXI.Graphics();
    
    this.graphicsline.lineStyle(thickness, color, alpha);
    this.graphicsline.moveTo(x1, y1);
    this.graphicsline.lineTo(x2, y2);
    
    this.world.stage.addChild(this.graphicsline);
    this.world.renderer.render(world.stage);
  }
  destroy() {
    this.world.stage.removeChild(this.graphicsline);
  }
}

class Circle {
  constructor(params) {
    var params = params || {};
    this.world = params.world || world;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.color = params.color || 0xaa0000;
    this.alpha = params.alpha || 1;
    this.r = params.r || 1;
    this.graphic = new PIXI.Graphics();
    this.graphic.beginFill(this.color);
    this.graphic.drawCircle(0, 0, world.pxPerUnit * this.r);
    this.graphic.endFill();
    this.draw()
    this.world.actors.push(this)
    this.world.stage.addChild(this.graphic);
    this.world.renderer.render(world.stage);

  }

  


  destroy() {
    this.world.stage.removeChild(this.graphicscircle);
  }
  draw() {
    this.graphic.position = this.world.unitsToPx(this);
  }
}





class Rectangle {
  constructor(params) {
    var params = params || {};
    let sizereference = params.sizereference || 100
    this.world = params.world || world;
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.width = params.width || 100;
    this.height = params.height || 100;
    this.color = params.color || 0xaa0000;
    this.alpha = params.alpha || 1;
    this.r = params.r || 1;
    this.graphic = new PIXI.Graphics();
    this.graphic.beginFill(this.color);
    this.graphic.drawRect(0, 0, (this.width / 100 * sizereference), (this.height / 100 * sizereference));
    this.graphic.endFill();
    this.draw()
    this.world.actors.push(this)
    this.world.stage.addChild(this.graphic);
    this.world.renderer.render(world.stage);

  }

  
  destroy() {
    this.world.stage.removeChild(this.graphicscircle);
  }
  draw() {
    this.graphic.position = this.world.unitsToPx(this);
  }

  updateshape(sizereference) {
    this.graphic.clear()
    this.graphic.beginFill(this.color);
    this.graphic.drawRect(0, 0, (this.width / 100 * sizereference), (this.height / 100 * sizereference));
    this.graphic.endFill();
  }
}





class RoundedRectangle {
  constructor(params) {
    var params = params || {};
    let sizereference = params.sizereference || 100
    let drawoncreation = params.drawoncreation || "true"
    this.world = params.world || world;
    this.csyst = params.csyst || "absolut"
    this.x = params.x || 0;
    this.y = params.y || 0;
    this.xg = params.xg || 0;
    this.yg = params.yg || 0;
    this.width = params.width || 100;
    this.height = params.height || 100;
    this.radius = params.radius || 10
    this.color = params.color || 0xaa0000;
    this.alpha = params.alpha || 1;
    this.r = params.r || 1;
    this.graphic = new PIXI.Graphics();
    if (drawoncreation !== "false") {
      this.updateshape(sizereference)
    }
    this.draw()
    this.world.actors.push(this)
    this.world.stage.addChild(this.graphic);
    this.world.renderer.render(world.stage);

  }

  
  destroy() {
    this.world.stage.removeChild(this.graphicscircle);
  }
  draw() {

    if (this.csyst == "game"){
      let newx = (sizereference / 300 * this.xg) + (zeropos[0]) 
      let newy = (sizereference / 300 * this.yg) + (zeropos[1])
      this.x = newx
      this.y = newy
    }
    this.graphic.position = this.world.unitsToPx(this);
  }

  updateshape(sizereference) {

    //this has to be called in order to render

    this.graphic.clear()
    this.graphic.beginFill(this.color);

    let r = (this.radius / 100 * sizereference)
    let w = this.width / 100 * sizereference
    let h = this.height / 100 * sizereference

    this.graphic.drawRect(r, 0, (w - (2 * r)), h)
    this.graphic.drawRect(0, r, w, (h - (2 * r)))
    this.graphic.drawCircle(r, r, r)
    this.graphic.drawCircle((w - r), r, r)
    this.graphic.drawCircle((w - r), (h - r), r)
    this.graphic.drawCircle(r, (h - r), r)

    this.graphic.endFill();

    
  }

  checkifcollided(px,py, pr, sizereference){
    
    let collided = "false"

    let r = (this.radius / 100 * sizereference)
    let w = (this.width / 100 * sizereference)
    let h = (this.height / 100 * sizereference)
    let x = this.x
    let y = this.y

    let distr = 0
    let lot = [0,0]

    //console.log("spielerradius ist :"+pr)

    let diso = (py - pr) - (y - r)
    let disr = (px - pr) - (x + w)
    let disu = (y - h + r) - (py + pr)
    let disl = x - (px + pr)
    
    //console.log(diso)
    //console.log(disr)
    //console.log(disu)
    //console.log(disl)

    //solving for main area: 

    //x axis rect

    if (diso < 0 && disr < 0 && disu < 0 && disl < 0) {
      collided = "true"
      
      if (disr >= disu && disr >= disl && disr >= diso){
        distr = disr
        lot = [1, 0]
      }
      
      if (disl >= diso && disl >= disr && disl >= disu){
        distr = disl
        lot = [-1, 0]
      }
    }


 //y axis rect
    diso = (py - pr) - (y)
    disr = (px - pr) - (x + w - r)
    disu = (y - h) - (py + pr)
    disl = (x + r) - (px + pr)

    if (diso < 0 && disr < 0 && disu < 0 && disl < 0) {
      collided = "true"
      if (diso >= disr && diso >= disu && diso >= disl){
        distr = diso
        lot = [0, 1]
      }
      
      if (disu >= disl && disu >= diso && disu >= disr){
        distr = disu
        lot = [0, -1]
      }
    
    }



    //solving corner collisions:
    if (collided == "false"){
      let cornerpoints = [
        [x+r, y-r],
        [x+w-r, y-r],
        [x+w-r, y-h+r],
        [x+r, y-h+r]
      ]

      for (let c = 0; c < 4; c++) {
        let pos = cornerpoints[c]
        let dist = ((pos[0] - px)**2 + (pos[1] - py)**2)**0.5
        distr= dist - (r + pr)
        if (distr <= 0) {
          collided = "true"
          let dx = px - pos[0]
          let dy = py - pos[1]
          let betrag = ((dx**2 + dy**2)**0.5)
          lot = [(dx / betrag), (dy / betrag)]
        }
      }
    }
    
    return([collided, distr, lot])
  }
}


//spawnpoint
class spawnpoint {
  constructor(params) {
    var params = params || {};
    let sizereference = params.sizereference || 100
    let drawoncreation = params.drawoncreation || "true"
    this.world = params.world || world;
    this.x = params.x || 0;
    this.y = params.y || 0;
    
    this.width = params.width || 100;
    this.height = params.height || 100;
    this.radius = params.radius || 10
    this.color = params.color || 0xaa0000;
    this.alpha = params.alpha || 1;
    this.r = params.r || 1;
    this.graphic = new PIXI.Graphics();
    if (drawoncreation !== "false") {
      this.updateshape(sizereference)
    }
    this.draw()
    this.world.actors.push(this)
    this.world.stage.addChild(this.graphic);
    this.world.renderer.render(world.stage);

  }

  
  destroy() {
    this.world.stage.removeChild(this.graphicscircle);
  }
  draw() {
    this.graphic.position = this.world.unitsToPx(this);
  }

  updateshape(sizereference) {

    //this has to be called in order to render

    this.graphic.clear()
    this.graphic.beginFill(this.color);

    let r = (this.radius / 100 * sizereference)
    let w = this.width / 100 * sizereference
    let h = this.height / 100 * sizereference
    this.graphic.drawRect(r, 0, (w - (2 * r)), h)
    this.graphic.drawRect(0, r, w, (h - (2 * r)))
    this.graphic.drawCircle(r, r, r)
    this.graphic.drawCircle((w - r), r, r)
    this.graphic.drawCircle((w - r), (h - r), r)
    this.graphic.drawCircle(r, (h - r), r)

    this.graphic.endFill();
  }
}






function PassiveSprite(params) {
  var params = params || {};
  this.world = params.world || world;
  var texture = params.texture || new PIXI.Texture.fromImage(params.img);
	this.sprite = new PIXI.Sprite(texture);
  this.x = params.x || 0;
  this.y = params.y || 0;
  this.sprite.position = this.world.unitsToPx(this);
  this.sprite.rotation = params.rotation || 0;
  this.sprite.scale = params.scale || {x:1, y:1};
  if(params.wUnits) {
    this.sprite.scale.x = params.wUnits * this.world.pxPerUnit / texture.width;
    this.sprite.scale.y = this.sprite.scale.x;
  }
  if(params.hUnits) {
    this.sprite.scale.y = params.hUnits * this.world.pxPerUnit / texture.height;
    if(!params.wUnits) this.sprite.scale.x = this.sprite.scale.y; //Verzerren möglich, falls erwünscht
  }
  this.sprite.anchor = params.anchor || {x:0.5, y:0.5};
  this.sprite.alpha = params.alpha || 1;
  this.world.stage.addChildAt(this.sprite, params.background ? 0 : this.world.stage.children.length);
  this.world.render();
  return this;
}

function Actor(params) {
  var params = params || {};
  this.world = params.world || world;
  var texture = params.texture || new PIXI.Texture.fromImage(params.img);
	this.sprite = new PIXI.Sprite(texture);
  this.x = params.x || 0;
  this.y = params.y || 0;
  this.vx = params.vx || 0;
  this.vy = params.vy || 0;
  this.autorotate = params.autorotate; 
  
  this.sprite.position = this.world.unitsToPx(this);
  this.sprite.rotation = params.rotation || 0;
  this.sprite.scale = params.scale || {x:1, y:1};
  if(params.wUnits) {
    this.sprite.scale.x = params.wUnits * this.world.pxPerUnit / texture.width;
    this.sprite.scale.y = this.sprite.scale.x;
  }
  if(params.hUnits) {
    this.sprite.scale.y = params.hUnits * this.world.pxPerUnit / texture.width;
    if(!params.wUnits) this.sprite.scale.x = this.sprite.scale.y; //Verzerren möglich, falls erwünscht
  }
  this.sprite.anchor = params.anchor || {x:0.5, y:0.5};
  this.sprite.alpha = params.alpha || 1;
  this.world.add(this);
  this.world.render();
  return this;
}

Actor.prototype.draw = function() {
  this.sprite.position = this.world.unitsToPx(this);
  this.sprite.rotation = -this.rotation || 0;
  if(this.autorotate) {this.sprite.rotation = Math.atan2(-this.vy, this.vx);}
}

Actor.prototype.destroy = function() {
  this.world.actors.splice(this.world.actors.indexOf(this), 1);
  this.world.stage.removeChild(this.sprite);
}

PIXI.DisplayObjectContainer.prototype.removeAll = function()
{
  while(this.children&&this.children.length>0)
  {
    this.removeChild(this.children[0]);
  }
};

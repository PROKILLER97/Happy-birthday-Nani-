let w = (c.width = window.innerWidth),
h = (c.height = window.innerHeight),
ctx = c.getContext("2d"),
hw = w / 2,
hh = h / 2;

opts = {

strings: ["HAPPY","BIRTHDAY","प्यारी","नानी"],

charSize: 38,
charSpacing: 35,
lineHeight: 40,

cx: w / 2,
cy: h / 2,

/* FIREWORK SETTINGS */

fireworkPrevPoints: 1,   // THIS removes the small dots
fireworkBaseLineWidth: 5,
fireworkAddedLineWidth: 8,
fireworkSpawnTime: 200,
fireworkBaseReachTime: 30,
fireworkAddedReachTime: 30,

fireworkCircleBaseSize: 20,
fireworkCircleAddedSize: 10,
fireworkCircleBaseTime: 30,
fireworkCircleAddedTime: 30,
fireworkCircleFadeBaseTime: 10,
fireworkCircleFadeAddedTime: 5,

fireworkBaseShards: 0,
fireworkAddedShards: 0,

fireworkShardPrevPoints: 3,
fireworkShardBaseVel: 4,
fireworkShardAddedVel: 2,
fireworkShardBaseSize: 3,
fireworkShardAddedSize: 3,

gravity: 0.1,
upFlow: -0.1,

letterContemplatingWaitTime: 360,

/* BALLOONS */

balloonSpawnTime: 20,
balloonBaseInflateTime: 10,
balloonAddedInflateTime: 10,
balloonBaseSize: 20,
balloonAddedSize: 20,
balloonBaseVel: 0.4,
balloonAddedVel: 0.4,
balloonBaseRadian: -(Math.PI / 2 - 0.5),
balloonAddedRadian: -1
};

calc = {
totalWidth: opts.charSpacing *
Math.max(opts.strings[0].length, opts.strings[1].length)
};

Tau = Math.PI * 2;
TauQuarter = Tau / 4;

letters = [];

ctx.font = opts.charSize + "px Verdana";

function Letter(char,x,y){

this.char = char;
this.x = x;
this.y = y;

this.dx = -ctx.measureText(char).width / 2;
this.dy = opts.charSize / 2;

this.fireworkDy = this.y - hh;

var hue = (x / calc.totalWidth) * 360;

this.color = `hsl(${hue},80%,50%)`;
this.lightColor = `hsl(${hue},80%,70%)`;
this.alphaColor = `hsla(${hue},80%,50%,alp)`;

this.reset();

}

Letter.prototype.reset = function(){

this.phase = "firework";
this.tick = 0;
this.spawned = false;

this.spawningTime = (opts.fireworkSpawnTime*Math.random())|0;
this.reachTime = (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime*Math.random())|0;

this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth*Math.random();

this.prevPoints = [[0,hh,0]];

}

Letter.prototype.step = function(){

if(this.phase === "firework"){

if(!this.spawned){

++this.tick;

if(this.tick >= this.spawningTime){
this.tick = 0;
this.spawned = true;
}

}else{

++this.tick;

var linear = this.tick / this.reachTime;
var armonic = Math.sin(linear * TauQuarter);

var x = linear * this.x;
var y = hh + armonic * this.fireworkDy;

if(this.prevPoints.length > opts.fireworkPrevPoints)
this.prevPoints.shift();

this.prevPoints.push([x,y,linear*this.lineWidth]);

for(var i=1;i<this.prevPoints.length;i++){

var point = this.prevPoints[i];
var point2 = this.prevPoints[i-1];

ctx.strokeStyle = this.alphaColor.replace("alp",i/this.prevPoints.length);
ctx.lineWidth = point[2];

ctx.beginPath();
ctx.moveTo(point[0],point[1]);
ctx.lineTo(point2[0],point2[1]);
ctx.stroke();

}

if(this.tick >= this.reachTime){

this.phase = "contemplate";
this.tick = 0;

}

}

}

else if(this.phase === "contemplate"){

ctx.fillStyle = this.lightColor;
ctx.fillText(this.char,this.x+this.dx,this.y+this.dy);

++this.tick;

if(this.tick > opts.letterContemplatingWaitTime){

this.phase = "balloon";
this.tick = 0;

this.cx = this.x;
this.cy = this.y;

var rad = opts.balloonBaseRadian + opts.balloonAddedRadian*Math.random();
var vel = opts.balloonBaseVel + opts.balloonAddedVel*Math.random();

this.vx = Math.cos(rad)*vel;
this.vy = Math.sin(rad)*vel;

this.size = opts.balloonBaseSize + opts.balloonAddedSize*Math.random();

}

}

else if(this.phase === "balloon"){

this.cx += this.vx;
this.cy += this.vy += opts.upFlow;

ctx.fillStyle = this.color;

ctx.beginPath();
ctx.arc(this.cx,this.cy,this.size,0,Tau);
ctx.fill();

ctx.beginPath();
ctx.moveTo(this.cx,this.cy);
ctx.lineTo(this.cx,this.cy+this.size);
ctx.stroke();

ctx.fillStyle = this.lightColor;
ctx.fillText(this.char,this.cx+this.dx,this.cy+this.dy+this.size);

if(this.cy + this.size < -hh) this.phase="done";

}

}

function anim(){

requestAnimationFrame(anim);

ctx.fillStyle = "#111";
ctx.fillRect(0,0,w,h);

ctx.translate(hw,hh);

var done = true;

for(var l=0;l<letters.length;l++){

letters[l].step();

if(letters[l].phase !== "done")
done = false;

}

ctx.translate(-hw,-hh);

if(done){
for(var l=0;l<letters.length;l++){
letters[l].reset();
}
}

}

for(let i=0;i<opts.strings.length;i++){

for(let j=0;j<opts.strings[i].length;j++){

letters.push(
new Letter(
opts.strings[i][j],
j*opts.charSpacing + opts.charSpacing/2 - opts.strings[i].length*opts.charSpacing/2,
i*opts.lineHeight + opts.lineHeight/2 - opts.strings.length*opts.lineHeight/2
)
);

}

}

anim();

window.addEventListener("resize",function(){

w = c.width = window.innerWidth;
h = c.height = window.innerHeight;

hw = w/2;
hh = h/2;

ctx.font = opts.charSize+"px Verdana";

});

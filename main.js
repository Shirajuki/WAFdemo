// https://github.com/surikov/webaudiofont
// https://tonejs.github.io/Midi/
class gameState {
  init() {
    //// CONFIG
    this.started = false;
    // GUI
    this.canvasGUI = document.getElementById("canvasGUI");
    this.ctxGUI = this.canvasGUI.getContext("2d");
    this.ctxGUI.webkitImageSmoothingEnabled = false;
    this.ctxGUI.imageSmoothingEnabled = false;
    // MAIN
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    // FX
    this.canvasFX = document.getElementById("canvasFX");
    this.ctxFX = this.canvasFX.getContext("2d");
    this.ctxFX.webkitImageSmoothingEnabled = false;
    this.ctxFX.imageSmoothingEnabled = false;
    // BG
    this.canvasBG = document.getElementById("canvasBG");
    this.ctxBG = this.canvasBG.getContext("2d");
    this.ctxBG.webkitImageSmoothingEnabled = false;
    this.ctxBG.imageSmoothingEnabled = false;
    this.bg1X = 0;
    this.bg2X = 638;
    this.bgScrollSpeed = 3;
    //// CONTROLS
    this.controls = {
      "up": false,
      "down": false,
      "special": false,
    };
    this.map = [...Array(29).keys()].map(x => x*10 + 50);
    this.noteArr = [66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90].reverse();
    // (16) [66, 67, 69, 71, 72, 73, 74, 76, 78, 79, 81, 83, 85, 86, 88, 90]
    //// PLAYER
    this.player = {
      "x": -35,
      "y": 100,
      "loc": 14,
      "width": 50,
      "height": 50,
      "frameMax": 3,
      "frame": 0,
      "frameTime": 0,
      "frameTimeMax": 12,
    };
    //// NOTES
    this.notes = [];
    //// Footstep
    this.footsteps = [];
    //// GUI
    this.numbers = [0,59,125,190,254,319,384,449,514,579];
    this.score = 0;
    this.score1 = 0, this.score10 = 0, this.score100 = 0;
  }
  updateScore() {
    this.score100 = Math.floor(this.score/100);
    this.score10 = Math.floor(this.score/10).toString().split("").reverse()[0];
    this.score1 = Math.floor(this.score/1).toString().split("").reverse()[0];
  }
  backgroundLoop() {
    if (this.screenShake) {
      this.ctxBG.save();
      this.ctxBG.translate(Math.random()*5, Math.random()*5);
    }
    this.bg1X -= this.bgScrollSpeed;
    this.bg2X -= this.bgScrollSpeed;
    if (this.bg1X <= -638) this.bg1X = 638;
    if (this.bg2X <= -638) this.bg2X = 638;
    // console.log(this.bg1X,this.bg2X)
    this.ctxBG.beginPath();
    this.ctxBG.clearRect(0,0,this.canvasBG.width,this.canvasBG.height);
    this.ctxBG.drawImage(bg,0,0,this.canvasBG.width,this.canvasBG.height,this.bg1X,0,this.canvasBG.width,this.canvasBG.height);
    this.ctxBG.drawImage(bg,0,0,this.canvasBG.width,this.canvasBG.height,this.bg2X,0,this.canvasBG.width,this.canvasBG.height);
    if (this.screenShake) {
      this.ctxBG.restore();
    }
  }
  playerIntro() {
    this.player.x += 5;
  }
  drawGUI() {
    this.ctxGUI.clearRect(0,0,this.canvasGUI.width,this.canvasGUI.height);
    this.ctxGUI.beginPath();
    if (!this.started) {
      this.ctxGUI.drawImage(font, 0, 0, 510, 55, this.canvas.width/2 - 100, this.canvas.height/2, 200, 24); // START
    } else {
      this.ctxGUI.drawImage(note, 32, 32, 32, 32, 10, 10, 25, 25); // NOTE
      this.ctxGUI.drawImage(font, 0, 112, 50, 55, 35, 17, 15, 15); // x
      this.ctxGUI.drawImage(font, this.numbers[this.score100], 55, 50, 55, 55, 10, 25, 25); // 0
      this.ctxGUI.drawImage(font, this.numbers[this.score10], 55, 50, 55, 80, 10, 25, 25); // 0
      this.ctxGUI.drawImage(font, this.numbers[this.score1], 55, 50, 55, 105, 10, 25, 25); // 0
    }
    // this.ctx.drawImage(font, 0, 0, 510, 50, this.canvas.width/2 - 100, this.canvas.height/2, 200, 24); // TIME
    // this.ctx.drawImage(font, 0, 112, 50, 55, 35, 17, 15, 15); // x
    // this.ctx.drawImage(font, 0, 0, 510, 50, this.canvas.width/2 - 100, this.canvas.height/2, 200, 24); // 0
    // this.ctx.drawImage(font, 0, 0, 510, 50, this.canvas.width/2 - 100, this.canvas.height/2, 200, 24); // 0
    // this.ctx.drawImage(font, 0, 0, 510, 50, this.canvas.width/2 - 100, this.canvas.height/2, 200, 24); // 0
  }
  draw() {
    if (this.player.frameTime == this.player.frameTimeMax) { this.player.frame++; this.player.frameTime = 0; spawnFootstep(); if (this.player.frame == this.player.frameMax) { this.player.frame = 0; } }
    else { this.player.frameTime++; }
    // console.log(this.player.frame)
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.beginPath();
    this.player.y = this.map[this.player.loc];
    // this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height); // og
    // this.ctx.fillRect(this.player.x, this.player.y, this.*player.width, this.player.height); // copy
    this.ctx.drawImage(img, 48*this.player.frame, 0, 48, 48, this.player.x, this.player.y, this.player.width, this.player.height);
  }
  collide(object1, object2) {
    return (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
		object1.y < object2.y + object2.height && object1.y + object1.height > object2.y)
  }
}
class Objected {
  constructor(x,y,dx,img=undefined) {
    this.y = y;
    this.x = x;
    this.dx = dx;
    this.width = 32;
    this.height = 32;
    this.img = img;

    this.frameMax = 3;
    this.frame = 0;
    this.frameTime = 0;
    this.frameTimeMax = 6;
    this.rndY = randint(0,3);
  }
  draw() {
    game.ctx.beginPath();
    if (this.img == undefined) {
      game.ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      if (this.img == "footstep") game.ctx.drawImage(img, 48*3, 0, 48, 48, this.x, this.y+20, this.width, this.height);
      if (this.img == "note") {
        if (this.frameTime == this.frameTimeMax) { this.frame++; this.frameTime = 0; if (this.frame == this.frameMax) { this.frame = 0; } }
        else { this.frameTime++; }
        game.ctx.drawImage(note, 32*this.frame, 32*this.rndY, 32, 32, this.x, this.y, this.width, this.height);
      }
    }
  }
  move() {
    this.x -= this.dx;
  }
}
class Note extends Objected {
  constructor(x,y,dx,img,pitch,duration) {
    super(x,y,dx,img,pitch)
    this.pitch = pitch;
    this.duration = duration;
  }
}
const game = new gameState();
game.init();
//// EVENT
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let isMobile = false;
if (/AppleWebKit.*Mobile/i.test(navigator.userAgent) || /Android|iPhone|Windows Phone|webOS|iPod|BlackBerry/i.test(navigator.userAgent)) {
  isMobile = true;
  console.log = function() {};
};

function keyDownHandler(e) {
  // console.log(e.keyCode)
  if(e.keyCode == 38) {
    game.controls.up = true;
  }
  else if(e.keyCode == 40) {
    game.controls.down = true;
  }
  else if(e.keyCode == 90) {
    game.controls.special = true;
  }
  else if(e.keyCode == 32) {
    console.log("SPAWN NOTE!");
    // spawnNote(game.canvas.width, game.map[randint(0,29)]);
  }
}
function keyUpHandler(e) {
  if(e.keyCode == 38) {
    game.controls.up = false;
  }
  else if(e.keyCode == 40) {
    game.controls.down = false;
  }
  else if(e.keyCode == 90) {
    game.controls.special = false;
  }
}
function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function spawnNote(x,y,pitch,duration) {
  game.notes.push(new Note(x,y,5,"note",pitch,duration));
}
function spawnFootstep(x,y) {
  game.footsteps.push(new Objected(game.player.x,game.player.y,3,"footstep"));
}
let trigger = 0;
let autoplay = false;
let index = 0;
function gameLoop() {
  game.draw();
  game.drawGUI();
  game.backgroundLoop();
  if (game.player.x < 200) game.playerIntro();

  // MUSIC
  if (autoplay && millis() > trigger){
    // playNote(music.tracks[0].notes[index].midi, music.tracks[0].notes[index].duration);
    // player.queueWaveTable(audioContext, audioContext.destination, _tone_0090_JCLive_sf2_file, 0, music.tracks[0].notes[index].midi, music.tracks[0].notes[index].duration);
    spawnNote(game.canvas.width, game.map[game.noteArr.indexOf(music.tracks[0].notes[index].midi)],music.tracks[0].notes[index].midi, music.tracks[0].notes[index].duration);
    trigger = millis() + music.tracks[0].notes[index].duration*900;
    progress.value = index;
    index++;
  } else if (index >= music.tracks[0].notes.length) {
    autoplay = false;
    index = 0;
  }

  // NOTES
  for (let i = game.notes.length-1; i >= 0; i--) {
    const note = game.notes[i];
    note.draw();
    note.move();
    if (game.collide(note, game.player) || note.x < -50) {
      game.notes.splice(i,1);
      if (game.collide(note, game.player)) {
        player.queueWaveTable(audioContext, audioContext.destination, _tone_0090_JCLive_sf2_file, 0, note.pitch, note.duration);
        game.score++;
        game.updateScore();
      }
    }
  }

  // FOOTSTEPS
  for (let i = game.footsteps.length-1; i >= 0; i--) {
    const footstep = game.footsteps[i];
    footstep.draw();
    footstep.move();
    if (footstep.x < -50) game.footsteps.splice(i,1);
  }
  if (game.controls.up && game.player.loc !== 0) game.player.loc -= 1;
  if (game.controls.down && game.player.loc !== 28) game.player.loc += 1;
  requestAnimationFrame(gameLoop);
}


//// LOADS
let gameLoaded = false;
let loadedImg = 0;
//// IMAGES
// BG
const bg = new Image();
bg.src = 'dungeon.png';
bg.onload = () => {
  loadedImg++;
  checkLoaded();
};
// Player Sprite
const img = new Image();
img.src = 'sprite.png';
img.onload = () => {
  loadedImg++;
  checkLoaded();
};
// note
const note = new Image();
note.src = 'note.png';
note.onload = () => {
  loadedImg++;
  checkLoaded();
};
// font
const font = new Image();
font.src = 'font.png';
font.onload = () => {
  loadedImg++;
  checkLoaded();
};

function checkLoaded() {
  if (loadedImg == 4) {
    gameLoop();
    console.log("Start game");
    gameLoaded = true;
  }
}

const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContextFunc();
const player = new WebAudioFontPlayer();
player.loader.decodeAfterLoading(audioContext, '_tone_0090_JCLive_sf2_file');
function millis() {
  return new Date().getTime();
}
canvasGUI.addEventListener('click', function() {
  // setTimeout(_=> badboy.play(), 3550);
  game.started = true;
  game.canvasGUI.style.animation = "None";
  progress.max = music.tracks[0].notes.length;
  autoplay = true;
});
const buttons = document.getElementsByClassName('btn');
buttons[0].addEventListener('touchstart', function() { game.controls.up = true; this.style.backgroundColor = "rgba(0,0,0,.7)"; });
buttons[0].addEventListener('touchend', function() { game.controls.up = false; this.style.backgroundColor = "rgba(0,0,0,.4)"; });
buttons[1].addEventListener('touchstart', function() { game.controls.down = true; this.style.backgroundColor = "rgba(0,0,0,.7)"; });
buttons[1].addEventListener('touchend', function() { game.controls.down = false; this.style.backgroundColor = "rgba(0,0,0,.4)"; });

const progress = document.getElementById('progress');

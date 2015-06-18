$(document).ready(function() {
  var icon = $('.play');
  icon.click(function() {
     icon.toggleClass('active');
     return false;
  });
});


// Instantiate Global Variables
var SoundArray = [];
var SongLen = 1000;
var kit     = 'A';
var record  = false;
var play    = false;
var startTime = 0;
var hours   = 0;
var mins    = 0;
var seconds = 0;
var millis  = 0;


function Playback(sArray) {
  if (play) {
	  play = false;
	  return;
  }
  else if (!record){
    startTime = Date.now();
    //startTimer();
  }
  play = true;

  function playItBack(idx){
    setTimeout(function(){
        var item = sArray[idx];
        if (!play){
	        return;
        }
        if (idx >= sArray.length) { 
	        var x = SongLen - (Date.now()-startTime);
	        console.log(x);
	        setTimeout(function(){
		        if (!record) {
		        	startTime = Date.now();
					playItBack(0);
				}
	        }, x);
	        return; 
	    }

        while(Date.now() - startTime < item.time){
          playItBack(idx);
          return;
        }

        //console.log(item);
        playSound(item.key);
        playItBack(idx+1);
    }, 5);
  }
  playItBack(0);
}

// Button Click Functions
$('#start').click(function(){
	if (record || play) return;
	hours   = 0;
	mins    = 0;
	seconds = 0;
	$('#mins').html('00:');
	$('#seconds').html('00.');
	$('#millis').html('00');
	record  = true;
	startTime = Date.now();
	Playback(SoundArray);
	startTimer();
});

$('#stop').click(function(){
	if (record){ // If record? If first record?
		var trialLen = Date.now() - startTime;
		if (SongLen < trialLen) SongLen =  trialLen;
		record = false;
		SoundArray.sort(compare);
	}
	play = false;
	clearTimeout(timex);
});

$('#reset').click(function(){
	if (record || play) { return; }
	clearTimeout(timex);
	record  = false;
	startTime = 0;
	hours   = 0;
	mins    = 0;
	seconds = 0;
	
	$('#mins').html('00:');
	$('#seconds').html('00:');
	$('#millis').html('00');
	
	SoundArray.length = 0;
	SongLen = 1000;
	clearCanvas();
});

function compare(a,b) {
  if (a.time < b.time)
    return -1;
  if (a.time > b.time)
    return 1;
  return 0;
}

function saveToParse(SoundArray) {
  if (record) return;
  var ArrayObject = Parse.Object.extend("Sounds");
  var arrayObject = new ArrayObject();
  arrayObject.addUnique("SoundAndTime", SoundArray);
  arrayObject.save();
}

// The Time Counter
function startTimer(){
  timex = setTimeout(function(){
    millis++;
    if(millis > 99){
      seconds++;
      millis=0;
      if(seconds >59){
        seconds=0;
        mins++;
        if(mins>59) {
          mins=0;
        }                   
        if(mins<10){                     
          $("#mins").text('0'+mins+':');
        }       
        else 
          $("#mins").text(mins+':');
      }    
      if(seconds <10) {
        $("#seconds").text('0'+seconds + ':');} 
      else {
        $("#seconds").text(seconds + ':');
      }
    }
    if(millis <10) {
      $("#millis").text('0'+millis);} 
    else {
      $("#millis").text(millis);
    }
    startTimer();
  },10);
}

// Catch all keyboard presses
$(window).keydown(function(e) {
  key = (e.keyCode) ? e.keyCode : e.which;
  $('.key.k' + key).addClass('active');
  playSound(e.keyCode);
  if (record){
    var elapsed = Date.now() - startTime;
    if (key in SOUNDS){
	    SoundArray.push({key:key, time:elapsed, kit:kit});
    }
  }
});

$(window).keyup(function(e) {
  key = (e.keyCode) ? e.keyCode : e.which;
  $('.key.k' + key).removeClass('active');
});

// Play sounds on button press
var SOUNDS = {
  'q':"A/bubbles.mp3",
  'w':"A/clay.mp3", 
  'e':"A/confetti.mp3", 
  'r':"A/corona.mp3", 
  't':"A/dotted-spiral.mp3", 
  'y':"A/flash-1.mp3", 
  'u':"A/flash-2.mp3", 
  'i':"A/flash-3.mp3", 
  'o':"A/glimmer.mp3", 
  'p':"A/moon.mp3",
  'a':"A/pinwheel.mp3",
  's':"A/piston-1.mp3",
  'd':"A/piston-2.mp3",
  'f':"A/piston-3.mp3",
  'g':"A/prism-1.mp3",
  'h':"A/prism-2.mp3",
  'j':"A/prism-3.mp3",
  'k':"A/splits.mp3",
  'l':"A/squiggle.mp3",
  'z':"A/strike.mp3",
  'x':"A/suspension.mp3",
  'c':"A/timer.mp3",
  'v':"A/ufo.mp3",
  'b':"A/veil.mp3",
  'n':"A/wipe.mp3",
  'm':"A/zig-zag.mp3",
  ' ':""
 };

function playSound(sound){
  if (typeof(sound)=="number"){
    key = String.fromCharCode(sound).toLowerCase();
  } 
  else {
    key = sound;
  }
  new Audio(SOUNDS[key]).play();
}

// Handle the canvas
var W = 800;
var H = 150;
var canvas = document.getElementById("canvas"),
       ctx = canvas.getContext("2d");

// Applying these to the canvas element
canvas.height = H; 
canvas.width  = W;

var playBar = {
	color:'red',
	getX : function(){
		var elapsed = 0;
		if (record || play) {
			elapsed = (Date.now() - startTime);
			if (elapsed > SongLen) {
				SongLen = elapsed;
				elapsed -= 2;
			}
		}
		return elapsed/(SongLen*1.0) * canvas.width;
	},
	draw: function(){
		ctx.beginPath();
		ctx.moveTo(this.getX(),0);
		ctx.lineTo(this.getX(), canvas.height);
		ctx.lineWidth = 4;
		ctx.strokeStyle=this.color;
		ctx.stroke();
	}	
};

var mySong = {
	beats: SoundArray,
	color: 'green',
	radius: 10,
	getX : function(beat){
		return beat.time/(SongLen*1.0) * canvas.width;
	},
	getY : function(){
		return canvas.height/2;
	},
	playing: function(beat){
		return (playBar.getX() > this.getX(beat)-this.radius && playBar.getX() < this.getX(beat)+this.radius);
	},
	drawBeat: function(beat) {
		var xVal = this.getX(beat);
		var yVal = this.getY();
		var playing = this.playing(beat);
		var rad  = playing ? this.radius+3 : this.radius;
		var col  = playing ? 'yellow' : this.color;
		ctx.beginPath();
		ctx.arc(xVal, yVal, rad, 0, Math.PI*2, false);
		ctx.fillStyle = col;
		ctx.fill();
		ctx.closePath();
	},
	draw: function(){
		for (var i=0; i < this.beats.length; i++){
			this.drawBeat(this.beats[i]);
		}
	}
};

function clearCanvas() {
	ctx.clearRect(0, 0, W, H);
}

function update() {
	clearCanvas();
	mySong.draw();
	playBar.draw();
}

setInterval(update, 1000/60);

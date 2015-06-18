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
	if (record) return;
	hours   = 0;
	mins    = 0;
	seconds = 0;
	$('#hours','#mins').html('00:');
	$('#seconds').html('00:');
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
	
	$('#hours','#mins').html('00:');
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
          hours++;
          if(hours <10) {
            $("#hours").text('0'+hours+':')
          } 
          else 
            $("#hours").text(hours+':');
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
  'q':"sounds/kick.wav",
  'w':"sounds/snare.wav", 
  'e':"sounds/clap.wav", 
  'r':"sounds/kick2.wav", 
  't':"sounds/snare2.wav", 
  'y':"sounds/closedhat.wav", 
  'u':"sounds/snap.wav", 
  'i':"sounds/clapsnare.wav", 
  'o':"sounds/openhat.wav", 
  'p':"sounds/",
  'a':"sounds/c-chord.mp3",
  's':"sounds/d-chord.mp3",
  'd':"sounds/organ_hi.mp3",
  'f':"sounds/organ_low.mp3",
  'g':"sounds/softmaj.mp3",
  'h':"sounds/softmin.mp3",
  'j':"sounds/chord3.wav",
  'k':"sounds/chord4.wav",
  'l':"sounds/oc4.wav",
  'z':"sounds/oc8.wav",
  'x':"sounds/",
  'c':"sounds/",
  'v':"sounds/",
  'b':"sounds/",
  'n':"sounds/",
  'm':"sounds/",
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

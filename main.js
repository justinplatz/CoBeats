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
var lib = "A";


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
    SoundArray.sort(compare);
		var trialLen = Date.now() - startTime;
		if (SongLen < trialLen) {
      SongLen =  trialLen;
      //if (SoundArray.length > 0 && SoundArray[SoundArray.length-1]){}
    }
		record = false;

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

  if(key >= 48 && key <=57){
    switch(key - 48){
      // case 0:
      //   lib = "Z";
      //   break;  
      case 1:
        lib = "A";
        $("html").css("background-color","#222");
        break;
      case 2:
        lib = "B";
        $("html").css("background-color","#BE90D4");
        break;
      case 3:
        lib = "C";
        $("html").css("background-color","#6BB9F0");
        break;
      case 4:
        lib = "D";
        $("html").css("background-color","#86E2D5");
        break;
      case 5:
        lib = "E";
        $("html").css("background-color","#DCC6E0");
        break;
      case 6:
        lib = "F";
        $("html").css("background-color","#ECF0F1");
        break;
    }
    console.log("lib is set to " + lib);
  }
  else if(key >= 65 && key <= 90){
      playSound(e.keyCode);
      if (record){
        var elapsed = Date.now() - startTime;
        if (key in SOUNDS){
          SoundArray.push({key:key, time:elapsed, kit:kit});
        }
      }
      $(".active").css("color",getRandomColor());
  }
  else if (key == 32) {
    if (record || play){
        if (record){ // If record? If first record?
          SoundArray.sort(compare);
          var trialLen = Date.now() - startTime;
          if (SongLen < trialLen) {
            SongLen =  trialLen;
            //if (SoundArray.length > 0 && SoundArray[SoundArray.length-1]){}
          }
          record = false;
        }
      play = false;
      clearTimeout(timex);
    }
    else{
      hours   = 0;
      mins    = 0;
      seconds = 0;
      $('#mins').html('00:');
      $('#seconds').html('00.');
      $('#millis').html('00');
      record  = true;1
      startTime = Date.now();
      Playback(SoundArray);
      startTimer();
    }
  }
  else
    console.log("Invalid key");

 
});

$(window).keyup(function(e) {
  key = (e.keyCode) ? e.keyCode : e.which;
  $('.key.k' + key).removeClass('active');
});

// Play sounds on button press
var SOUNDS = {
  'q':"/bubbles.mp3",
  'w':"/clay.mp3", 
  'e':"/confetti.mp3", 
  'r':"/corona.mp3", 
  't':"/dotted-spiral.mp3", 
  'y':"/flash-1.mp3", 
  'u':"/flash-2.mp3", 
  'i':"/flash-3.mp3", 
  'o':"/glimmer.mp3", 
  'p':"/moon.mp3",
  'a':"/pinwheel.mp3",
  's':"/piston-1.mp3",
  'd':"/piston-2.mp3",
  'f':"/piston-3.mp3",
  'g':"/prism-1.mp3",
  'h':"/prism-2.mp3",
  'j':"/prism-3.mp3",
  'k':"/splits.mp3",
  'l':"/squiggle.mp3",
  'z':"/strike.mp3",
  'x':"/suspension.mp3",
  'c':"/timer.mp3",
  'v':"/ufo.mp3",
  'b':"/veil.mp3",
  'n':"/wipe.mp3",
  'm':"/zig-zag.mp3",
  ' ':""
 };

function playSound(sound){
  if (typeof(sound)=="number"){
    key = String.fromCharCode(sound).toLowerCase();
  } 
  else {
    key = sound;
  }
  new Audio(lib + SOUNDS[key]).play();
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


function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



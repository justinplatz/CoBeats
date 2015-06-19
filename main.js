$(document).ready(function() {
  var icon = $('.play');
  icon.click(function() {
     icon.toggleClass('active');
     return false;
  });
});

// Instantiate Global Variables
var SoundArray = [];
var SongArray = [];
var SongMap = {};
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
var UUID = "";

function Playback() {
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
        var item = SongArray[idx];
        if (!play){
	        return;
        }
        if (idx >= SongArray.length) { 
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
        playSound(item.kit, item.key);
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
	Playback();
	startTimer();
});

$('#stop').click(function(){
	if (record){ // If record? If first record?
    	SoundArray.sort(compare);
    	makeSongArray();
		SongLen = SongArray.length ? SongArray[SongArray.length-1].time+100 : Date.now() - startTime;
    	publishCoBeat('stop', SongLen);
    	publishCoBeat('riff', SongArray);
		record = false;

	}
	play = false;
	stopClock();
	makeSongArray();
});

$('#reset').click(function(){
	if (record || play) { return; }
	stopClock();
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
	publishCoBeat('stop', SongLen);
	publishCoBeat('riff', SoundArray);
	clearCanvas();
});

function stopClock(){
	if (typeof timex !== "undefined"){
		clearTimeout(timex);
	}
}

function makeSongArray(){
	var song = [];
	for(var i=0; i<SoundArray.length; i++){
		song.push(SoundArray[i]);
	}
	for(var key in SongMap){
		var beats = SongMap[key];
		for (var i=0; i<beats.length; i++){
			song.push(beats[i]);
		}	
	}
	song.sort(compare);
	SongArray = song;
}

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

var themes = {
  A:
  {
    background: "#222", 
    seeker: "", 
    dots: ""
  },
  B:
  {
    background: "#BE90D4", 
    seeker: "", 
    dots: ""
  },
  C:
  {
    background: "#6BB9F0", 
    seeker: "", 
    dots: ""
  },
  D:
  {
    background: "#86E2D5", 
    seeker: "", 
    dots: ""
  },
  E:
  {
    background: "#DCC6E0", 
    seeker: "", 
    dots: ""
  },
  F:
  {
    background: "#ECF0F1", 
    seeker: "", 
    dots: ""
  }

}; 

function swap(one, two) {
    document.getElementById(one).style.display = 'block';
    document.getElementById(two).style.display = 'none';
}

// Catch all keyboard presses
$(window).keydown(function(e) {
  key = (e.keyCode) ? e.keyCode : e.which;
  $('.key.k' + key).addClass('active');

  if(key >= 48 && key <=57){ //1-9
    switch(key - 48){
      // case 0:
      //   lib = "Z";
      //   break;  
      case 1:
        lib = "A";
        $("html").css("background-color",themes.A.background);
            swap("hex", "ring");
            swap("hex", "twist");
            swap("hex", "spin");
        break;
      case 2:
        lib = "B";
        $("html").css("background-color",themes.B.background);
            swap("ring", "hex");
            swap("ring", "twist");
            swap("ring", "spin");
        break;
      case 3:
        lib = "C";
        $("html").css("background-color",themes.C.background);
            swap("twist", "ring");
            swap("twist", "hex");
            swap("twist", "spin");

        break;
      case 4:
        lib = "D";
        $("html").css("background-color",themes.D.background);
            swap("spin", "ring");
            swap("spin", "hex");
            swap("spin", "twist");
        break;
      case 5:
        lib = "E";
        $("html").css("background-color",themes.E.background);
            swap("spin", "ring");
            swap("spin", "hex");
            swap("spin", "twist");
        break;
      case 6:
        lib = "F";
        $("html").css("background-color",themes.F.background);
            swap("hex", "ring");
            swap("hex", "twist");
            swap("hex", "spin");
        break;
    }
    console.log("lib is set to " + lib);
  }
  else if(key >= 65 && key <= 90){
      playSound(lib, e.keyCode);
      if (record){
        var elapsed = Date.now() - startTime;
        if (key in SOUNDS){
	    	var beat = {key:key, time:elapsed, kit:lib};
			SoundArray.push(beat);
			publishCoBeat('beat', beat);
        }
      }
      $(".active").css("color",getRandomColor());
  }
  else if (key == 16){ // Shift Bar
    if (record || play){
        if (record){ // If record? If first record?
          SoundArray.sort(compare);
          makeSongArray();
		  SongLen = SongArray.length ? SongArray[SongArray.length-1].time+100 : Date.now() - startTime;
          publishCoBeat('stop', SongLen);
          publishCoBeat('riff', SongArray);
          record = false;
        }
      play = false;
      stopClock();
      return;
    }
    else{
      hours   = 0;
      mins    = 0;
      seconds = 0;
      $('#mins').html('00:');
      $('#seconds').html('00.');
      $('#millis').html('00');
      record  = true;
      startTime = Date.now();
      Playback();
      startTimer();
    }
  }
  else if (key == 32) { // Space Bar
	e.preventDefault();  
	Playback();
	return;
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
  'q':"/flash-1.mp3",
  'w':"/clay.mp3", 
  'e':"/moon.mp3", 
  'r':"/piston-1.mp3", 
  't':"/timer.mp3", 
  'y':"/suspension.mp3", 
  'u':"/prism-1.mp3", 
  'i':"/squiggle.mp3", 
  'o':"/glimmer.mp3", 
  'p':"/dotted-spiral.mp3" ,
  'a':"/flash-2.mp3",
  's':"/veil.mp3",
  'd': "/ufo.mp3",
  'f':"/piston-2.mp3",
  'g':"/bubbles.mp3",
  'h':"/strike.mp3",
  'j':"/prism-2.mp3"  ,
  'k':"/pinwheel.mp3",
  'l':"/zig-zag.mp3",
  'z':"/flash-3.mp3",
  'x':"/wipe.mp3",
  'c':"/splits.mp3" ,
  'v':"/piston-3.mp3",
  'b':"/corona.mp3",
  'n':"/confetti.mp3",
  'm':"/prism-3.mp3",
  ' ':""
 };

function playSound(kit, sound){
  if (typeof(sound)=="number"){
    key = String.fromCharCode(sound).toLowerCase();
  } 
  else {
    key = sound;
  }
  new Audio(kit + SOUNDS[key]).play();
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
	color:'#F64747',
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
	beats: 1,
	colors: ['#66CC99','#F00','#0F0','#00F'],
	radius: 10,
	getX : function(beat){
		return beat.time/SongLen * canvas.width;
	},
	getY : function(pos){
		return canvas.height/(this.beats+1) * (pos+1);
	},
	playing: function(beat){
		return (playBar.getX() > this.getX(beat)-this.radius && playBar.getX() < this.getX(beat)+this.radius);
	},
	drawBeat: function(beat, pos) {
		var xVal = this.getX(beat);
		var yVal = this.getY(pos);
		var playing = this.playing(beat);
		var rad  = playing ? this.radius+3 : this.radius;
		var col  = playing ? 'yellow' : this.colors[pos];
		ctx.beginPath();
		ctx.arc(xVal, yVal, rad, 0, Math.PI*2, false);
		ctx.fillStyle = col;
		ctx.fill();
		ctx.closePath();
	},
	draw: function(){
		this.beats = Object.keys(SongMap).length + 1;
		var song = [SoundArray];
		for (var uuid in SongMap){
			song.push(SongMap[uuid]);
		}
		for (var i=0; i < song.length; i++){
			for (var j=0; j < song[i].length; j++){
				this.drawBeat(song[i][j], i);
			}	
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


///////////////////////////
// PubNub Collaborations //
///////////////////////////
UUID = PUBNUB.uuid();

pubnub = PUBNUB({                          
    publish_key   : 'pub-c-f83b8b34-5dbc-4502-ac34-5073f2382d96',
    subscribe_key : 'sub-c-34be47b2-f776-11e4-b559-0619f8945a4f',
    uuid: UUID
});

function pubInit(){
	pubnub.subscribe({                                     
        channel : "cobeats",
        message : function(m){
	        if (m.uuid != UUID){
				switch(m.type){
				case "beat":
					if (m.uuid in SongMap){
						SongMap[m.uuid].push(m.data);
						SongMap[m.uuid].sort(compare);
					} else {
						SongMap[m.uuid] = [m.data];
					}
					break;	
				case "riff":
					SongMap[m.uuid] = m.data;
					break;
				case "stop":
					if (SongLen < m.data){  // Publish SongLen, if different get everyone				
						SongLen = m.data;		 //  to use the longest song version.
					} else if (SongLen != m.data) {
						publishCoBeat('stop', SongLen);
					}	
					makeSongArray();
					break;
				}
	        }
        },
        connect: function(m){
	        console.log(m);
        }
    });
}
pubInit();

function publishCoBeat(type, data){
	pubnub.publish({
	    channel: 'cobeats',        
	    message: {type:type, data:data, uuid:UUID},
	    callback : function(m){console.log(m)}
	});
}

var globalModal = $('.global-modal');
    $( ".btn-green-flat-trigger" ).on( "click", function(e) {
      e.preventDefault();
      $( globalModal ).toggleClass('global-modal-show');
    });
    $( ".overlay" ).on( "click", function() {
      $( globalModal ).toggleClass('global-modal-show');
    });
    $( ".global-modal_close" ).on( "click", function() {
      $( globalModal ).toggleClass('global-modal-show');
    });
    $(".mobile-close").on("click", function(){
      $( globalModal ).toggleClass('global-modal-show');
    });


var globalModal2 = $('.global-modal2');
    $( ".btn-red-flat-trigger2" ).on( "click", function(e) {
      e.preventDefault();
      $( globalModal2 ).toggleClass('global-modal2-show');
    });
    $( ".overlay" ).on( "click", function() {
      $( globalModal2 ).toggleClass('global-modal2-show');
    });
    $( ".global-modal2_close" ).on( "click", function() {
      $( globalModal2 ).toggleClass('global-modal2-show');
    });
    $(".mobile-close2").on("click", function(){
      $( globalModal2 ).toggleClass('global-modal2-show');
    });




$(".mat-input").focus(function(){
  $(this).parent().addClass("is-active is-completed");
});

$(".mat-input").focusout(function(){
  if($(this).val() === "")
    $(this).parent().removeClass("is-completed");
  $(this).parent().removeClass("is-active");
})

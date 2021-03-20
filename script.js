//gblobal var
var clueHoldTime = 1000;
var life = 3;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
var pattern = [];
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
//TODO: Create random Pattern array
var progress = 0;
var gamePlaying = false;
var tempProgress = 0;


function startGame(){
  //init game var
  pattern = generateRandomPattern();
  progress = 0;
  life = 3;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function generateRandomPattern(){
  var pattern = [];
  for(let i = 0; i <= 10; i++){
    pattern.push(Math.floor(Math.random()*8+1));
  }
  return pattern;
}

function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}


function lightButton(btn){
  document.getElementById("btn"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("btn"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence(){
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue   
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  clueHoldTime -= 10;
  tempProgress = 0;
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //game logic
    if(btn == pattern[tempProgress]){
      tempProgress++;
      //console.log(tempProgress);
      if(tempProgress-1 == progress){
         progress++;
        playClueSequence();
      }
      if(progress == pattern.length){
        winGame();
      } else {
        guessCounter++;
      }
    } else if(life > 0 ){
      lifeChange();
      tempProgress = 0;
      playClueSequence();
    } else {
      loseGame();
    }
    
  }

function lifeChange(){
  life--;
  document.getElementById("lifeValue").innerText = "Life: " + life;
}

function winGame(){
  stopGame();
  alert("Game Over. You Win.");
}

function loseGame(){
  stopGame();
  life = 3;
  alert("Game Over. You lost.");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 501.2,
  6: 529.6,
  7: 592,
  8: 666.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}

function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)
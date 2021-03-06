let debug = false;

var totalWidth = 800;
var totalHeight = 800;
var gameWidth = 600;
var gameHeight = 600;
var buttonsXPosition = 20;
var buttonsYPosition = gameHeight + 20;
var statsXPosition = gameWidth + 20;
var statsYPosition = 200;
var buttonsStandardWidth = 75;
var buttonsStandardHeight = 20;
var time;
var ending;


var sketchGame = function(p) {
  let villagers = [];
  var maxPawns = 1;
  var startingWheat = 15;
  var startingPoison = 200;
  let limit = 50;
  var wheat = [];
  var poison = [];
  let totalTimer = 3;
  var endTimer = 0;
  var countList = [];




  p.setup = function(){
    canvas = p.createCanvas(totalWidth, totalHeight);
    resetSketch();

    // Bouton Add Wheat
    addWheatButton = p.createButton("Wheat");
    addWheatButton.size(buttonsStandardWidth, buttonsStandardHeight);
    addWheatButton.position(buttonsXPosition, buttonsYPosition);
    addWheatButton.mousePressed(function() {addDot(wheat,'wheat')});

    // Bouton Add Poison
    addPoisonButton = p.createButton("Poison");
    addPoisonButton.size(buttonsStandardWidth, buttonsStandardHeight);
    addPoisonButton.position(addWheatButton.x + buttonsStandardWidth + 10, buttonsYPosition);
    addPoisonButton.mousePressed(function() {addDot(poison,'poison')});

    // Bouton Reset
    resetButton = p.createButton("RESET");
    resetButton.size(buttonsStandardWidth, buttonsStandardHeight);
    resetButton.position(addPoisonButton.x + buttonsStandardWidth + 10, buttonsYPosition);
    resetButton.mousePressed(resetSketch);

  }

  function generateDots(number, type){
    var list = [];
    for (i = 0 ; i < number ; i++){
      addDot(list, type);
    }
    return list;
  }

  function resetSketch(){
    ending = false;
    villagers.length = 0;
    timerStart = p.floor(p.frameCount / 60);
    for (var i = 1; i < maxPawns + 1; i++) {
      villagers.push(new Pawn(p.random(gameWidth),p.random(gameHeight), i));
    }
    wheat = generateDots(startingWheat, 'wheat');
    poison = generateDots(startingPoison, 'poison');
  }


  function addDot(list, type){
    xRange = 75 + p.random(gameWidth - 150);
    yRange = 75 + p.random(gameHeight - 150);
    list.push(new Dot(xRange, yRange, type));
  }

  function checkEnding(){
    var max;

    if (wheat.length == 0 || time <= 0){
      for (i = 0 ; i < villagers.length ; i++){
        villagers[i].maxspeed[1] = 0;
        if (max === undefined || villagers[i].score > max){
          winner = i+1;
          max = villagers[i].score;
        }
      }
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(50)
      p.fill(255)
      p.text("PAWN #" + winner + " WINS !!", gameWidth/2, gameHeight/2)

      if (!ending){
        endTimer = time;
      }

      ending = true;
      if (endTimer - time > 3){
        resetSketch();
      }
    }
  }


  function timer(){
    p.fill(0)
    time = totalTimer + timerStart - (p.frameCount / 60);
    if (time < 0 || ending){
      timerDisplayed = endTimer;
    }
    else {
      timerDisplayed = time;
    }
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(15);
    p.text("Time left : " + p.floor(timerDisplayed + 0.99), gameWidth + 20, 20);
    return time;
  }

  function counter(){

    p.fill(0)
    countList[0] = villagers.length;
    countList[1] = wheat.length;
    countList[2] = poison.length;
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(15);
    p.text("Wheat :  " + countList[1], gameWidth + 20, 50);
    p.text("Poison : " + countList[2], gameWidth + 20, 70);
    p.text("Pawns :  " + countList[0], gameWidth + 20, 90);
    return countList
  }

  p.draw = function(){
    p.background(21);
    p.fill(255)
    p.rect(gameWidth, 0, totalWidth-gameWidth, totalHeight);
    p.rect(0, gameHeight, totalWidth, totalHeight-gameHeight);

    time = timer();
    counter();

    if (debug){
      p.noFill()
      p.stroke(0);
      p.rect(0, 0, totalWidth, totalHeight);

      // Game area
      p.stroke(0,0,255)
      p.rect(0,0,gameWidth,gameHeight)

      // Boundaries area
      p.stroke(255,0,0);
      p.rect(limit, limit, gameWidth - 2*limit, gameHeight - 2*limit)

      // Spawn area
      p.stroke(255);
      p.rect(75, 75, gameWidth - 150, gameHeight - 150)

    }

    for (var i = 0; i < villagers.length; i++){

      if (wheat.length > 0) {
        villagers[i].tracksGood(wheat);
      }

      if (poison.length > 0){
        villagers[i].tracksBad(poison);
      }

      villagers[i].update();
      villagers[i].boundaries(limit)
      villagers[i].displayPawn();
      villagers[i].displayStat(villagers[i].maxspeed, statsYPosition*(i+1));
      if (debug){
        villagers[i].displayDebugStats(gameWidth + 20, 200);
      }
    }

    for (var i = 0; i < wheat.length; i++){
      wheat[i].display();
    }

    for (var i = 0; i < poison.length; i++){
      poison[i].display();
    }

    checkEnding();
  }


}

var game = new p5(sketchGame);

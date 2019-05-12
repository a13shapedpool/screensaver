let villagers = [];
let limit = 50;
var wheat = [];
var poison = [];

function setup() {
  createCanvas(600, 600);
  for (var i = 0; i < 1; i++) {
    villagers.push(new Pawn(random(width),random(height)));
  }

  wheat = generateDots(18, 'wheat');
  poison = generateDots(4, 'poison');

}

function generateDots(number, type){
  var list = [];
  for (i = 0 ; i < number ; i++){
    list.push(new Dot(100 + random(width-200), 100 + random(height-200), type));
  }
  return list;
}


function draw() {
  background(50);

  for (var i = 0; i < villagers.length; i++){
    villagers[i].tracksGood(wheat);
    villagers[i].tracksBad(poison);
    villagers[i].update();
    // villagers[i].standardMovements();
    villagers[i].boundaries(limit)
    villagers[i].displayPawn();
  }

  for (var i = 1; i < wheat.length; i++){
    wheat[i].display();
  }

  for (var i = 1; i < poison.length; i++){
    poison[i].display();
  }
}

let villagers = [];
let limit = 50;
var wheat = [];
var poison = [];


function setup() {
  createCanvas(600, 600);
  for (var i = 0; i < 1; i++) {
  villagers.push(new Pawn(random(width),random(height)));
}
  for (var i = 0 ; i < 10 ; i++){
    x_wheat = 100 + random(width-200);
    y_wheat = 100 + random(height-200);
    x_poison = 100 + random(width-200);
    y_poison = 100 + random(height-200);
    wheat.push(createVector(x_wheat,y_wheat));
    poison.push(createVector(x_poison, y_poison));

  }
}

function draw() {
  background(51);

  for (var i = 0; i < wheat.length; i++){
    fill(0,255,0)
    noStroke()
    ellipse(wheat[i].x,wheat[i].y,8,8)
  }

  for (var i = 0; i < poison.length; i++){
    fill(255,0,0)
    noStroke()
    ellipse(poison[i].x,poison[i].y,8,8)
  }

  for (var i = 0; i < villagers.length; i++){
    villagers[i].targets(wheat, 3);
    villagers[i].targets(poison, -0.05);
    villagers[i].update();
    // villagers[i].standardMovements();
    villagers[i].boundaries(limit)
    villagers[i].display();
  }

}

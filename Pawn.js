class Pawn {
  constructor(x, y, id) {

    // Pawn id
    this.id = id;
    this.position = game.createVector(x, y);
    this.velocity = game.createVector(0, -2);
    this.acceleration = game.createVector(0, 0);
    this.size = 6;
    this.startingTimePoison;
    this.resetStats();
    this.hasTarget = false;
  }

  resetMaxSpeed(){
    this.maxspeed = ["Speed", 3.7];
  }

  resetMaxForce(){
    this.maxforce = ["Force", 2];
  }

  resetWheatRadius(){
    this.wheatDetectionRadius = ["Wheat Radius", 217];
  }

  resetPoisonRadius(){
    this.poisonDetectionRadius = ["Poison Radius", 50];
  }

  resetWheatAttraction(){
    this.wheatAttractionMult = ["Wheat Attraction", 3];
  }

  resetPoisonRepulsion(){
    this.poisonRepulsionMult = ["Poison Repulsion", 1];
  }

  resetScore(){
    this.score = 0;
  }

  resetBuffsCount(){
    this.buffsCount = 0;
  }

  resetStats(){
    this.resetMaxForce();
    this.resetMaxSpeed();
    this.resetWheatRadius();
    this.resetPoisonRadius();
    this.resetWheatAttraction();
    this.resetPoisonRepulsion();
    this.resetScore();
    this.resetBuffsCount();
    this.effectApplied = ['boost', false ,'low', false];

  }

  update() {

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed[1]);
    this.position.add(this.velocity);
    this.displayBonusMalus(gameWidth - 50, 20);
    this.resetBonusMalus();

  }

  boundaries(edge){

    var desired = null;

    if (this.position.x > gameWidth - 2*edge) {
      desired = game.createVector(-this.maxspeed[1], this.velocity.y + game.random(-1,1));
    }

    else if (this.position.x < edge) {
      desired = game.createVector(this.maxspeed[1], this.velocity.y + game.random(-1,1));
    }

    if (this.position.y > gameHeight - 2*edge) {
      desired = game.createVector(this.velocity.x + game.random(-1,1), -this.maxspeed[1]);
    }

    else if (this.position.y < edge) {
      desired = game.createVector(this.velocity.x + game.random(-1,1), this.maxspeed[1]);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed[1]);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }


  applyForce(force) {
    this.acceleration.add(force);
  }

  applyBonusMalus(type){

    switch (type){

      case('wheat'):
      if (this.effectApplied[0] != 'Boost'){
        // this.effectApplied = 'Boost'
      }
      break;

      case('poison'):
      if (this.effectApplied[0] != 'Low'){
        this.maxspeed[1] = this.maxspeed[1] / 2;
        this.effectApplied[3] = true;
        this.buffsCount++;
        this.startingTimePoison = time;
      }
      break;

    }

  }

  resetBonusMalus(){

    if ((this.effectApplied[3]) && ((this.startingTimePoison - time) > 1.5)){
      this.effectApplied[3] = false;
      this.resetMaxSpeed();
      this.buffsCount--;


    }

  }


  tracksGood(list){
    this.hasTarget = false;
    var closest = -1;
    var sens = list[0].forceApplied;
      if (list[0].type == "wheat"){
          var record = this.wheatDetectionRadius[1];
      }
      else {
        var record = 150;
      }

      for (var i = 0; i < list.length; i++) {
        var d = this.position.dist(list[i].position);
        if (d < record) {
          record = d;
          closest = i;
        }
      }

      if (record < this.size) {
        list.splice(closest, 1);
        record = 100;
        this.score += 1;
      } else if (closest > -1 && record < this.wheatDetectionRadius[1]) {
        if (list[0].type == "wheat"){
          this.hasTarget = true;
          return this.seek(list[closest], list[0].forceApplied*this.wheatAttractionMult[1])
        }
        else {
          return game.createVector(0,0);
        }
      }
  }

  tracksBad(list){

    var closest = -1;
    var sens = list[0].forceApplied;
      if (list[0].type == "poison"){
          var record = this.poisonDetectionRadius[1];
      }
      else {
        var record = 100;
      }

      for (var i = 0; i < list.length; i++) {
        var d = this.position.dist(list[i].position);
        if (d < record) {
          record = d;
          closest = i;
        }
      }

      if (record < 5) {
        list.splice(closest, 1);
        record = 100;
        this.applyBonusMalus('poison');
        this.score -= 1;
      } else if (closest > -1 && record < this.poisonDetectionRadius[1]) {
        if (list[0].type == "poison"){
          return this.seek(list[closest], list[0].forceApplied*this.poisonRepulsionMult[1])
        }
        else {
          return game.createVector(0,0);
        }
      }
  }

  seek(target, sens) {

    var desired = p5.Vector.sub(target.position, this.position);

    if (sens > 0){
      game.stroke(0,255,0);
    } else{
      game.stroke(255,0,0);
    }
    if (debug){
      game.line(target.position.x, target.position.y, this.position.x, this.position.y);
    }

    desired.setMag(this.maxspeed[1]);

    var steer = p5.Vector.sub(desired, this.velocity);
    steer = steer.mult(sens)
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  displayPawn() {
    if (this.effectApplied[3]){
      game.fill(255,130,0)
      game.stroke(255,160,0)
    } else {
      game.fill(127);
      game.stroke(200);
    }

    game.strokeWeight(1);
    game.ellipse(this.position.x, this.position.y, 20,20);

    if (debug){
      game.noFill()
      game.stroke(0,200,0,75);
      game.strokeWeight(1)
      game.ellipse(this.position.x, this.position.y, 2*this.wheatDetectionRadius[1]);
      game.stroke(200,0,0,75);
      game.strokeWeight(1)
      game.ellipse(this.position.x, this.position.y, 2*this.poisonDetectionRadius[1]);
    }
  }


  displayBonusMalus(x, y){
    // console.log(this.effectApplied);
    for (i = 0; i < this.effectApplied.length; i = i + 2){
      if (this.effectApplied[i+1]){
        game.fill('orange')
        game.stroke(0)
        game.rect(x, y, 15, 15)
      }
    }



  }

  displayStat(stat, y){

    game.stroke(50)
    game.fill(230);
    game.rect(statsXPosition - 10, y - 50, 180, 150)

    game.fill(0)
    game.noStroke()
    game.textSize(15)
    game.text("PAWN #" + this.id, statsXPosition + 40, y - 30);

    game.textSize(10);
    game.textAlign(game.LEFT)

    // Maximum Speed
    var unit = game.floor(this.maxspeed[1]);
    var dec = this.maxspeed[1] % 1;
    game.fill(0)
    game.text(this.maxspeed[0].toUpperCase(), statsXPosition, y+6)

    for (i = 0 ; i < unit ; i++){
      if (this.effectApplied[3]){
        game.fill(255,130,0)
      }
      else{
        game.fill('green')
      }
      game.rect(statsXPosition + 85 + i*11, y, 10, 10);
      game.rect(statsXPosition + 85 + unit*11, y, 10*dec, 10)
    }

    // Maximum Force
    var unit = game.floor(this.maxforce[1]);
    var dec = this.maxforce[1] - unit;
    game.fill(0)
    game.text(this.maxforce[0].toUpperCase(), statsXPosition, y+26)

    for (i = 0 ; i < unit ; i++){
      game.fill('green')
      game.rect(statsXPosition + 85 + i*11, y + 20, 10, 10);
      game.rect(statsXPosition + 85 + unit*11, y + 20, 10*dec, 10)
    }

    // Wheat Detection Radius
    var unit = game.floor(this.wheatDetectionRadius[1] / 50);
    var dec =  game.floor(this.wheatDetectionRadius[1] % 50);
    game.fill(0)
    game.text(this.wheatDetectionRadius[0].toUpperCase(), statsXPosition, y+46)

    for (i = 0 ; i < unit ; i++){
      game.fill('green')
      game.rect(statsXPosition + 85 + i*11, y + 40, 10, 10);
      game.rect(statsXPosition + 85 + unit*11, y + 40, dec/10, 10)
    }

    // Poison Detection Radius
    var unit = game.floor(this.poisonDetectionRadius[1] / 50);
    var dec =  game.floor(this.poisonDetectionRadius[1] % 50);
    game.fill(0)
    game.text(this.poisonDetectionRadius[0].toUpperCase(), statsXPosition, y+66)

    for (i = 0 ; i < unit ; i++){

      game.fill('green')
      game.rect(statsXPosition + 85 + i*11, y + 60, 10, 10);
      game.rect(statsXPosition + 85 + unit*11, y + 60, dec/10, 10)
    }


    // Score

    game.fill(0)
    game.text("SCORE", statsXPosition, y+86)
    game.textSize(13)
    game.text(this.score, statsXPosition + 85, y + 85)



  }


  displayDebugStats(x, y){
    game.textAlign(game.LEFT, game.RIGHT);
    game.fill(0);
    game.noStroke();
    game.textSize(15)

    game.textSize(10);
    // game.text("x :                 " + game.floor(this.position.x), x, y + 15);
    // game.text("y :                 " + game.floor(this.position.y), x, y + 30);
    // game.text("Speed :             " + game.nf(this.velocity.mag(),0,2), x, y + 45);
    // game.text("Accel :             " + game.nf(this.acceleration.mag(),0,2), x, y + 60);
    // game.text("Size :              " + this.size, x, y + 75);
    game.text("MaximumSpeed :      " + this.maxspeed[1], x, y + 90);
    // game.text("MaximumForce :      " + this.maxforce, x, y + 105);
    // game.text("Wheat Radius :      " + this.wheatDetectionRadius[1], x, y + 120);
    // game.text("Wheat Attraction :  " + this.wheatAttractionMult[1], x, y + 135);
    // game.text("Poison Radius :     " + this.poisonDetectionRadius[1], x, y + 150);
    // game.text("Poison Repulsion :  " + this.poisonRepulsionMult[1], x, y + 165);
    // game.text("Target :            " + this.hasTarget, x, y + 180);
    // game.text("Effect :            " + this.effectApplied[0], x, y + 195);
  }

}

var startingTime;

class Pawn {
  constructor(x, y, id) {
    this.id = id;
    this.position = game.createVector(x, y);
    this.velocity = game.createVector(0, -2);
    this.acceleration = game.createVector(0, 0);
    this.size = 6;
    this.resetStats();
    this.hasTarget = false;
    this.effectApplied = 'None';
  }

  resetStats(){
    this.maxspeed = 4;
    this.maxforce = 2;
    this.wheatDetectionRadius = 200;
    this.wheatAttractionMult = 3;
    this.poisonDetectionRadius = 50;
    this.poisonRepulsionMult = 1;
  }

  update() {

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);

    if ((this.effectApplied != 'None') && ((startingTime - time) > 1.5)){
      this.applyBonusMalus('reset');
    }


  }

  boundaries(edge){

    var desired = null;

    if (this.position.x > gameWidth - 2*edge) {
      desired = game.createVector(-this.maxspeed, this.velocity.y + game.random(-1,1));
    }

    else if (this.position.x < edge) {
      desired = game.createVector(this.maxspeed, this.velocity.y+ game.random(-1,1));
    }

    if (this.position.y > gameHeight - 2*edge) {
      desired = game.createVector(this.velocity.x+ game.random(-1,1), -this.maxspeed);
    }

    else if (this.position.y < edge) {
      desired = game.createVector(this.velocity.x+ game.random(-1,1), this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
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
      if (this.effectApplied != 'Boost'){
        // this.effectApplied = 'Boost'
      }
      break;

      case('poison'):
      if (this.effectApplied != 'Low'){
        this.maxspeed = this.maxspeed / 2;
        this.effectApplied = 'Low'
      }
      break;

      case('reset'):
      this.effectApplied = 'None'
      this.resetStats();
      break;

    }

    // if (type == 'reset'){
    //   this.effectApplied = 'None'
    //   this.resetStats();
    // }
    //
    // if (type == 'wheat' && this.effectApplied != 'Boost'){
    //   // this.effectApplied = 'Boost'
    // }
    //
    // if (type == 'poison' && this.effectApplied != 'Low'){
    //   this.maxspeed = this.maxspeed / 2;
    //   this.effectApplied = 'Low'
    // }
  }

  tracksGood(list){
    this.hasTarget = false;
    var closest = -1;
    var sens = list[0].forceApplied;
      if (list[0].type == "wheat"){
          var record = this.wheatDetectionRadius;
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
        this.applyBonusMalus('wheat');
        startingTime = time;
      } else if (closest > -1 && record < this.wheatDetectionRadius) {
        if (list[0].type == "wheat"){
          this.hasTarget = true;
          return this.seek(list[closest], list[0].forceApplied*this.wheatAttractionMult)
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
          var record = this.poisonDetectionRadius;
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
        startingTime = time;
      } else if (closest > -1 && record < this.poisonDetectionRadius) {
        if (list[0].type == "poison"){
          return this.seek(list[closest], list[0].forceApplied*this.poisonRepulsionMult)
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
    game.line(target.position.x, target.position.y, this.position.x, this.position.y);

    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.velocity);
    steer = steer.mult(sens)
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  displayPawn() {
    if (this.effectApplied == 'Low'){
      game.fill(120,255,0)
      game.stroke(0,255,0)
    } else {
      game.fill(127);
    }
    game.stroke(200);
    game.strokeWeight(1);
    game.ellipse(this.position.x, this.position.y, 20,20);

    if (debug){
      game.noFill()
      game.stroke(0,200,0,75);
      game.strokeWeight(1)
      game.ellipse(this.position.x, this.position.y, 2*this.wheatDetectionRadius);
      game.stroke(200,0,0,75);
      game.strokeWeight(1)
      game.ellipse(this.position.x, this.position.y, 2*this.poisonDetectionRadius);
    }
  }

  displayStats(x, y){
    if (debug){
      game.textAlign(game.LEFT, game.RIGHT);
      game.fill(0);
      game.noStroke();
      game.textSize(15)
      game.text("Pawn #" + this.id, x, y);

      game.textSize(10);
      game.text("x :                 " + game.floor(this.position.x), x, y + 15);
      game.text("y :                 " + game.floor(this.position.y), x, y + 30);
      game.text("Speed :             " + game.nf(this.velocity.mag(),0,2), x, y + 45);
      game.text("Accel :             " + game.nf(this.acceleration.mag(),0,2), x, y + 60);
      game.text("Size :              " + this.size, x, y + 75);
      game.text("MaximumSpeed :      " + this.maxspeed, x, y + 90);
      game.text("MaximumForce :      " + this.maxforce, x, y + 105);
      game.text("Wheat Radius :      " + this.wheatDetectionRadius, x, y + 120);
      game.text("Wheat Attraction :  " + this.wheatAttractionMult, x, y + 135);
      game.text("Poison Radius :     " + this.poisonDetectionRadius, x, y + 150);
      game.text("Poison Repulsion :  " + this.poisonRepulsionMult, x, y + 165);
      game.text("Target :            " + this.hasTarget, x, y + 180);
      game.text("Effect :            " + this.effectApplied, x, y + 195);
    }
  }

}

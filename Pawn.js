
class Pawn {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.size = 6;
    this.maxspeed = 4;
    this.maxforce = 2;
    this.wheatDetectionRadius = 200;
    this.wheatAttractionMult = 3;
    this.poisonDetectionRadius = 50;
    this.poisonRepulsionMult = 1;
    this.hasTarget = false;
  }


  update() {

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

  }

  boundaries(edge){

    var desired = null;

    if (this.position.x > width - edge) {
      desired = createVector(-this.maxspeed, this.velocity.y + random(-1,1));
    }

    else if (this.position.x < edge) {
      desired = createVector(this.maxspeed, this.velocity.y+ random(-1,1));
    }

    if (this.position.y > height - edge) {
      desired = createVector(this.velocity.x+ random(-1,1), -this.maxspeed);
    }

    else if (this.position.y < edge) {
      desired = createVector(this.velocity.x+ random(-1,1), this.maxspeed);
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

  tracksGood(list){

    var closest = -1;
    var sens = list[0].forceApplied;
      if (list[0].type == "wheat"){
          var record = this.wheatDetectionRadius;
      }
      else {
        var record = 150;
      }

      for (var i = 1; i < list.length; i++) {
        var d = this.position.dist(list[i].position);
        if (d < record) {
          record = d;
          closest = i;
        }
      }

      if (record < this.size) {
        list.splice(closest, 1);
        record = 100;
      } else if (closest > -1 && record < this.wheatDetectionRadius) {
        if (list[0].type == "wheat"){
          return this.seek(list[closest], list[0].forceApplied*this.wheatAttractionMult)
        }
        else {
          return createVector(0,0);
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

      for (var i = 1; i < list.length; i++) {
        var d = this.position.dist(list[i].position);
        if (d < record) {
          record = d;
          closest = i;
        }
      }

      if (record < 5) {
        list.splice(closest, 1);
        record = 100;
      } else if (closest > -1 && record < this.poisonDetectionRadius) {
        if (list[0].type == "poison"){
          return this.seek(list[closest], list[0].forceApplied*this.poisonRepulsionMult)
        }
        else {
          return createVector(0,0);
        }
      }
  }




  seek(target, sens) {

    var desired = p5.Vector.sub(target.position, this.position);

    if (sens > 0){
      stroke(0,255,0);
    } else{
      stroke(255,0,0);
    }
    line(target.position.x, target.position.y, this.position.x, this.position.y);

    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.velocity);
    steer = steer.mult(sens)
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  displayPawn() {
    fill(127);
    stroke(200);
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, 20,20);
    noFill();
    stroke(0,200,0,75);
    strokeWeight(1)
    ellipse(this.position.x, this.position.y, 2*this.wheatDetectionRadius);
    stroke(200,0,0,75);
    strokeWeight(1)
    ellipse(this.position.x, this.position.y, 2*this.poisonDetectionRadius);

  }
}

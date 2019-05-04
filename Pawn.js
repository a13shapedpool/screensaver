
class Pawn {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 3;
    this.maxforce = 0.5;
    this.detectionRadius = 150;
    this.hasTarget = false;
  }


  update() {

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

standardMovements() {

    this.applyForce([random(-0.3,0.3),random(-0.3,0.3)]);

  }


boundaries(edge){

  var desired = null;

    if (this.position.x > width - edge) {
      desired = createVector(-this.maxspeed, this.velocity.y + random(-1,1));
    }

    else if (this.position.x < edge) {
      desired = createVector(this.maxspeed, this.velocity.y+ random(-1,1));
    }

    else if (this.position.y > height - 10) {
      desired = createVector(this.velocity.x+ random(-1,1), -this.maxspeed);
    }

    else if (this.position.y < 10) {
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

  targets(list, sens) {

    var record = this.detectionRadius;
    var closest = -1;
    for (var i = 0; i < list.length; i++) {
      var d = this.position.dist(list[i]);
      if (d < record) {
        record = d;
        closest = i;
      }
    }

    if (record < 5) {
      list.splice(closest, 1);
      // this.maxspeed += 0.2;
      // this.maxforce += 0.005;
      record = this.detectionRadius;
      // console.log(this.position.dist(list[closest]));
    } else if (closest > -1 && record < this.detectionRadius) {
      if (sens > 0){
        return this.seek(list[closest], sens)
      } else {
        return this.seek(list[closest], sens*(0.5*d))
      }

    }

    return createVector(0,0);

  }

  seek(target,sens) {

    var desired = p5.Vector.sub(target, this.position);

    if (sens > 0){
      stroke(0,255,0);
    } else{
      stroke(255,0,0);
    }
    line(target.x, target.y, this.position.x, this.position.y);

    desired.setMag(this.maxspeed);

    var steer = p5.Vector.sub(desired, this.velocity);
    steer = steer.mult(sens)
    steer.limit(this.maxforce);

    this.applyForce(steer);
  }

  display() {
    fill(127);
    stroke(200);
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, 20,20);
    noFill();
    stroke(0,200,0,50);
    strokeWeight(1)
    var dist = sqrt(2*pow(this.detectionRadius,2));
    ellipse(this.position.x, this.position.y, dist-5);

  }
}

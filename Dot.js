class Dot {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.type = type;
    this.size = 6;
    this.tracked = false;

    if (this.type == 'wheat'){
      this.forceApplied = 1;
    }
    else if (this.type == 'poison'){
      this.forceApplied = -1;
    }


  }


  display(){
    let type = this.type;
    // switch(str){
    //   case "wheat":
    //     fill(0,255,0)
    //     break;
    //   case "poison":
    //     fill(255,0,0)
    //     break;
    // }
    if (type == "wheat"){
      fill(0,255,0)
    } else {
      fill(255,0,0)
    }
    noStroke()
    ellipse(this.position.x,this.position.y,8,8)
  }
}

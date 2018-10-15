var log=false; 

var directionNames={N:"North",E:"East",S:"South",W:"West"};

var directionOrder=["N","E","S","W"];

var movementForward={N:{x:0,y:-1},E:{x:1,y:0},S:{x:0,y:1},W:{x:-1,y:0}};

var commands={f:"moveForward",l:"turnLeft",r:"turnRight",b:"moveBackward"};

var elements={r:"rover",o:"obstacle"};

var grid={height:10,width:10,cell:[]};

for (var i=0;i<grid.width;i++){
  grid.cell[i]=[];
  for (var j=0;j<grid.height;j++){
    grid.cell[i][j]=null;
  }
}


class Rover {
  constructor(direction, posX, posY) {
    var wrongPos=positionIsWrong(posX,posY);
    if (wrongPos){
      console.log ("Can't create Rover: "+wrongPos);
    }
    else{
      this.direction = direction;
      this.posX = posX;
      this.posY = posY;
      this.travelLog = [];
    }
  }
}

function turnLeft(rover){
  logCommand("turnLeft");
  var newDirIndex = directionOrder.indexOf(rover.direction)-1;
  if (newDirIndex==-1){
    newDirIndex=3;
  }
  rover.direction=directionOrder[newDirIndex];
  logDirection(rover);
}

function turnRight(rover){
  logCommand("turnRight");
  var newDirIndex = directionOrder.indexOf(rover.direction)+1;
  if (newDirIndex==4){
    newDirIndex=0;
  }
  rover.direction=directionOrder[newDirIndex];
  logDirection(rover);
}

function moveForward(rover){
  logCommand("moveForward");
  var newX=+rover.posX+movementForward[rover.direction].x;
  var newY=+rover.posY+movementForward[rover.direction].y;
  var wrongPosition=positionIsWrong(newX,newY);
  if (wrongPosition){
    logWrongPosition(newX,newY,wrongPosition);
  }
  else{
    changeRoverPos(rover.posX,rover.posY,newX,newY);
    rover.posX=newX;
    rover.posY=newY;
    addToTravelLog(rover);
    logPosition(rover);
  }
}

function moveBackward(rover){
  logCommand("moveBackward");
  var newX=+rover.posX-movementForward[rover.direction].x;
  var newY=+rover.posY-movementForward[rover.direction].y;
  var wrongPosition=positionIsWrong(newX,newY);
  if (wrongPosition){
    logWrongPosition(newX,newY,wrongPosition);
  }
  else{
    changeRoverPos(rover.posX,rover.posY,newX,newY);
    rover.posX=newX;
    rover.posY=newY;
    addToTravelLog(rover);
    logPosition(rover);
  }
}

function logCommand(command){
  if (log){
    console.log (command+" was called.")
  }
}

function logDirection(rover){
  if (log){
    console.log("Rover is facing " + directionNames[rover.direction]);
  }
}

function logPosition(rover){
  if (log){
    console.log ("Rover is at ["+rover.posX+","+rover.posY+"]");
  }
}

function positionIsWrong(posX,posY){
  var wrongPos=false;
  if (posX<0 || posX>=grid.width || posY<0 || posY>=grid.height){
    wrongPos="Position out of limits"
  }
  else{
    elt=grid.cell[posX][posY];
    if (elt != null){
      wrongPos = "There is a(n) "+elements[elt]+" there";
    }
  }
  return wrongPos;
}

function logWrongPosition(x,y,reason){
  console.log ("Can't move to position "+"["+x+","+y+"]: " +reason);
}

function moveRover(rover,movements){
  moveRoverRec(rover,movements);
  logTravelLog(rover);
}

function moveRoverRec(rover,movements){
  var move=movements.charAt(movements.length-1);
  movements=movements.substr(0,movements.length-1);
  var todoBien=false;
  if (commands.hasOwnProperty(move)){
    if(moveRoverRec(rover,movements)){
      eval(commands[move])(rover);
      todoBien=true;
    }
  }
  else{
    if ((move)==""){
      todoBien=true;
    }
    else{
      console.log("The input is not valid");
    }
  }
  return todoBien;
}

function addToTravelLog (rover){
  rover.travelLog.push([rover.posX,rover.posY]);  
}

function logTravelLog(rover){
  console.log("The rover has traveled over this coordinates:")
  rover.travelLog.forEach(position => {
    console.log("["+position[0]+","+position[1]+"]");
  });
}

function moveOnGrid(oldPosX,oldPosY,rover){
  grid.cell[oldPosX][oldPosY]=null;
  grid.cell[rover.posX][rover.posX]='r';
}

function addObstacle(posX,posY){
  if (positionIsWrong(posX,posY)){
    console.log ("Wrong position");
  }
  else{
    grid.cell[posX][posY]='o';
  }
}

function addObstacles(obstacles){
  obstacles.forEach(function(pos){
    addObstacle(pos[0],pos[1]);
  });
}

function changeRoverPos(oldX,oldY,newX,newY){
  grid.cell[oldX][oldY]=null;
  grid.cell[newX][newY]='r';
}



/*addObstacles([[0,1],[3,5],[7,8]]);
rover= new Rover('N',0,0);
rover2= new Rover('N',1,1);
moveRover (rover, "rrfffblfb");
moveRover (rover2,"flf");
*/

class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    spaceship1 = createSprite(400,200);
    spaceship1.addImage("spaceship1",spaceship1Img);
    spaceship2 = createSprite(800,200);
    spaceship2.addImage("spaceship2",spaceship2Img);
  
   spaceships = [spaceship1, spaceship2];
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    
    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(bgImg, 0,-displayHeight*4,displayWidth, displayHeight*5);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 125 ;
      var y;
      
      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 400;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        spaceships[index-1].x = x;
        spaceships[index-1].y = y;
       // console.log(index, player.index)
      

       
        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
         spaceships[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y =spaceships[index-1].y;

          if(keyDown(RIGHT_ARROW)){
      spaceships[index-1].x = spaceships[index-1].x +100;
          }
          if(keyDown(LEFT_ARROW)){
            spaceships[index-1].x = spaceships[index-1].x -100;
                }

          if(bAliensGroup.isTouching(spaceships[index-1])){
            bAliensGroup.destroyEach();
            player.score = player.score-10;
          }
          if(gAliensGroup.isTouching(spaceships[index-1])){
            GAliensGroup.destroyEach();
            player.score = player.score + 10;
          }
          if(asteroidGroup.isTouching(spaceships[index-1])){
            asteroidGroup.destroyEach();
            player.score = player.score-20;
          }
          text("Score:" + player.score, displayWidth-100, displayHeight)
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }
      //spaceships[index-1].y-500
    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
     player.distance +=10;
      player.score +=10;
      player.update();
    }
    
    // distance not updating in database and score
    // score location
    // asteroid group not working

    if(player.distance > 3860){
      gameState = 2;
      player.rank +=1
      Player.updateCarsAtEnd(player.rank)
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}



/*
Code written in functioin setup - Works only ONCE
Code written in function draw - Works INFINITE times
*/

//Variables
var trex, trexrunning;
var ground, groundImage;

var collide

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var invisibleGround

var cloudImage, cloudGroup;

var obstacle1, obstacle2, obstacle3, obstacle4, 
    obstacle5, obstacle6, obstacleGroup

var score = 0;
var hs = 0;

var gameover, gameoverImage;
var restart, restartImage;

//Preload Animations
function preload(){
  trexrunning = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadAnimation("ground2.png");
  collide = loadAnimation("trex_collided.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3")
}

function setup() {
  createCanvas(600, 200);
  //Trex Create Sprite Values : x, y
  trex = createSprite(50, 160);
  trex.addAnimation("trex",trexrunning);
  trex.addAnimation("collide", collide);
  trex.scale = 0.5;
  //Ground Create Sprite Values : x, y, w, h
  ground = createSprite(300, 180, 600, 20);
  ground.addAnimation("ground",groundImage);
  invisibleGround = createSprite(300, 189, 600, 4);
  invisibleGround.visible = false;
  //To create a new group, "new Group"
  cloudGroup = new Group ();
  obstaclesGroup = new Group ();
  gameover = createSprite(300, 100);
  gameover.addImage("gameover",gameoverImage);
  gameover.scale = 0.6;
  gameover.visible = false;
  restart = createSprite(300, 135);
  restart.addImage("restart",restartImage);
  restart.scale = 0.4;
  restart.visible = false;
}

function draw() {
  
  //Background
  background(180);

  //Score
  textSize("20");
  fill(0);
  text("Score: " + score, 500, 35);
  
  //hs
  textSize("22");
  fill(0);
  text("High Score: " + hs, 350, 35)
  
  //Game States IF conditions
  if(gameState == PLAY){
    ground.velocityX = -6;    
    //Reset IF Condition
    if(ground.x < 0){
      ground.x = ground.width/2
    }
    spawnClouds();    
    spawnObstacles();
    
 //Pressing Space Bar to make Trex Jump
  if(keyDown("space") && trex.y >= 163){
    trex.velocityY  = -12;
    jump.play();
  }
    //Gravity for Trex
  trex.velocityY = trex.velocityY + 0.8;
    
    //Estimate the Score
  score = score + Math.round(getFrameRate()/60);
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
    }
  }
  else if(gameState == END){
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collide", collide);
    trex.velocityY = 0;
    gameover.visible = true;
    restart.visible = true;
  }
  
  if(score % 100 == 0 && score > 0){
   checkPoint.play();
  }
  
  //Collide with Invisible Ground
  trex.collide(invisibleGround);
  
  //Restart
  if(mousePressedOver(restart)){
    reset();
  }

  //Display
  drawSprites();
}

//Spawn the clouds FUNCTION
function spawnClouds(){
  if(World.frameCount % 60 == 0){
    var cloud = createSprite(600, 120, 40, 10);
    cloud.addImage("cloud", cloudImage);
    cloud.velocityX = -3;
    cloud.scale = 1.1;
    cloud.y = random(70, 120);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 200;
    cloudGroup.add(cloud);
  }}

//Spawn the obstacles FUNCTION
function spawnObstacles(){
  if(World.frameCount % 60 == 0){
  var obstacle = createSprite(600, 165, 10, 40);
  obstacle.velocityX = -(6+3*score/100);
  var rand = Math.round(random(1, 6));
    
  switch(rand){
    case 1: obstacle.addImage(obstacle1);
      break;
    case 2: obstacle.addImage(obstacle2);
      break;
    case 3: obstacle.addImage(obstacle3);
      break;
    case 4: obstacle.addImage(obstacle4);
      break;
    case 5: obstacle.addImage(obstacle5);
      break
    case 6: obstacle.addImage(obstacle6);
      break;
    default : break
  }
    
  obstacle.scale = 0.5;
  obstacle.lifetime = 100;
  obstaclesGroup.add(obstacle);
  }}
  
//Reset
function reset(){
  gameState = PLAY;
  trex.changeAnimation("trex",trexrunning);
  obstaclesGroup.destroyEach();
  cloudGroup.destroyEach();
  gameover.visible = false;
  restart.visible = false;
  if(hs < score){
    hs = score;
  }
  score = 0;
  }
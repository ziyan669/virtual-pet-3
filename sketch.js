//Create variables here
var dog, happyDog, database, food, foodStock, Dog, feed,feedDog, addFood;
var fedTime, lastFed;
var foodObj;
var foodS = 0;
var garden, washroom, bedroom;
var gamestate;

function preload()
{
  Dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
  bedroom = loadImage("images/Bed Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);
  foodObj=new Food();
  
  FeedTime=database.ref('feedTime')
  FeedTime.on("value",function(data){
    lastFed=data.val();
  })

  feed = createButton("Feed the dog");
  feed = feed.position(650,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);

  dog = createSprite(250,420);
  dog.addImage(Dog);
  dog.scale=0.2

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  readState=database.ref('gamestate');
  readState.on("value",function(data){
    gamestate=data.val();
  })
  
}
 

function draw() {  
  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime===(lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("hungry");
    foodObj.display();
  }
  if(gamestate!=="hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(Dog)
  }
  drawSprites();
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
  Food:foodObj.getFoodStock(),
  feedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
  Food:foodS  
  })
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function update(state){
  database.ref('/').update({
   gamestate:state
  })
}

//=============================================================================
// LootChest.js
//=============================================================================
/*:
 * @plugindesc Plugin que genera una recompensa aleatoria en un cofre.
 *
 * @author Alex
 *
 * @help
 *
 * Usar la función lootchest(tipo de cofre) para definir los premios que estos poseeran.
 *
 * TERMS OF USE
 * Solo para uso del curso.
 *
 * COMPATIBILITY
 * Es compatible con todos los plugins.
 */

function lootchest(type){
  var prizes = []; // empty prizes struct
  var icons = []; // empty icons struct
/* rewards
* category: I (item) | A (armor) | W (weapon) | G (gold)
* id: item identificator data base
* chance: item win chance
*/
switch (type){
  case 1:
    prizes.push({ category: 'I', id: 2, chance: 16, amount: 1});  //define a loot chest prizes list.
    prizes.push({ category: 'W', id: 1, chance: 86, amount: 1});
    prizes.push({ category: 'I', id: 4, chance: 55, amount: 6});
    prizes.push({ category: 'A', id: 3, chance: 60, amount: 1});
    prizes.push({ category: 'G', id: 0, chance: 78, amount: 200});
  break;
  case 2:
    prizes.push({ category: 'W', id: 3, chance: 26, amount: 1});
    prizes.push({ category: 'I', id: 2, chance: 16, amount: 1}); 
    prizes.push({ category: 'W', id: 1, chance: 86, amount: 1});
    prizes.push({ category: 'I', id: 4, chance: 55, amount: 6});
    prizes.push({ category: 'G', id: 0, chance: 15, amount: 860});
    prizes.push({ category: 'A', id: 3, chance: 90, amount: 1});
    prizes.push({ category: 'A', id: 1, chance: 60, amount: 1});
    prizes.push({ category: 'I', id: 2, chance: 3, amount: 3});
    prizes.push({ category: 'G', id: 0, chance: 78, amount: 200});
    prizes.push({ category: 'W', id: 3, chance: 2, amount: 1});
    prizes.push({ category: 'W', id: 3, chance: 27, amount: 1});
    prizes.push({ category: 'W', id: 3, chance: 26, amount: 1});
    prizes.push({ category: 'W', id: 3, chance: 76, amount: 1});
  break;
}

 var slots_cant = prizes.length;
 var slot_winner = lootchest_reward(prizes); //this function returns the array id of the winner prize.
 //$gameMessage.add("Categoria: " + prizes[slot_winner].category + " | ID:" + prizes[slot_winner].id + " | Chance:" + prizes[slot_winner].chance + "%"); 
 lootchest_giveitem(prizes[slot_winner]); //this function gives the player the winner prize.

 //animation process
 for(var i = 0; i < slots_cant; i++){
  icons.push({category: prizes[i].category, id: prizes[i].id});
  //$gameMessage.add(icons[i].category + " | " + icons[i].id); 
 }
 lootchest_hud(icons);
 lootchest_storage(icons,slot_winner);
 lootchest_save_data(prizes[slot_winner].category,prizes[slot_winner].id,prizes[slot_winner].amount);
}

function lootchest_reward(params){
  var getWinner = false;
  while(getWinner == false){
    var min = 0;
    var max = params.length;
    var random_slot = getRandomInt(min,max);
    min = 1;
    max = 100;
    var random_chance = getRandomInt(min,max); 
    if(random_chance <= params[random_slot].chance){
      getWinner = true;
      return random_slot;
    }
  }
  }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function lootchest_giveitem(prize){
  switch (prize.category){
    case 'I':
      $gameParty.gainItem($dataItems[prize.id],prize.amount);  
    break;
    case 'W':
      $gameParty.gainItem($dataWeapons[prize.id],prize.amount);  
    break;
    case 'A':
      $gameParty.gainItem($dataArmors[prize.id],prize.amount);  
    break;
    case 'G':
      $gameParty.gainGold(prize.amount);
    break;
  }
}

function lootchest_hud(icons){
  //define constants
  var x = 408;
  var y = 312;
  //define vars
  var ID = 2;
  //spawn huds
  $gameScreen.showPicture(1, 'lootchest_blur', 1, x, y, 100, 100, 255, 0);
  $gameScreen.showPicture(2, 'lootchest_bar', 1, x, y, 100, 100, 255, 0);
  //spawn logos
  for(var i = 0; i < icons.length; i++){
    ID = ID + 1
    $gameScreen.showPicture(ID, lootchest_name_define(icons[i].category), 1, x + (48 * i), y, 100, 100, 255, 0);
  }

}

function lootchest_name_define(category){
  switch(category){
    case 'I':
      return 'lootchest_items';  
    case 'W':
      return 'lootchest_weapons';
    case 'A':
      return 'lootchest_armors';
    case 'G':
      return 'lootchest_gold';
    default: 
      throw "Item category not defined";   
  }
}

function lootchest_storage(icons,slot_winner){
  const default_x = 792;
  const replace_x = (408 + (48 * icons.length));
  (replace_x > default_x)? new_x = replace_x : new_x = default_x;
  var category_array = [];
  for(var i = 0; i < icons.length; i++){
    category_array[i] = icons[i].category;
  }
  //storage icons data into $gameVariables.
  $gameVariables.setValue(15,category_array);
  $gameVariables.setValue(16,24); //left limit
  $gameVariables.setValue(17,new_x); //right limit
  $gameVariables.setValue(18,slot_winner);
  $gameVariables.setValue(19,icons.length);
}

function lootchest_roll(speed){ //calling this function, all stocked items will be make a full roll animation, ending up to their initial x position. 
  const y = 312;
  const z = 48;
  const left_limit = $gameVariables.value(16);
  const right_limit = $gameVariables.value(17);
  const icons_length = $gameVariables.value(19);
  var initial_icon_x = $gameScreen.picture(3).x();
    for(var i = 3; i < icons_length+3; i++){
      x = $gameScreen.picture(i).x();
      move = (x - z);
      (x == left_limit)? $gameScreen.movePicture(i, 1, right_limit, y, 100, 100, 255, 0, 1): $gameScreen.movePicture(i, 1, move, y, 100, 100, 255, 0, speed);
      }
}

function lootchest_calculation(){
  const y = 312;
  const z = 48;
  const left_limit = $gameVariables.value(16);
  const right_limit = $gameVariables.value(17);
  const icons_length = $gameVariables.value(19);
  const slot_winner = ($gameVariables.value(18) + 3);
  var x = $gameScreen.picture(slot_winner).x();
  var rolls_left = 0;
  var verificator = false;
  //simulate a movement.
  do{
    x = x - z;
    rolls_left++;
    console.log("pos: " + x + " | verificator: " + verificator);
    if(x == left_limit){
      x = right_limit; //continue movement simulation to the another limit
      verificator = true; //verifies if the "icon x" reaches left limit after equals center position.
    } 
  }while((x != 408) || (verificator == false)); 
  console.log("finish!");
  console.log("rolls left: " + rolls_left);
  return rolls_left;
}

function lootchest_save_data(category,id,amount){
  $gameVariables.setValue(25,category);
  $gameVariables.setValue(26,id);
  $gameVariables.setValue(27,amount);
}

function lootchest_message(){
  category = $gameVariables.value(25);
  id = $gameVariables.value(26);
  amount = $gameVariables.value(27);  
  switch (category){
    case 'I':
      item = $dataItems[id].name;  
    break;
    case 'W':
      item = $dataWeapons[id].name;    
    break;
    case 'A':
      item = $dataArmors[id].name;    
    break;
    case 'G':
      item = "G";
    break;
  }
  if(item != "G"){
    var str = item.toString() + " X";
  }else{
    var str = item;
  }
  $gameMessage.add("¡Obtienes " + str + amount + "!");
}

function lootchest_eraseAll(){
  var a = $gameVariables.value(19) + 3;
  for(var i = 0; i < a; i++){
    $gameScreen.erasePicture(i);
  }
}
//end.
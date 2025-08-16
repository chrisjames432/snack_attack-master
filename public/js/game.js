

console.log('game.js loaded')



import * as THREE from "three";
import { OrbitControls } from 'three/addons/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/jsm/libs/lil-gui.module.min.js'
import { TWEEN } from './tween.module.min.js'


//var THREE = THREE
var game = {};
game.count = 0;
game.animations = {};
game.mixer = '';
game.dt = ""
game.direction = new THREE.Vector3();
game.camOffset = 30;
game.currentObject;
game.lookloc = { x: 0, y: 5, z: 0 };
game.controls = ''
game.board=[];
game.three = THREE;
game.currentscene = new THREE.Group();

// Game state variables
game.isGameActive = false;
game.score = 0;
game.gameTime = 0;
game.currentDesiredItem = null;
game.desireTimeLeft = 0;
game.characterMesh = null;
game.combo = 0;
game.level = 1;
game.currentitem = null; // Add this back

// Game states
game.states = {
    LOADING: 'loading',
    MENU: 'menu', 
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game_over'
};
game.currentState = game.states.LOADING;

// Input handling
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//##########################################################################################################################
//##########################################################################################################################


game.init = function () {

  game.scene = new THREE.Scene();
  game.scene.background = new THREE.Color(0xe0e0e0);;
  game.scene.fog = new THREE.Fog(0xe0e0e0, 100, 1000);
  game.renderer = new THREE.WebGLRenderer({ antialias: true });

  game.clock = new THREE.Clock();
  game.player = ''
  game.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
  game.camera.position.set(-16, 6, 26);

  game.renderer.setSize(window.innerWidth, window.innerHeight);
  game.renderer.outputEncoding = THREE.sRGBEncoding;
  game.renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('mainscene').appendChild(game.renderer.domElement);

  window.addEventListener('resize', function () {
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);
  }, false);

  // Add click detection
  game.renderer.domElement.addEventListener('click', onObjectClick);
  game.renderer.domElement.addEventListener('touchstart', onObjectClick);
  game.renderer.domElement.addEventListener('mousemove', onMouseMove);

  // Initialize audio
  if (window.gameAudio) {
    window.gameAudio.init();
  }

  game.create_scene();
  game.renderscene();
}

//##########################################################################################################################
//##########################################################################################################################


game.animate = function () {

  for (var key in game.animations) {
    if (typeof game.animations[key] === "function") { game.animations[key](); }
  }

  if (game.controls) game.controls.update();

  TWEEN.update();
  game.dt = game.clock.getDelta() * 5;
  
  // Update game logic
  updateGame();
  
  game.renderscene();
  game.camera.updateProjectionMatrix();
  requestAnimationFrame(game.animate);
}

//##########################################################################################################################
//##########################################################################################################################


game.renderscene = function () {

  game.renderer.renderLists.dispose();
  game.renderer.render(game.scene, game.camera);


}

//##########################################################################################################################
//##########################################################################################################################

game.init_controlls = function () {


  game.controls = new OrbitControls(game.camera, game.renderer.domElement);
  game.controls.target = new THREE.Vector3(0, 6, 0);
  game.controls.maxPolarAngle = Math.PI / 2;
  game.controls.enableKeys = true;
  game.controls.keyPanSpeed = 80;
  game.enableDamping = true;

  game.controls.keys = {
    LEFT: 65, //56left arrow
    UP: 87, // up arrow
    RIGHT: 68, //222 right arrow
    BOTTOM: 83 // down arrow
  }

  game.controls.enabled = true;


}


//##########################################################################################################################
//##########################################################################################################################


game.init_lights = function () {

  // lights

  var light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  game.scene.add(light);

  light = new THREE.PointLight(0xffffff);
  light.position.set(0, 20, 0);
  game.scene.add(light);

  // ground

  var mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  mesh.rotation.x = - Math.PI / 2;
  // game.scene.add(mesh);

  var grid = new THREE.GridHelper(200, 20, 0x000000, 0x000000);
  grid.material.opacity = 0.5;
  grid.material.transparent = true;
  game.scene.add(grid);

  var axesHelper = new THREE.AxesHelper(5);
  game.scene.add(axesHelper);

}
//##########################################################################################################################
//##########################################################################################################################


game.makestats = function () {

  var info = $('#info');
  var h = info.height() + 20;
  var thediv = $('<div>');
  thediv.css("position", "fixed");
  thediv.css('bottom', h + 'px');
  //thediv.css('width','100px');
  thediv.css('color', 'black');
  thediv.css('padding', '10px');
  thediv.css('border', '1px solid black');
  info.append(thediv);


  function configpos() {
    var pos = {}
    pos.x = Math.round(game.camera.position.x);
    pos.y = Math.round(game.camera.position.y);
    pos.z = Math.round(game.camera.position.z);
    return pos

  }

  thediv.html('cam info<br>' + zz.pre(configpos()));

  function update() {


    var mem = window.performance.memory
    thediv.html(zz.pre(mem) + '<br>cam info<br>' + zz.pre(configpos()));



  }


  game.animations['stats'] = update;




}
//##########################################################################################################################
//##########################################################################################################################




function setcam(mesh){
  //var direction = new THREE.Vector3();

//  mesh.getWorldDirection( direction );
 // game.camera.position.copy( mesh.position ).add( direction.multiplyScalar(1 ) );
 //	game.camera.position.set(mesh.position* new THREE.Vector3(0,50,0));
  
  //game.helper.position.set(mesh.position.x, mesh.position.y+10, mesh.position.z);//* new THREE.Vector3(0,1,0))
  game.camera.position.set(mesh.position.x, mesh.position.y+100, mesh.position.z);
  //game.camera.translateY(500);
 	//game.camera.translateZ(0);

 	game.camera.lookAt( new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z));
  //game.camera.rotation.y=Math.PI;
   //new THREE.Vector3(0,0,0) );
  //mesh.visible=false;
  //game.camera.up = new THREE.Vector3(0,0,0);
  game.camera.updateProjectionMatrix();
  console.log(mesh.name);


}
//##########################################################################################################################
//##########################################################################################################################

function getDistance(position, position2) { 
  var dx = position.x - position2.x; 
  var dy = position.y - position2.y; 
  var dz = position.z - position2.z; 
  return Math.sqrt(dx*dx+dy*dy+dz*dz); 
}




//##########################################################################################################################

function tweencamera(){

  var mesh = get_random_kid(game.board);
  var dis = getDistance(game.camera.position,mesh.position)
  
  // Dynamic speed based on game progression
  const speedMultiplier = 1 + (game.level * 0.3);
  var maxtime = Math.max(1, (dis*15)/1000 / speedMultiplier);

  var from = { 
    x:game.camera.position.x, 
    y:game.camera.position.y,
    z:game.camera.position.z,
    rx: game.camera.rotation.x
  }

  var to   = {  
      x: mesh.position.x + (Math.random() - 0.5) * 30,
      y: mesh.position.y + 75 + Math.random() * 20,
      z: mesh.position.z + (Math.random() - 0.5) * 30,
      rx: -Math.PI * 0.5 + (Math.random() - 0.5) * 0.2
  }

  new TWEEN.Tween(from)
      .to(to,maxtime*1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(function(){
        game.camera.position.set(from.x, from.y,from.z);
        game.camera.rotation.x = from.rx;
      }).start()
      .onComplete(function() {
        if (game.isGameActive) {
          setTimeout(() => {
            tweencamera();
          }, Math.max(200, 1000 - game.level * 100));
        }
      });
}

//##########################################################################################################################
//##########################################################################################################################


function get_random_kid(kids){

return kids[Math.floor(Math.random()*kids.length)]

}

//##########################################################################################################################
//##########################################################################################################################

function makecube(){


  const geometry = new THREE.BoxGeometry(5,5,5);
const material = new THREE.MeshBasicMaterial( { color: 0xf72525 } );
const cube = new THREE.Mesh( geometry, material );
game.scene.add( cube );
game.helper = cube;
}


//##########################################################################################################################
//##########################################################################################################################



//##########################################################################################################################


function rnum(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//##########################################################################################################################

function rotatemesh(kid,i){
  
    game.animations['kid'+i] = function(){
    var num = rnum(1,3)/500;
    kid.rotation.x+=num;
    num = rnum(1,3)/500;
    kid.rotation.y+=num;
    num = rnum(1,3)/500;
    kid.rotation.z+=num;
  };
}


function load_scene(){
	//LOAD GAME SCENE -----------------------------------------------  
     
  makecube();
  var loader = new GLTFLoader();
      loader.load('./js/candy1.glb', function (gltf) {
      console.log(gltf.scene)
      var model = gltf.scene;
      var kids = gltf.scene.children;
      game.mainmodel = kids
      model.visible=false
      var e = 1;

      model.scale.set(e, e, e)
      game.scene.add(gltf.scene);
    
		var mesh = model

    var amount = 300; // Reduced from 1000 for better performance
    var row = 1;
    var col = 1;
    game.board = [];
    for(var i=1; i<=amount; i++){

      var randomkid = kids[Math.floor(Math.random()*kids.length)]
      var newkid = randomkid.clone()
      newkid.position.set((row*20),0,(col*20));
      newkid.name = randomkid.name; // Ensure name is preserved
      game.scene.add(newkid);
      game.board.push(newkid);
      row=row+1;
      if (row>=15){ // Adjusted for better distribution

        row=0;
        col=col+1;
      }
      
      rotatemesh(newkid,i)
    }

    // Hide loading screen and start game
    const loadingDiv = document.getElementById('loading_div');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
    
    // Show start menu
    const startMenu = document.getElementById('start-menu');
    if (startMenu) {
      startMenu.style.display = 'block';
    }
    
    tweencamera(); 	
    });
}

//##########################################################################################################################
//##########################################################################################################################

function loadscene2(){

  var loader = new GLTFLoader();
      loader.load('./js/keyshapetest1.glb', function (gltf) {

        console.log('Character model loaded:', gltf)
        var model = gltf.scene;
        
        var e = 1;
        model.scale.set(e, e, e)
        game.scene.add(gltf.scene);

        var object = gltf.scene

        game.camera.add(object);
        object.updateMatrix();
        object.translateZ( -6 );
        object.translateY(-1);
        game.scene.add(game.camera)

        // Store character mesh reference for morph targets
        var objmorph = object.children[2].children[0]
        game.characterMesh = objmorph;

        // Find the bubble - let's debug this
        console.log('Object children:', object.children);
        game.bubble = object.children[1];
        
        if (game.bubble) {
            console.log('✅ Bubble found at children[1]:', game.bubble);
            console.log('Bubble position:', game.bubble.position);
            console.log('Bubble children:', game.bubble.children);
        } else {
            console.log('❌ Bubble not found at children[1], searching...');
            // Try to find it in other children
            for (let i = 0; i < object.children.length; i++) {
                console.log(`Child ${i}:`, object.children[i]);
                // Look for a bubble-like object (might have "bubble" in name or be a specific type)
                if (object.children[i].name && object.children[i].name.toLowerCase().includes('bubble')) {
                    game.bubble = object.children[i];
                    console.log('✅ Found bubble at index', i);
                    break;
                }
            }
            
            // If still not found, use the first child as fallback
            if (!game.bubble && object.children.length > 0) {
                game.bubble = object.children[0];
                console.log('⚠️ Using fallback bubble (children[0])');
            }
        }
        
        console.log('Character loaded with morph targets:', objmorph.morphTargetInfluences);
      });
}



game.create_scene = function () {


    game.scene.background = new THREE.Color(0xe0e0e0);;
    var camera = game.camera;
  //game.init_controlls();
    load_scene();
	  loadscene2();
    game.init_lights()
    game.renderscene()

   

    
   // $('#loading_div').delay(0).fadeOut(400)


   

}

//##########################################################################################################################
//##########################################################################################################################


game.clearscene = function () {


  // dispose geometries and materials in scene
  game.scene.traverse(function (o) {

    if (o.geometry) {
      o.geometry.dispose()
      console.log("dispose geometry ", o.geometry)
    }



    if (o.material) {
      if (o.material.length) {
        for (let i = 0; i < o.material.length; ++i) {
          o.material[i].dispose()
          console.log("dispose material ", o.material[i])
        }
      }
      else {
        o.material.dispose()
        console.log("dispose material ", o.material)
      }

    }

    game.scene.remove.apply(game.scene, game.scene.children);
    game.renderer.renderLists.dispose();

  })




}

//---------------------------------------------------------------------------------------------


game.destroy = function(object){


  if(object.children.length>0){
    console.log('this is a group')
    var kids = object.children;
    kids.forEach(element => {
      
      removeObject3D(element)

    });

  }else{


console.log('not a group')
removeObject3D(object)
  }



  

}


game.destroyobj = function(object){


  object.geometry.dispose();
  object.material.dispose();
  game.scene.remove( object );
  

}





function removeObject3D(object3D) {
  if (!(object3D instanceof THREE.Object3D)) return false;

  // for better memory management and performance
  object3D.geometry.dispose();
  if (object3D.material instanceof Array) {
      // for better memory management and performance
      object3D.material.forEach(material => material.dispose());
  } else {
      // for better memory management and performance
      object3D.material.dispose();
  }
  object3D.removeFromParent(); // the parent might be the scene or another Object3D, but it is sure to be removed this way
  return true;
}



export { game }

//##########################################################################################################################
// GAMEPLAY FUNCTIONS
//##########################################################################################################################

// Character emotion system
function setCharacterEmotion(emotion, duration = 1000) {
    if (!game.characterMesh) return;
    
    // Reset all morph targets
    game.characterMesh.morphTargetInfluences[0] = 0; // happy
    game.characterMesh.morphTargetInfluences[1] = 0; // sad
    
    switch(emotion) {
        case 'happy':
            new TWEEN.Tween({value: 0})
                .to({value: 1}, duration)
                .onUpdate(function() {
                    if (game.characterMesh) {
                        game.characterMesh.morphTargetInfluences[0] = this.value;
                    }
                })
                .start();
            break;
        case 'sad':
            new TWEEN.Tween({value: 0})
                .to({value: 1}, duration)
                .onUpdate(function() {
                    if (game.characterMesh) {
                        game.characterMesh.morphTargetInfluences[1] = this.value;
                    }
                })
                .start();
            break;
        case 'neutral':
            // Already reset above
            break;
    }
}

// Click detection
function onObjectClick(event) {
    if (!game.isGameActive) return;
    
    event.preventDefault();
    
    // Calculate mouse position
    const rect = game.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycast to find clicked object
    raycaster.setFromCamera(mouse, game.camera);
    const intersects = raycaster.intersectObjects(game.board);
    
    if (intersects.length > 0) {
        handleObjectClick(intersects[0].object);
    }
}

// Mouse hover detection
let hoveredObject = null;
function onMouseMove(event) {
    if (!game.isGameActive) return;
    
    // Calculate mouse position
    const rect = game.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Raycast to find hovered object
    raycaster.setFromCamera(mouse, game.camera);
    const intersects = raycaster.intersectObjects(game.board);
    
    // Clear previous hover
    if (hoveredObject && hoveredObject.material) {
        hoveredObject.material.emissive.setHex(0x000000);
    }
    
    if (intersects.length > 0) {
        hoveredObject = intersects[0].object;
        if (hoveredObject.material) {
            hoveredObject.material.emissive.setHex(0x333333);
        }
        game.renderer.domElement.style.cursor = 'pointer';
    } else {
        hoveredObject = null;
        game.renderer.domElement.style.cursor = 'crosshair';
    }
}

function handleObjectClick(clickedObject) {
    if (!game.currentDesiredItem) return;
    
    const isCorrect = clickedObject.name === game.currentDesiredItem.name;
    
    if (isCorrect) {
        // Correct choice!
        const points = 10 + (game.combo * 2);
        game.score += points;
        game.combo++;
        setCharacterEmotion('happy');
        createClickEffect(clickedObject, 'correct');
        showNewDesire();
        
        // Play audio
        if (window.gameAudio) {
            if (game.combo > 3) {
                window.gameAudio.playCombo();
            } else {
                window.gameAudio.playCorrect();
            }
        }
        
        console.log(`✅ Correct! +${points} points (Combo: ${game.combo})`);
    } else {
        // Wrong choice!
        game.score = Math.max(0, game.score - 5);
        game.combo = 0;
        setCharacterEmotion('sad');
        createClickEffect(clickedObject, 'wrong');
        
        // Play audio
        if (window.gameAudio) {
            window.gameAudio.playWrong();
        }
        
        console.log(`❌ Wrong! -5 points (Combo reset)`);
    }
    
    updateScoreDisplay();
}

// Enhanced desire system
function showNewDesire() {
    console.log('🎯 showNewDesire called');
    console.log('game.mainmodel:', game.mainmodel);
    console.log('game.bubble:', game.bubble);
    
    if (!game.mainmodel || !game.bubble) {
        console.log('❌ Missing mainmodel or bubble');
        return;
    }
    
    // Clear previous desire
    if (game.currentitem) {
        console.log('Removing previous item from bubble');
        game.bubble.remove(game.currentitem);
        game.currentitem = null;
    }
    
    // Pick random snack type
    const randomSnack = game.mainmodel[Math.floor(Math.random() * game.mainmodel.length)];
    game.currentDesiredItem = randomSnack;
    
    console.log('Selected snack:', randomSnack.name);
    
    // Show in bubble
    const desireDisplay = randomSnack.clone();
    desireDisplay.scale.set(0.3, 0.3, 0.3); // Made slightly bigger
    desireDisplay.position.set(0, 0, 0);
    
    // Make sure it's visible
    desireDisplay.visible = true;
    
    game.bubble.add(desireDisplay);
    game.currentitem = desireDisplay;
    
    console.log('✅ Added to bubble:', desireDisplay);
    console.log('Bubble children count:', game.bubble.children.length);
    
    // Start desire timer (gets faster with level)
    const baseTime = Math.max(3, 7 - game.level * 0.5);
    game.desireTimeLeft = baseTime + Math.random() * 2;
    
    console.log(`🎯 Find: ${randomSnack.name} (${game.desireTimeLeft.toFixed(1)}s)`);
}

// Game update loop
function updateGame() {
    if (game.currentState === game.states.PLAYING) {
        updateDesireTimer();
        game.gameTime += game.dt / 1000;
        updateTimeDisplay();
        updateLevel();
    }
}

function updateDesireTimer() {
    if (!game.isGameActive || !game.desireTimeLeft) return;
    
    game.desireTimeLeft -= game.dt / 1000;
    
    if (game.desireTimeLeft <= 0) {
        // Time's up! Lose combo and show new desire
        game.combo = 0;
        setCharacterEmotion('sad');
        showNewDesire();
        console.log('⏰ Time up! Combo reset');
    }
    
    // Flash bubble when time running out
    if (game.desireTimeLeft < 2 && game.bubble) {
        const flash = Math.sin(Date.now() * 0.01) > 0 ? 1 : 0.7;
        if (game.bubble.material) {
            game.bubble.material.opacity = flash;
        }
    }
    
    updateDesireTimerDisplay();
}

function updateLevel() {
    const newLevel = Math.floor(game.score / 100) + 1;
    if (newLevel > game.level) {
        game.level = newLevel;
        console.log(`🆙 Level ${game.level}! Faster gameplay!`);
    }
}

// Visual effects
function createClickEffect(object, type) {
    // Flash the clicked object
    if (!object.material) return;
    
    const originalColor = object.material.color ? object.material.color.clone() : new THREE.Color(0xffffff);
    const flashColor = type === 'correct' ? 0x00ff00 : 0xff0000;
    
    if (object.material.color) {
        object.material.color.setHex(flashColor);
        
        setTimeout(() => {
            if (object.material && object.material.color) {
                object.material.color.copy(originalColor);
            }
        }, 200);
    }
    
    // Create particles
    createParticleEffect(object.position, type);
}

function createParticleEffect(position, type) {
    const geometry = new THREE.SphereGeometry(0.5, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
        color: type === 'correct' ? 0x00ff00 : 0xff0000,
        transparent: true
    });
    
    for (let i = 0; i < 8; i++) {
        const particle = new THREE.Mesh(geometry, material.clone());
        particle.position.copy(position);
        particle.position.add(new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        ));
        game.scene.add(particle);
        
        // Animate particle
        new TWEEN.Tween(particle.material)
            .to({opacity: 0}, 1000)
            .onComplete(() => {
                game.scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            })
            .start();
            
        new TWEEN.Tween(particle.position)
            .to({
                x: particle.position.x + (Math.random() - 0.5) * 20,
                y: particle.position.y + Math.random() * 10,
                z: particle.position.z + (Math.random() - 0.5) * 20
            }, 1000)
            .start();
    }
}

// Game control functions
function startGame() {
    console.log('🎮 Starting game...');
    
    game.currentState = game.states.PLAYING;
    game.isGameActive = true;
    game.score = 0;
    game.gameTime = 0;
    game.combo = 0;
    game.level = 1;
    
    setCharacterEmotion('neutral');
    
    // Wait a bit for everything to load, then show desire
    setTimeout(() => {
        console.log('Attempting to show first desire...');
        showNewDesire();
    }, 1000);
    
    showGameUI();
    
    console.log('🎮 Game Started!');
}

// Test function to manually trigger desire
function testDesire() {
    console.log('🧪 Testing desire system...');
    showNewDesire();
}

// Make test function available globally for debugging
window.testDesire = testDesire;

// UI Functions
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) {
        scoreElement.textContent = game.score;
    }
    
    const comboElement = document.getElementById('combo-display');
    const comboCount = document.getElementById('combo-count');
    if (comboElement && comboCount) {
        comboCount.textContent = game.combo;
        comboElement.style.display = game.combo > 1 ? 'block' : 'none';
    }
    
    const levelElement = document.getElementById('level-display');
    if (levelElement) {
        levelElement.textContent = game.level;
    }
}

function updateTimeDisplay() {
    const timeElement = document.getElementById('time-display');
    if (timeElement) {
        timeElement.textContent = Math.floor(game.gameTime);
    }
}

function updateDesireTimerDisplay() {
    const timerBar = document.getElementById('timer-bar');
    if (timerBar && game.desireTimeLeft) {
        const maxTime = 7;
        const percentage = Math.max(0, (game.desireTimeLeft / maxTime) * 100);
        timerBar.style.width = percentage + '%';
        
        // Change color based on time left
        if (percentage > 50) {
            timerBar.style.background = '#00ff00';
        } else if (percentage > 25) {
            timerBar.style.background = '#ffff00';
        } else {
            timerBar.style.background = '#ff0000';
        }
    }
}

function showGameUI() {
    const gameUI = document.getElementById('game-ui');
    const startMenu = document.getElementById('start-menu');
    
    if (gameUI) gameUI.style.display = 'block';
    if (startMenu) startMenu.style.display = 'none';
}

// Make functions available globally
window.startGame = startGame;
window.setCharacterEmotion = setCharacterEmotion;



















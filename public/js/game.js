

console.log('game.js loaded')



import * as THREE from "three";
import { OrbitControls } from 'three/addons/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/jsm/loaders/GLTFLoader.js';
//import { TWEEN } from 'three/addons/jsm/libs/tween.module.js'
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
game.currentscene = new THREE.Group()

//##########################################################################################################################
//##########################################################################################################################


game.init = function () {


  game.scene = new THREE.Scene();
  game.scene.background = new THREE.Color(0xe0e0e0);;
  game.scene.fog = new THREE.Fog(0xe0e0e0, 100, 1000);
  game.renderer = new THREE.WebGLRenderer({ antialias: true });

  // game.projector = projector = new THREE.Projector();
  game.clock = new THREE.Clock();
  game.player = ''
  game.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
  game.camera.position.set(-16, 6, 26);


  game.renderer.setSize(window.innerWidth, window.innerHeight);
  game.renderer.outputEncoding = THREE.sRGBEncoding;
  game.renderer.setPixelRatio(window.devicePixelRatio);
  document.getElementById('mainscene').appendChild(game.renderer.domElement);


  //document.body.appendChild(game.renderer.domElement);


  window.addEventListener('resize', function () {
    game.camera.aspect = window.innerWidth / window.innerHeight;
    game.camera.updateProjectionMatrix();
    game.renderer.setSize(window.innerWidth, window.innerHeight);

  }, false);



  //game.init_controlls();

  game.create_scene();
 //scenes.scene1(scenes.scene2); 
 
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
var isdone = true;

function tweencamera(){


  
 var mesh = get_random_kid(game.board);

  var dis = getDistance(game.camera.position,mesh.position)
  console.log(dis)
  var maxtime = (dis*50)/1000;
  console.log(maxtime);



  var from = { 
    x:game.camera.position.x, 
    y:game.camera.position.y,
    z:game.camera.position.z,
    rx: 0

  }

  var to   = {  
      x: mesh.position.x,
      y: mesh.position.y+75,
      z: mesh.position.z,
      rx: -Math.PI * 0.5


  }

 


new TWEEN.Tween(from)

      .to(to,maxtime*1000)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function(){
        game.camera.position.set(from.x, from.y,from.z);

        if(isdone){        game.camera.rotation.x = from.rx; }
      
     
      }).start()
      
      .onComplete(function() {
        isdone=false;
        console.log('done!')
        setTimeout(() => {
          
          tweencamera();

        }, 2000);
       

      });
      ;

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


    var amount = 1000;
    var row = 1;
    var col = 1;
    game.board = [];
    for(var i=1; i<=amount; i++){

      var randomkid = kids[Math.floor(Math.random()*kids.length)]
      var newkid = randomkid.clone()
      newkid.position.set((row*20),0,(col*20));
      game.scene.add(newkid);
      game.board.push(newkid);
      row=row+1;
      if (row>=10){

        row=0;
        col=col+1;
      }
      
      rotatemesh(newkid,i)
   

     


    }
    






     $('#loading_div').delay(1).fadeOut(400)
    
     tweencamera(); 	

        });


      }








//##########################################################################################################################
//##########################################################################################################################
game.currentitem = ""
function itemtoeat(){



  //if(game.board){console.log(game.board);};

  if(game.bubble){

    if(game.mainmodel){

      

      if (game.currentitem != ""){ game.scene.remove(game.currentitem);};



      var kids = game.mainmodel;
      var randomkid = kids[Math.floor(Math.random()*kids.length)]
      console.log(randomkid)
     // var newkid = randomkid.clone()
      let pos = game.bubble.position
     
//     game.bubble.add(newkid);
     var sc = 0.1
  //   newkid.scale.set(sc,sc,sc)
  //   newkid.position.set(0,0,0);
   //   console.log(game.bubble.position)
   //   game.currentitem=newkid;




    }

  




  }




  setInterval(() => {
    
    itemtoeat();
  }, 5000);




}




//##########################################################################################################################
//##########################################################################################################################

function loadscene2(){

    
  //makecube();
  var loader = new GLTFLoader();
      loader.load('./js/keyshapetest1.glb', function (gltf) {

        console.log(gltf)
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


        var objmorph = object.children[2].children[0]

        let options={morph:0};
        let gui= new GUI();
        let morphChange=()=>{
          objmorph.morphTargetInfluences[0]=options.morph;
        };
        let morphChange2=()=>{
          objmorph.morphTargetInfluences[1]=options.morph;
        };

        gui.add(options,'morph',0,1).onChange(morphChange);
        gui.add(options,'morph',0,1).onChange(morphChange2);


        game.bubble = object.children[1];


        itemtoeat();


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



















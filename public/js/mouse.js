

import * as THREE from './three/build/three.module.js';
  



/*
  function getMousePos(e) {
    //  console.log(e.clientX, e.clientY)
    return { x: e.clientX, y: e.clientY };
  }


var root = '';

var mouseDown = false,
        mouseX = 0,
        mouseY = 0;





    function onMouseMove(evt) {
        if (mouseDown) {
            return;
        }

        evt.preventDefault();

        var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
       // console.log(root)
        rotateScene(deltaX, deltaY);
    }




    function onMouseDown(evt) {
        evt.preventDefault();

        mouseDown = true;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }

    function onMouseUp(evt) {
        evt.preventDefault();

        mouseDown = false;
    }





    function addMouseHandler(obj) {

        root=obj;
    document.addEventListener('mousemove', function (e) {
        
        onMouseMove(e);
    }, false);




    document.addEventListener('mousedown', function (e) {
        onMouseDown(e);
        console.log('mouse down')
    }, false);




    document.addEventListener('mouseup', function (e) {
        onMouseUp(e);
        console.log('mouse up')
    }, false);
}





    function rotateScene(deltaX, deltaY) {

    var thex =root.rotation.x

    if(thex> 5.75 && thex < 6.2 ){
       // 
     

    }

    
    root.rotation.x += deltaY / 100;
  //  root.rotation.y +=  deltaX / 100;
    console.log("X: ",root.rotation.x)
    //) 5.75 , 6.8
}

*/

function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
 }


function lookatobj(obj){

var plane = new THREE.Plane(new THREE.Vector3(0, 0, 10), -10);
var mouse = new THREE.Vector2()
var raycaster = new THREE.Raycaster()
var pointOfIntersection = new THREE.Vector3();

function onMouseMove(event){
    mouse.x = -( event.clientX / window.innerWidth ) * 2 + 1;
     mouse.y =  ( event.clientY / window.innerHeight ) * 2 - 1;
    raycaster.setFromCamera(mouse, game.camera);
    raycaster.ray.intersectPlane(plane, pointOfIntersection);
    console.log(pointOfIntersection);

 
    
    obj.lookAt(pointOfIntersection);
   // rotateObject(obj, 0, 0, 90);
  }



  document.addEventListener("mousemove", onMouseMove, false);


  
}



/////////////////////////////////////////////////////////////








export {lookatobj}






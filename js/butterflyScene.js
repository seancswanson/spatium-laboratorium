if (typeof butterflyScene !== 'object') {
  butterflyScene = {
    butterfly: null
  };
}


//----------
// Initialize scene, camera, objects and renderer.
butterflyScene.init = () => {
  butterflyScene.flapFactor = 0;
  // Set up the environment scene and color it.
  App.scene = new THREE.Scene();
  App.scene.background = new THREE.Color(0xababab);

  // Set up the camera and position it.
  App.camera = new THREE.PerspectiveCamera(30, (window.innerWidth - 200) / window.innerHeight, 1, 1000);
  App.camera.position.set(0, 5, 30);

  // Set up the renderer and size it.
  App.renderer = new THREE.WebGLRenderer();
  App.renderer.setSize(App.canvasDimensions.width, App.canvasDimensions.height);

  App.controls = new THREE.OrbitControls( App.camera );

  //controls.update() must be called after any manual changes to the camera's transform
  App.camera.position.set( 0, 20, 100 );
  App.controls.update();

  var light = new THREE.AmbientLight( 0x404040 ); // soft white light
  App.scene.add( light );

  // Attach the canvas to the DOM.
  App.canvasContainer.appendChild(App.renderer.domElement);

  butterflyScene.createButterfly();
};

//----------
butterflyScene.mainLoop = () => {
  App.butterflyLoopId = requestAnimationFrame(butterflyScene.mainLoop);

  let leftWing = butterfly.geometry.vertices[2];
  let rightWing = butterfly.geometry.vertices[3];

  leftWing.y += butterflyScene.flapFactor;
  rightWing.y += butterflyScene.flapFactor;

  butterfly.geometry.verticesNeedUpdate = true;

  if (leftWing.y >= 5 || leftWing.y <= -4) {
    butterflyScene.flapFactor *= -1;
  }

  App.controls.update();
  App.renderer.render(App.scene, App.camera);
};

//----------
butterflyScene.createButterfly = () => {
  butterflyScene.flapFactor = 0.3;
  // Geometry takes in width, height, depth values, depending on the shape.
  let geometry = new THREE.Geometry();

  geometry.vertices.push( new THREE.Vector3(0, 0, 0));
  geometry.vertices.push( new THREE.Vector3(5, 0, 0));
  geometry.vertices.push( new THREE.Vector3(2, 4, 3));
  geometry.vertices.push( new THREE.Vector3(2, 4, -3));

  // Make Wing face
  geometry.faces.push( new THREE.Face3(0, 1, 2));
  geometry.faces.push( new THREE.Face3(0, 1, 3));
  // Material takes in an object to configure the geometry's appearance.
  let material = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide, vertexColors: THREE.FaceColors} );

  for (let i = 0; i < geometry.faces.length; i++) {
    let face = geometry.faces[i];
    face.color.setHex(Math.random() * 0xffffff);
    for (let j = 0; j < 3; j++) {
      color = new THREE.Color( 0xffffff );
      color.setHex(Math.random() * 0xffffff);
      face.vertexColors[j] = color;
    }
  }

  // Assign a new Mesh object to the shape variable and pass in geometry and material.
  butterfly = new THREE.Mesh(geometry, material);
  butterfly.dynamic = true;
  butterfly.geometry.colorsNeedUpdate = true;

  butterfly.rotation.z = 0.7;
  butterfly.rotation.x = 0.6;

  // Add it to the scene.
  App.scene.add(butterfly);
};

//----------
butterflyScene.init();
butterflyScene.mainLoop();

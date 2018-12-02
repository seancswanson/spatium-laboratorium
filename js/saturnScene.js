/* global saturnScene, planetBody, THREE */

if (typeof saturnScene !== 'object') {
  saturnScene = {
    rings: [],
    cameraSpeedFactor: 0.03
  };
}

//----------
// Initialize scene, camera, objects and renderer.
saturnScene.init = () => {
  // Set up the environment scene and color it.
  App.scene = new THREE.Scene();
  App.scene.background = new THREE.Color(0xababab);

  // Set up the camera and position it.
  App.camera = new THREE.PerspectiveCamera(
    30,
    (window.innerWidth - 200) / window.innerHeight,
    1,
    1000
  );
  App.camera.position.set(0, 5, 100);

  // Set up the renderer and size it.
  App.renderer = new THREE.WebGLRenderer();
  App.renderer.setSize(App.canvasDimensions.width, App.canvasDimensions.height);

  App.controls = new THREE.OrbitControls(App.camera);

  //controls.update() must be called after any manual changes to the camera's transform
  App.camera.position.set(0, 20, 100);
  App.controls.update();

  // Attach the canvas to the DOM.
  App.canvasContainer.appendChild(App.renderer.domElement);

  saturnScene.createSaturnMass();
  saturnScene.createSaturnRings();
};

//----------
saturnScene.mainLoop = () => {
  App.saturnLoopId = requestAnimationFrame(saturnScene.mainLoop);

  App.camera.position.y += 2 * saturnScene.cameraSpeedFactor;
  App.camera.position.z += 3 * saturnScene.cameraSpeedFactor;

  if (App.camera.position.y <= 10 || App.camera.position.y >= 30) {
    saturnScene.cameraSpeedFactor *= -1;
  }

  saturnScene.rings.forEach(ring => (ring.rotation.x *= 1));

  App.controls.update();
  App.renderer.render(App.scene, App.camera);
};

//----------
saturnScene.createSaturnMass = () => {
  // Geometry takes in width, height, depth values, depending on the shape.
  let geometry = new THREE.SphereGeometry(10, 30, 30);
  // Material takes in an object to configure the geometry's appearance.
  let material = new THREE.MeshNormalMaterial({ wireframe: true });

  // Assign a new Mesh object to the shape variable and pass in geometry and material.
  planetBody = new THREE.Mesh(geometry, material);

  // Add it to the scene.
  App.scene.add(planetBody);
};

//----------
saturnScene.createSaturnRings = () => {
  let radius = 13;
  let tubeRadius = 2;

  for (let i = 0; i < 3; i++) {
    let geometry = new THREE.TorusGeometry(
      App.randomInRange(radius - 0.3, radius + 0.4),
      tubeRadius,
      2,
      50
    );
    let material = new THREE.MeshNormalMaterial({ color: 0xff0000 });
    let ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = 80.2;
    ring.rotation.y = 3;

    radius += 5;
    saturnScene.rings.push(ring);
    App.scene.add(ring);
  }
};

//----------
saturnScene.init();
saturnScene.mainLoop();

if (typeof donutScene !== 'object') {
  donutScene = {
    torus: null,
    donuts: [],
    floor: null,
    spinFactor: 0.03,
    fallFactor: 0.05,
    loader: new THREE.FontLoader(),
    clickPrompt: App.donutClickPrompt
  };
}

// //----------
// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
// 	var geometry = new THREE.TextGeometry( 'Click to Make it Rain!', {
// 		font: font,
// 		size: 80,
// 		height: 5,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 10,
// 		bevelSize: 8,
// 		bevelSegments: 5
// 	} );
// } );

//----------
// Initialize scene, camera, objects and renderer.
donutScene.init = () => {
  donutScene.startDonutAnimation = false;
  donutScene.showClickPrompt();

  // Set up the environment scene and color it.
  App.scene = new THREE.Scene();
  App.scene.background = new THREE.Color(0xababab);

  // Set up the camera and position it.
  App.camera = new THREE.PerspectiveCamera(
    45,
    (window.innerWidth - 200) / window.innerHeight,
    1,
    1000
  );

  // Set up the renderer and size it.
  App.renderer = new THREE.WebGLRenderer();
  App.renderer.setSize(App.canvasDimensions.width, App.canvasDimensions.height);

  App.controls = new THREE.OrbitControls(App.camera);
  App.controls.minDistance = 10;
  App.controls.maxDistance = 170;
  App.controls.enablePan = false;
  // How far you can orbit vertically, upper and lower limits.
  // Range is 0 to Math.PI radians.
  App.controls.minPolarAngle = 0; // radians
  App.controls.maxPolarAngle = Math.PI / 2; // radians

  // How far you can orbit horizontally, upper and lower limits.
  // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
  App.controls.minAzimuthAngle = -Infinity; // radians
  App.controls.maxAzimuthAngle = Infinity; // radians

  App.camera.position.set(0, 8.5, 60);
  App.controls.update();

  donutScene.createFloor();
  donutScene.createDonutSkyDome();
  donutScene.handleClickPromptClick();
  // Attach the canvas to the DOM.
  App.canvasContainer.appendChild(App.renderer.domElement);
};

//----------
donutScene.mainLoop = () => {
  App.donutLoopId = requestAnimationFrame(donutScene.mainLoop);

  if (donutScene.startDonutAnimation) {
    let x = donutScene.throttleDonuts();

    if (x) {
      donutScene.createDonuts();
    }

    donutScene.donuts.forEach((donut, index) => {
      donut.donut.position.y -= 1 * donutScene.fallFactor;

      if (donut.rotateCW) {
        donut.donut.rotation.y -= 1 * donutScene.spinFactor;
      } else {
        donut.donut.rotation.y += 1 * donutScene.spinFactor;
      }

      if (donut.donut.position.y <= -20) {
        donutScene.donuts.splice(donutScene.donuts.indexOf(donut), 1);
        App.scene.remove(donut);
        donut.donut.geometry.dispose();
        donut.donut.material.dispose();
      }
    });
  }

  App.renderer.render(App.scene, App.camera);
};

//----------
donutScene.createDonuts = () => {
  // Geometry takes in width, height, depth values, depending on the shape.
  let geometry = new THREE.TorusGeometry(
    App.randomInRange(1.7, 2.5),
    1,
    30,
    50
  );
  // Material takes in an object to configure the geometry's appearance.
  let material = new THREE.MeshBasicMaterial({ color: App.getRandomColor() });

  // Assign a new Mesh object to the shape variable and pass in geometry and material.
  donutScene.torus = new THREE.Mesh(geometry, material);
  donutScene.torus.position.set(
    App.randomInRange(-120, 120),
    App.randomInRange(40, 50),
    App.randomInRange(-120, 120)
  );

  donutScene.torus.rotation.y += App.randomInRange(-2, 1);

  // Add it to the scene.
  App.scene.add(donutScene.torus);
  donutScene.donuts.push({
    donut: donutScene.torus,
    rotateCW: Math.random() < 0.5
  });
};

//----------
donutScene.createFloor = () => {
  var texture = new THREE.TextureLoader().load(
    '../img/textures/grass.jpg',
    function(texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.offset.set(0, 0);
      texture.repeat.set(4, 4);
    }
  );
  let geometry = new THREE.PlaneGeometry(300, 300);
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  donutScene.floor = new THREE.Mesh(geometry, material);
  App.scene.add(donutScene.floor);
  donutScene.floor.position.set(0, -10, 0);
  donutScene.floor.rotation.set(Math.PI / 2, 0, 0);
};

//----------
donutScene.createDonutSkyDome = () => {
  let geometry = new THREE.SphereGeometry(400, 60, 40);

  let uniforms = {
    texture: {
      type: 't',
      value: new THREE.TextureLoader().load('../img/textures/sky.jpg')
    }
  };

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById('sky-vertex').textContent,
    fragmentShader: document.getElementById('sky-fragment').textContent
  });

  donutScene.skybox = new THREE.Mesh(geometry, material);
  donutScene.skybox.material.side = THREE.BackSide;
  donutScene.skybox.scale.set(1, -1, 1);
  donutScene.skybox.rotation.order = 'XYZ';
  donutScene.skybox.renderDepth = 1000.0;
  App.scene.add(donutScene.skybox);
};

//----------
donutScene.handleClickPromptClick = event => {
  donutScene.clickPrompt.addEventListener('click', function(event) {
    donutScene.startDonutAnimation = true;
    event.target.classList.add('hidden');
  });
};

//----------
donutScene.showClickPrompt = () => {
  donutScene.clickPrompt.classList.remove('hidden');
};

//----------
donutScene.throttleDonuts = () => Math.random() < 0.03;

//----------
donutScene.init();
donutScene.mainLoop();

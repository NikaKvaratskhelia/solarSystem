import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Textures
import sunTexture from "./assets/sunmap.jpg";
import mercuryTexture from "./assets/mercurymap.jpg";
import venusTexture from "./assets/venusmap.jpg";
import earthTexture from "./assets/earthmap1k.jpg";
import marsTexture from "./assets/marsmap1k.jpg";
import jupiterTexture from "./assets/jupitermap.jpg";
import saturnTexture from "./assets/saturnmap.jpg";
import saturnRingTexture from "./assets/saturnringcolor.jpg";
import uranusTexture from "./assets/uranusmap.jpg";
import uranusRingTexture from "./assets/uranusringcolour.jpg";
import neptuneTexture from "./assets/neptunemap.jpg";
import moonTexture from "./assets/moon.webp";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(50, 50);
camera.position.setZ(30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//renderer responsivness
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const sunLight = new THREE.PointLight(0xfff5f2, 5, 2000);
sunLight.position.set(0, 0, 0);
sunLight.decay = 0.5;
sunLight.castShadow = true;
scene.add(sunLight);
const lightHelper = new THREE.PointLightHelper(sunLight);
scene.add(lightHelper);

// Starfield background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.4,
  sizeAttenuation: true,
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 1500;
  const y = (Math.random() - 0.5) * 1500;
  let z = (Math.random() - 0.5) * 2000;

  starVertices.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// Planets creation
const textureLoader = new THREE.TextureLoader();

// sun
const sunGeo = new THREE.SphereGeometry(16, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

//moon
const moonGeo = new THREE.SphereGeometry(1.6, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({
  map: textureLoader.load(moonTexture),
});
const moon = new THREE.Mesh(moonGeo, moonMat);

const moonObj = new THREE.Object3D();
moonObj.add(moon);

// Create planets with initial angles
const mercury = createPlanet(
  3.2,
  mercuryTexture,
  28,
  null,
  Math.random() * Math.PI * 2
);
const venus = createPlanet(
  5.8,
  venusTexture,
  44,
  null,
  Math.random() * Math.PI * 2
);
const earth = createPlanet(
  6,
  earthTexture,
  62,
  null,
  Math.random() * Math.PI * 2
);
const mars = createPlanet(
  4,
  marsTexture,
  78,
  null,
  Math.random() * Math.PI * 2
);
const jupiter = createPlanet(
  12,
  jupiterTexture,
  100,
  null,
  Math.random() * Math.PI * 2
);
const saturn = createPlanet(
  10,
  saturnTexture,
  138,
  {
    ring: true,
    ringInnersize: 10,
    ringOutersize: 20,
    texture: saturnRingTexture,
  },
  Math.random() * Math.PI * 2
);
const uranus = createPlanet(
  7,
  uranusTexture,
  176,
  {
    ring: true,
    ringInnersize: 7,
    ringOutersize: 12,
    texture: uranusRingTexture,
  },
  Math.random() * Math.PI * 2
);
const neptune = createPlanet(
  7,
  neptuneTexture,
  200,
  null,
  Math.random() * Math.PI * 2
);

earth.mesh.add(moonObj);
moon.position.set(10, 0, 0);

// Add orbit rings for each planet
createOrbitRing(28); // Mercury
createOrbitRing(44); // Venus
createOrbitRing(62); // Earth
createOrbitRing(78); // Mars
createOrbitRing(100); // Jupiter
createOrbitRing(138); // Saturn
createOrbitRing(176); // Uranus
createOrbitRing(200); // Neptune
createOrbitRing(10); // Moon

const moonOrbit = new THREE.RingGeometry(10, 10.1, 64);
const moonOrbitMat = new THREE.MeshBasicMaterial({
  color: 0x666666,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.3,
});
const moonOrbitRing = new THREE.Mesh(moonOrbit, moonOrbitMat);
moonOrbitRing.rotation.x = Math.PI / 2;
earth.mesh.add(moonOrbitRing);

// renderer in the end so everything renders properly
animate();

//Functions

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Rotate planets
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  moon.rotateY(0.01);

  // Orbit planets

  mercury.obj.rotateY(0.03);
  venus.obj.rotateY(0.015);
  earth.obj.rotateY(0.009);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.002);
  saturn.obj.rotateY(0.0009);
  uranus.obj.rotateY(0.0004);
  neptune.obj.rotateY(0.0001);
  moonObj.rotateY(0.003);

  renderer.render(scene, camera);
}

function createOrbitRing(radius) {
  const orbitGeo = new THREE.RingGeometry(radius, radius + 0.3, 128);
  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0x666666,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1,
  });
  const orbitRing = new THREE.Mesh(orbitGeo, orbitMat);
  orbitRing.rotation.x = Math.PI / 2;
  scene.add(orbitRing);
}

function createPlanet(size, texture, position, ring, initialAngle = 0) {
  const geo = new THREE.SphereGeometry(size, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
    metalness: 0,
    roughness: 0.8,
    receiveShadow: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  mesh.position.x = position;

  if (initialAngle) {
    obj.rotation.y = initialAngle;
  }

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.ringInnersize,
      ring.ringOutersize,
      32
    );
    const ringMat = new THREE.MeshStandardMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
    obj.add(ringMesh);
  }

  scene.add(obj);
  return { mesh, obj };
}

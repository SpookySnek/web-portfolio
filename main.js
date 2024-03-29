import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Init
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 40;
camera.position.x = -3;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
const loader = new THREE.TextureLoader();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Resize handler
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Ring
const geometry = new THREE.TorusGeometry(10, 0.9, 16, 100);
const material = new THREE.MeshPhongMaterial({
  color: 0xc5b358,
  shininess: 100,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lightning
const pointLight = new THREE.PointLight(0xa020f0);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

// Stars
function addStar() {
  const star = new THREE.Mesh(starGeometry, starMaterial);
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(250));

  star.position.set(x, y, z);
  scene.add(star);
}
Array(500).fill().forEach(addStar);

// Background
const spaceBackground = loader.load("./spacebg.jpg");
scene.background = spaceBackground;

// Face
const carlTexture = loader.load("./carl.jpg");
const carl = new THREE.Mesh(
  new THREE.CircleGeometry(2, 64),
  new THREE.MeshBasicMaterial({ map: carlTexture, side: THREE.DoubleSide })
);
scene.add(carl);

// Mars
const marsTexture = loader.load("./mars.jpg");
const normalTexture = loader.load("./normal.jpg");

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normalTexture,
  })
);
scene.add(mars);

// Positioning
mars.position.z = 30;
mars.position.x = -10;

carl.position.z = -5;
carl.position.x = 2;

// Scroll Animation
function scrollCamera() {
  const t = document.body.getBoundingClientRect().top;
  mars.rotation.x += 0.005;
  mars.rotation.y += 0.0035;
  mars.rotation.z += 0.005;

  carl.rotation.y += 0.005;

  torus.rotation.x += 0.008;
  torus.rotation.y += 0.006;
  torus.rotation.z += 0.008;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0001;
  camera.rotation.y = t * -0.0001;
}

document.body.onscroll = scrollCamera;
scrollCamera();

// Scroll to top button logic
const scrollToTopBtn = document.getElementById("scrollToTopBtn");
const rootElement = document.documentElement;
function scrollToTop() {
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
scrollToTopBtn.addEventListener("click", scrollToTop);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.007;
  // torus.rotation.y += 0.003;
  // torus.rotation.z += 0.007;
  torus.rotateX(0.007);
  torus.rotateY(0.003);
  torus.rotateZ(0.004);

  mars.rotation.x += 0.0008;
  mars.rotation.y += 0.0025;
  mars.rotation.z += 0.0003;

  carl.rotation.y += 0.004;

  renderer.render(scene, camera);
}

animate();

// =========================================================
// BASIC SCENE SETUP
// =========================================================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(0, 60, 160);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

const planetLabel = document.getElementById("planetLabel");
const planetInfoBox = document.getElementById("planetInfo");
const tourBtn = document.getElementById("autoTourBtn");

// =========================================================
// LIGHTING
// =========================================================
scene.add(new THREE.AmbientLight(0x333333));

const sunLight = new THREE.PointLight(0xffffff, 2.5, 1000);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// =========================================================
// STARFIELD
// =========================================================
(function createStarfield() {
  const geo = new THREE.BufferGeometry();
  const count = 4500;
  const pos = [];

  for (let i = 0; i < count; i++) {
    pos.push((Math.random() - 0.5) * 1800);
    pos.push((Math.random() - 0.5) * 1800);
    pos.push((Math.random() - 0.5) * 1800);
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
  scene.add(new THREE.Points(geo, mat));
})();

// =========================================================
// TEXTURE LOADER
// =========================================================
const loader = new THREE.TextureLoader();

// =========================================================
// DATA STRUCTURES
// =========================================================
const planets = [];
const tourBodies = []; // sun + planets

function showBodyInfo(body) {
  planetLabel.textContent = body.name;
  planetInfoBox.style.display = "block";

  planetInfoBox.innerHTML = `
    <b>${body.name}</b><br><br>
    Distance: ${body.info.distance}<br>
    Orbital Period: ${body.info.orbital}<br>
    Rotation Period: ${body.info.rotation}<br>
    Moons: ${body.info.moons}
  `;
}

// =========================================================
// CREATE SUN
// =========================================================
const sunMesh = new THREE.Mesh(
  new THREE.SphereGeometry(8, 64, 64),
  new THREE.MeshBasicMaterial({ map: loader.load("Textures/sun.jpg") })
);
scene.add(sunMesh);

const sunBody = {
  name: "Sun",
  mesh: sunMesh,
  group: null,
  info: {
    distance: "Center",
    orbital: "—",
    rotation: "25 days",
    moons: "—"
  },
  orbitSpeed: 0,
  rotateSpeed: 0.01
};

tourBodies.push(sunBody);

// =========================================================
// PLANET CREATOR
// =========================================================
function createPlanet(data) {
  const group = new THREE.Group();

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(data.radius, 48, 48),
    new THREE.MeshStandardMaterial({ map: loader.load(data.texture) })
  );
  mesh.position.x = data.distance;

  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * data.distance, 0, Math.sin(a) * data.distance));
  }

  const orbit = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true })
  );

  if (data.ring) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(data.ring.inner, data.ring.outer, 64),
      new THREE.MeshBasicMaterial({
        map: loader.load(data.ring.texture),
        side: THREE.DoubleSide,
        transparent: true
      })
    );
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);
  }

  group.add(mesh);
  group.add(orbit);
  scene.add(group);

  const body = {
    name: data.name,
    mesh,
    group,
    info: data.info,
    orbitSpeed: data.speed,
    rotateSpeed: data.rotate,
    originalOrbitSpeed: data.speed,
    originalRotateSpeed: data.rotate
  };

  planets.push(body);
  tourBodies.push(body);
}

// =========================================================
// PLANET DATA
// =========================================================
const planetData = [
  { name: "Mercury", texture: "Textures/mercury.jpg", radius: 1, distance: 14, speed: 0.004, rotate: 0.01,
    info: { distance: "0.39 AU", orbital: "88 days", rotation: "1407 hours", moons: "0" } },

  { name: "Venus", texture: "Textures/venus.jpg", radius: 1.4, distance: 20, speed: 0.0035, rotate: 0.008,
    info: { distance: "0.72 AU", orbital: "225 days", rotation: "5832 hours", moons: "0" } },

  { name: "Earth", texture: "Textures/earth.jpg", radius: 1.6, distance: 26, speed: 0.003, rotate: 0.02,
    info: { distance: "1.00 AU", orbital: "365 days", rotation: "24 hours", moons: "1" } },

  { name: "Mars", texture: "Textures/mars.jpg", radius: 1.2, distance: 32, speed: 0.0028, rotate: 0.018,
    info: { distance: "1.52 AU", orbital: "687 days", rotation: "24.6 hours", moons: "2" } },

  { name: "Jupiter", texture: "Textures/jupiter.jpg", radius: 4, distance: 45, speed: 0.002, rotate: 0.03,
    info: { distance: "5.20 AU", orbital: "4333 days", rotation: "10 hours", moons: "79" } },

  { name: "Saturn", texture: "Textures/saturn.jpg", radius: 3.5, distance: 58, speed: 0.0018, rotate: 0.028,
    ring: { inner: 5, outer: 8, texture: "Textures/saturn_ring.png" },
    info: { distance: "9.58 AU", orbital: "10759 days", rotation: "10.7 hours", moons: "82" } },

  { name: "Uranus", texture: "Textures/uranus.jpg", radius: 2.7, distance: 70, speed: 0.0015, rotate: 0.022,
    info: { distance: "19.2 AU", orbital: "30687 days", rotation: "17 hours", moons: "27" } },

  { name: "Neptune", texture: "Textures/neptune.jpg", radius: 2.7, distance: 82, speed: 0.0012, rotate: 0.02,
    info: { distance: "30.1 AU", orbital: "60190 days", rotation: "16 hours", moons: "14" } }
];

planetData.forEach(createPlanet);

// =========================================================
// CLICK-TO-ZOOM
// =========================================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", (e) => {
  if (e.target.id === "autoTourBtn") return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(tourBodies.map((b) => b.mesh));
  if (hits.length > 0) {
    stopAutoTour();
    const body = tourBodies.find((b) => b.mesh === hits[0].object);
    zoomToBody(body, false);
  }
});

// =========================================================
// ZOOM HELPER
// =========================================================
function zoomToBody(body, fromTour) {
  controls.enabled = false;

  const worldPos = new THREE.Vector3();
  body.mesh.getWorldPosition(worldPos);

  const r = body.mesh.geometry.parameters.radius;
  const targetPos = worldPos.clone().add(new THREE.Vector3(0, r * 2, r * 4));

  gsap.to(camera.position, {
    x: targetPos.x,
    y: targetPos.y,
    z: targetPos.z,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => camera.lookAt(worldPos),
    onComplete: () => {
      controls.target.copy(worldPos);
      controls.enabled = true;
      showBodyInfo(body);
    }
  });
}

// =========================================================
// AUTO TOUR TOGGLE
// =========================================================
let autoTourActive = false;
let autoIndex = 0;

function slowDownPlanets() {
  planets.forEach((p) => {
    p.orbitSpeed = p.originalOrbitSpeed * 0.1;
    p.rotateSpeed = p.originalRotateSpeed * 0.1;
  });
}

function restorePlanetSpeeds() {
  planets.forEach((p) => {
    p.orbitSpeed = p.originalOrbitSpeed;
    p.rotateSpeed = p.originalRotateSpeed;
  });
}

function runTourStep() {
  if (!autoTourActive) return;

  slowDownPlanets();

  const body = tourBodies[autoIndex];
  zoomToBody(body, true);

  setTimeout(() => {
    if (!autoTourActive) return;
    restorePlanetSpeeds();
    autoIndex = (autoIndex + 1) % tourBodies.length;
    runTourStep();
  }, 4500);
}

function toggleAutoTour() {
  autoTourActive = !autoTourActive;

  if (autoTourActive) {
    tourBtn.textContent = "Stop Auto Tour";
    autoIndex = 0;
    runTourStep();
  } else {
    tourBtn.textContent = "Start Auto Tour";
    restorePlanetSpeeds();
  }
}

tourBtn.addEventListener("click", toggleAutoTour);

window.addEventListener("keydown", (e) => {
  if (e.key === "t" || e.key === "T") toggleAutoTour();
});

// =========================================================
// RIGHT-CLICK → RESET
// =========================================================
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  autoTourActive = false;
  tourBtn.textContent = "Start Auto Tour";
  restorePlanetSpeeds();

  gsap.to(camera.position, {
    x: 0,
    y: 60,
    z: 160,
    duration: 2,
    ease: "power2.inOut"
  });

  controls.target.set(0, 0, 0);
  planetLabel.textContent = "";
  planetInfoBox.style.display = "none";
});

// =========================================================
// ANIMATION LOOP
// =========================================================
function animate() {
  requestAnimationFrame(animate);

  sunMesh.rotation.y += sunBody.rotateSpeed;

  planets.forEach((p) => {
    p.mesh.rotation.y += p.rotateSpeed;
    p.group.rotation.y += p.orbitSpeed;
  });

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

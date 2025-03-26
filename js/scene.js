/* SCENE MODULE */
// 初始化Three.js的场景、相机和渲染器
const scene = new THREE.Scene();
// 默认背景色
scene.background = new THREE.Color(0x000000);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight * 0.618),
  0.1,
  1000
);
camera.position.z = 5;

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.setSize(window.innerWidth, window.innerHeight * 0.618);
renderer.setPixelRatio(window.devicePixelRatio);

// 将渲染器添加到页面
const modelContainer = document.getElementById('model-container');
modelContainer.appendChild(renderer.domElement);

// 控制器
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 10);
pointLight1.position.set(2, 2, 2);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1.5, 10);
pointLight2.position.set(-2, -2, 2);
scene.add(pointLight2); 
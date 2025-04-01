/* SCENE MODULE */
// 初始化Three.js的场景、相机和渲染器
const scene = new THREE.Scene();
// 默认背景色
scene.background = new THREE.Color(0x000000);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / getContainerHeight(),
  0.1,
  1000
);
camera.position.z = 5;

// 获取容器高度的函数
function getContainerHeight() {
  const isMobile = window.innerWidth < 768;
  // 移动端为窗口高度的50%，桌面端为窗口高度的61.8%
  return window.innerHeight * (isMobile ? 0.5 : 0.618);
}

// 判断是否为移动设备并调整相机位置
function adjustCameraForMobile() {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    camera.position.y = 0.8; // 移动端相机向上移动
  } else {
    camera.position.y = 0; // 桌面端保持原位置
  }
}

// 初始调整
adjustCameraForMobile();

// 窗口大小变化时重新调整
window.addEventListener('resize', adjustCameraForMobile);

// 渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true, physicallyCorrectLights: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
updateRendererSize();
renderer.setPixelRatio(window.devicePixelRatio);

// 更新渲染器尺寸
function updateRendererSize() {
  renderer.setSize(window.innerWidth, getContainerHeight());
}

// 窗口大小变化时更新相机和渲染器
window.addEventListener('resize', () => {
  // 更新相机纵横比
  camera.aspect = window.innerWidth / getContainerHeight();
  camera.updateProjectionMatrix();
  
  // 更新渲染器尺寸
  updateRendererSize();
  
  // 调整相机高度位置
  adjustCameraForMobile();
});

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
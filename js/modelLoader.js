/* MODEL LOADER MODULE */
const loader = new THREE.GLTFLoader();
const modelCacheMap = {}; // 缓存已经加载的模型
let currentModel = null;  // 当前显示的模型
let currentModelIndex = config.defaultIndex;

function loadModel(index) {
  const modelInfo = config.models[index];
  
  // 更新导航圆点
  const dots = document.querySelectorAll('.model-dot');
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

  // 发布模型变更事件
  dispatchModelChangedEvent(index, modelInfo);

  // 如果场景中已有模型，先移除
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }

  // 从缓存读取或加载新模型
  if (modelCacheMap[modelInfo.file]) {
    const cachedModel = modelCacheMap[modelInfo.file];
    // 如果有SkeletonUtils，就用它来克隆
    const cloneModel = THREE.SkeletonUtils
      ? THREE.SkeletonUtils.clone(cachedModel)
      : cachedModel.clone();
    scene.add(cloneModel);
    currentModel = cloneModel;
    currentModelIndex = index;
    return;
  }

  loader.load(
    modelInfo.file,
    function (gltf) {
      const newModel = gltf.scene;
      modelCacheMap[modelInfo.file] = newModel; // 缓存

      // 调整材质
      newModel.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.metalness = 0.1;
          node.material.roughness = 0.5;
          node.material.envMapIntensity = 1.0;
          if (node.material.normalMap) {
            node.material.normalScale.set(1, 1);
          }
        }
      });

      // 自动调整模型位置和大小
      const box = new THREE.Box3().setFromObject(newModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      newModel.position.x += (newModel.position.x - center.x);
      newModel.position.y += (newModel.position.y - center.y);
      
      // 移动端模型位置微调
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        newModel.position.y -= 0; // 移动端模型稍微下移，配合上移的相机
      }
      
      newModel.position.z += (newModel.position.z - center.z);

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.0 / maxDim;
      newModel.scale.set(scale, scale, scale);
      newModel.rotation.y = -0.5;

      scene.add(newModel);
      currentModel = newModel;
      currentModelIndex = index;
    },
    undefined,
    function (error) {
      console.error('加载模型出错:', error);
    }
  );
}

// 创建和发布模型变更事件的函数
function dispatchModelChangedEvent(index, modelInfo) {
  console.log('切换模型:', index, modelInfo.name, modelInfo.description); // 添加调试日志
  const event = new CustomEvent('modelChanged', {
    detail: {
      index: index,
      modelInfo: modelInfo
    }
  });
  document.dispatchEvent(event);
}

// 初始加载
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM已加载，开始加载模型...');
  loadModel(currentModelIndex);
});
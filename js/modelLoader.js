/* MODEL LOADER MODULE */
const loader = new THREE.GLTFLoader();
const modelCacheMap = {}; // 缓存已经加载的模型
let currentModel = null;  // 当前显示的模型
let currentModelIndex = config.defaultIndex;

function loadModel(index) {
  const modelInfo = config.models[index];
  
  // 更新模型列表中的高亮项 - 提前到最开始执行
  updateModelListHighlight(index);
  
  // 更新模型标题
  const titleElement = document.getElementById('model-title');
  titleElement.textContent = modelInfo.name;

  // 更新模型版本
  const versionElement = document.getElementById('model-version');
  const versionSpan = versionElement.querySelector('span');
  versionSpan.textContent = modelInfo.version;
  
  // 更新版本标签颜色
  updateVersionColors(index, versionSpan);
  
  // 更新模型描述
  const descriptionElement = document.getElementById('model-description');
  descriptionElement.textContent = modelInfo.description;

  // 执行标题显示动画
  titleElement.classList.remove('active');
  descriptionElement.classList.remove('active');
  
  setTimeout(() => {
    titleElement.classList.add('active');
    
    // 直接显示描述信息，不再延迟显示版本
    setTimeout(() => {
      descriptionElement.classList.add('active');
    }, 100);
  }, 50);

  // 更新导航圆点
  const dots = document.querySelectorAll('.model-dot');
  dots.forEach((dot, dotIndex) => {
    if (dotIndex === index) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });

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

// 高亮当前选中的模型列表项
function updateModelListHighlight(index) {
  // 获取所有模型列表项
  const listItems = document.querySelectorAll('#content ul li');
  
  // 先隐藏所有列表项
  listItems.forEach(item => {
    item.classList.remove('active', 'bg-white/20', 'dark:bg-gray-700/50');
    // 确保非活动项有偏移效果
    item.style.transform = 'translateY(-50%) translateY(10px)';
    item.style.opacity = '0';
  });
  
  // 显示当前选中的模型
  const currentItem = document.getElementById(`model-item-${index}`);
  if (currentItem) {
    // 添加延迟使动画更平滑
    setTimeout(() => {
      currentItem.classList.add('active', 'bg-white/20', 'dark:bg-gray-700/50');
      currentItem.style.transform = 'translateY(-50%)';
      currentItem.style.opacity = '1';
    }, 100);
  }
}

// 更新版本标签的颜色
function updateVersionColors(index, versionSpan) {
  // 移除所有颜色相关的类
  versionSpan.className = 'px-2 py-1 rounded-full';
  
  // 根据当前模型添加对应的颜色类
  switch(index) {
    case 0: // ChatGPT
      versionSpan.classList.add('bg-blue-500/20', 'dark:bg-blue-500/30', 'text-blue-600', 'dark:text-blue-300');
      break;
    case 1: // Claude
      versionSpan.classList.add('bg-purple-500/20', 'dark:bg-purple-500/30', 'text-purple-600', 'dark:text-purple-300');
      break;
    case 2: // DeepSeek
      versionSpan.classList.add('bg-green-500/20', 'dark:bg-green-500/30', 'text-green-600', 'dark:text-green-300');
      break;
    case 3: // Gemini
      versionSpan.classList.add('bg-amber-500/20', 'dark:bg-amber-500/30', 'text-amber-600', 'dark:text-amber-300');
      break;
    case 4: // Grok
      versionSpan.classList.add('bg-red-500/20', 'dark:bg-red-500/30', 'text-red-600', 'dark:text-red-300');
      break;
  }
}

// 初始加载
loadModel(currentModelIndex); 
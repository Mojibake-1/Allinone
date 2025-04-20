/* MODEL LOADER MODULE */
const loader = new THREE.GLTFLoader();
const modelCacheMap = {}; // 缓存已经加载的模型 { [fileName]: Promise<THREE.Group> }
const processingCache = {}; // 缓存处理过的模型 { [fileName]: THREE.Group }
let currentModel = null;  // 当前显示的模型
let currentModelIndex = config.defaultIndex;

// 新增：提取核心加载、处理和缓存逻辑
async function fetchAndProcessModel(modelInfo) {
  const fileName = modelInfo.file;
  if (modelCacheMap[fileName]) {
    // 如果已经有Promise在加载或已加载，直接返回它
    return modelCacheMap[fileName];
  }

  // 创建一个新的Promise来处理加载
  const loadPromise = new Promise((resolve, reject) => {
    console.log(`开始加载: ${fileName}`); // 调试日志
    loader.load(
      fileName,
      (gltf) => {
        const loadedModel = gltf.scene;
        console.log(`完成加载: ${fileName}`); // 调试日志

        // --- 模型处理逻辑 开始 ---
        // 调整材质
        loadedModel.traverse((node) => {
          if (node.isMesh && node.material) {
            // 尝试保留一些原始设置，只调整关键属性
            node.material.metalness = node.material.metalness !== undefined ? node.material.metalness * 0.5 : 0.1; // 减少金属感
            node.material.roughness = node.material.roughness !== undefined ? Math.min(node.material.roughness * 1.2, 1.0) : 0.6; // 增加一点粗糙度
            node.material.envMapIntensity = node.material.envMapIntensity !== undefined ? node.material.envMapIntensity : 1.0;
            
            // 如果需要，可以取消注释以下行来强制双面渲染，但可能影响性能
            // node.material.side = THREE.DoubleSide; 
            
            // 处理透明度，如果模型本身有设置
            if (node.material.transparent) {
              node.material.opacity = node.material.opacity !== undefined ? node.material.opacity : 1.0;
            } else {
              // 如果材质不是透明的，确保opacity为1
              node.material.opacity = 1.0;
              node.material.transparent = false;
            }

            if (node.material.normalMap) {
              node.material.normalScale = node.material.normalScale || new THREE.Vector2(1, 1);
            }
            
            // 确保材质更新
            node.material.needsUpdate = true; 
            
            // 尝试启用阴影（如果场景设置了光源和阴影）
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // 自动调整模型位置和大小 (恢复旧版逻辑)
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 1. 将模型几何中心移动到原点
        loadedModel.position.x -= center.x;
        loadedModel.position.y -= center.y; 
        loadedModel.position.z -= center.z;

        // 2. 统一缩放模型，使其最大尺寸约为 3 个单位
        const maxDim = Math.max(size.x, size.y, size.z);
        // 防止 maxDim 为 0 或过小导致缩放问题
        const scale = (maxDim > 0.001) ? (3.0 / maxDim) : 1.0; 
        loadedModel.scale.set(scale, scale, scale);
        
        // 3. 设置初始旋转 (与之前保持一致)
        loadedModel.rotation.y = -0.5; 
        
        // --- 模型处理逻辑 结束 (移除了 scaledBox 和基于 min.y 的调整) ---
        
        console.log(`处理完成: ${fileName}`); // 调试日志
        processingCache[fileName] = loadedModel; // 缓存处理后的模型
        resolve(loadedModel); // Promise 完成，值为处理后的模型
      },
      undefined, // onProgress callback (optional)
      (error) => {
        console.error(`加载模型出错: ${fileName}`, error);
        reject(error); // Promise 失败
      }
    );
  });

  modelCacheMap[fileName] = loadPromise; // 将Promise存入缓存
  return loadPromise;
}


// 修改：loadModel现在主要负责UI更新和场景切换
async function loadModel(index) {
  if (index < 0 || index >= config.models.length) {
    console.warn(`无效的模型索引: ${index}`);
    return;
  }
  
  const modelInfo = config.models[index];
  console.log(`请求加载模型索引: ${index}, 文件: ${modelInfo.file}`); // 调试日志

  // 1. 更新UI元素（导航圆点）
  const dots = document.querySelectorAll('.model-dot');
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === index);
  });

  // 2. 发布模型变更事件（用于更新文本等）
  dispatchModelChangedEvent(index, modelInfo);

  // 3. 移除场景中的当前模型
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }
  
  // 4. 获取或加载模型
  let modelToDisplay = null;
  try {
    // 检查处理缓存中是否已有
    if (processingCache[modelInfo.file]) {
        console.log(`使用处理缓存: ${modelInfo.file}`);
        modelToDisplay = processingCache[modelInfo.file];
    } else {
        // 否则，调用fetchAndProcessModel（它会处理加载或返回缓存的Promise）
        console.log(`处理缓存未命中，调用 fetchAndProcessModel: ${modelInfo.file}`);
        modelToDisplay = await fetchAndProcessModel(modelInfo);
    }
    
    // 5. 克隆模型并添加到场景
    if (modelToDisplay) {
      // 使用 SkeletonUtils.clone 来处理带骨骼动画的模型，否则普通 clone
      const cloneModel = THREE.SkeletonUtils && modelToDisplay.skeleton 
                         ? THREE.SkeletonUtils.clone(modelToDisplay) 
                         : modelToDisplay.clone();
      
      // 确保克隆的模型位置和旋转是正确的 (克隆应包含这些)
      // cloneModel.position.copy(modelToDisplay.position);
      // cloneModel.rotation.copy(modelToDisplay.rotation);
      // cloneModel.scale.copy(modelToDisplay.scale);

      scene.add(cloneModel);
      currentModel = cloneModel;
      currentModelIndex = index;
      console.log(`模型已添加到场景: ${modelInfo.file}`); // 调试日志
    } else {
       console.error(`无法获取或加载模型: ${modelInfo.file}`);
    }

  } catch (error) {
    console.error(`加载或处理模型 ${modelInfo.file} 时出错:`, error);
    // 可以在这里添加错误处理逻辑，例如显示一个错误提示
  }
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

// 新增：后台预加载函数
function startBackgroundPreloading() {
  console.log("开始后台预加载...");
  config.models.forEach((modelInfo, i) => {
    // 跳过当前已经加载或正在加载的第一个模型
    if (i === currentModelIndex) {
      console.log(`跳过预加载当前模型: ${modelInfo.file}`);
      return;
    }
    // 如果模型尚未开始加载（即不在 cache map 中），则启动加载
    if (!modelCacheMap[modelInfo.file]) {
      console.log(`启动预加载: ${modelInfo.file}`);
      fetchAndProcessModel(modelInfo).catch(error => {
        // 预加载失败时记录错误，但不中断其他操作
        console.error(`预加载模型 ${modelInfo.file} 失败:`, error);
      });
    } else {
        console.log(`模型已在加载或已缓存，跳过预加载: ${modelInfo.file}`);
    }
  });
}

// 修改：DOMContentLoaded 监听器
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM已加载，开始加载初始模型...');
  // 立即加载并显示第一个模型
  loadModel(currentModelIndex)
    .then(() => {
      console.log("初始模型加载完成。");
      // 在初始模型成功显示后，稍作延迟，开始后台预加载其余模型
      setTimeout(startBackgroundPreloading, 1000); // 延迟1秒启动预加载
    })
    .catch(error => {
      console.error("初始模型加载失败:", error);
      // 即使初始模型加载失败，也尝试预加载其他的
      setTimeout(startBackgroundPreloading, 1000); 
    });
});
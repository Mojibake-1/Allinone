/* UI MODULE */
// 切换模型按钮
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
prevButton.addEventListener('click', () => {
  const newIndex = (currentModelIndex - 1 + config.models.length) % config.models.length;
  loadModel(newIndex);
});
nextButton.addEventListener('click', () => {
  const newIndex = (currentModelIndex + 1) % config.models.length;
  loadModel(newIndex);
});

// 创建导航圆点
const modelDotsContainer = document.getElementById('model-dots');

// 清空容器
while (modelDotsContainer.firstChild) {
  modelDotsContainer.removeChild(modelDotsContainer.firstChild);
}

// 为每个模型创建一个圆点
config.models.forEach((model, index) => {
  const dot = document.createElement('div');
  dot.className = 'model-dot';
  if (index === currentModelIndex) {
    dot.classList.add('active');
  }
  
  // 添加点击事件
  dot.addEventListener('click', () => {
    loadModel(index);
  });
  
  modelDotsContainer.appendChild(dot);
});

// 夜间模式切换
const nightModeButton = document.getElementById('night-mode-button');
const nightModeIcon = nightModeButton.querySelector('i');

nightModeButton.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  
  if (document.documentElement.classList.contains('dark')) {
    scene.background = new THREE.Color(0x000000);
    nightModeIcon.className = 'fas fa-moon';
  } else {
    scene.background = new THREE.Color(0xffffff);
    nightModeIcon.className = 'fas fa-sun';
  }
});

// 设置初始图标状态
if (document.documentElement.classList.contains('dark')) {
  nightModeIcon.className = 'fas fa-moon';
} else {
  nightModeIcon.className = 'fas fa-sun';
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  // 使用黄金分割比例（61.8%）计算相机宽高比
  camera.aspect = window.innerWidth / (window.innerHeight * 0.618);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.618);
}); 
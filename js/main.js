/* MAIN LOOP MODULE */
let lastTime = 0;
function animate(currentTime) {
  requestAnimationFrame(animate);

  // 计算时间差
  if (!lastTime) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  // 自动旋转模型
  if (currentModel) {
    currentModel.rotation.y += config.rotationSpeed * deltaTime;
  }

  controls.update();
  renderer.render(scene, camera);
}

// 启动动画循环
animate();

// 优化博客容器的滚动体验
document.addEventListener('DOMContentLoaded', () => {
  const modelBlog = document.getElementById('model-blog');
  if (modelBlog) {
    // 添加平滑滚动效果
    modelBlog.addEventListener('wheel', (e) => {
      e.preventDefault();
      modelBlog.scrollTop += e.deltaY * 0.5;
    }, { passive: false });
  }
  
  // 添加按钮点击波纹效果
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 创建波纹元素
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      this.appendChild(ripple);
      
      // 设置波纹位置
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      
      // 移除波纹
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// 添加波纹样式
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
  }
  
  .dark .ripple {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

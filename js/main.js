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
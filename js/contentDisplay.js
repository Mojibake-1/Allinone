/* CONTENT DISPLAY MODULE */

class ContentDisplay {
  constructor() {
    // DOM元素缓存
    this.elements = {
      title: document.getElementById('model-title'),
      description: document.getElementById('model-description'),
      version: document.getElementById('model-version'),
      versionSpan: document.getElementById('model-version').querySelector('span'),
      listItems: document.querySelectorAll('#content ul li'),
      modelArticles: document.querySelectorAll('.model-article')
    };
    
    // 初始化事件监听
    this.initEventListeners();
    
    // 初始化显示内容 - 添加此行以确保页面加载时就显示默认模型描述
    this.initDefaultDisplay();
  }
  
  // 添加新方法：初始化默认显示
  initDefaultDisplay() {
    // 获取默认模型索引和信息
    const defaultIndex = config.defaultIndex;
    const defaultModelInfo = config.models[defaultIndex];
    
    // 直接更新描述内容
    if (this.elements.description) {
      this.elements.description.textContent = defaultModelInfo.description;
      // 立即应用激活样式，不使用动画
      this.elements.description.classList.add('active');
    }
    
    // 确保博客文章和模型列表正确高亮
    this.updateBlogArticleHighlight(defaultIndex);
    this.updateModelListHighlight(defaultIndex);
  }
  
  initEventListeners() {
    // 监听模型切换事件
    document.addEventListener('modelChanged', (event) => {
      const { index, modelInfo } = event.detail;
      this.updateDisplay(index, modelInfo);
    });
  }
  
  updateDisplay(index, modelInfo) {
    // 更新模型标题
    this.updateTitle(modelInfo.name);
    
    // 更新模型版本
    this.updateVersion(modelInfo.version);
    
    // 更新版本标签颜色
    this.updateVersionColors(index);
    
    // 更新模型描述
    this.updateDescription(modelInfo.description);
    
    // 更新模型列表高亮
    this.updateModelListHighlight(index);
    
    // 更新博客文章高亮
    this.updateBlogArticleHighlight(index);
  }
  
  updateTitle(title) {
    // 更新标题并添加动画
    this.elements.title.classList.remove('active');
    this.elements.title.textContent = title;
    
    setTimeout(() => {
      this.elements.title.classList.add('active');
    }, 50);
  }
  
  updateVersion(version) {
    this.elements.versionSpan.textContent = version;
  }
  
  updateDescription(description) {
    // 更新描述并添加动画
    this.elements.description.classList.remove('active');
    this.elements.description.textContent = description;
    
    setTimeout(() => {
      this.elements.description.classList.add('active');
    }, 150);
  }
  
  updateVersionColors(index) {
    // 移除所有颜色相关的类
    this.elements.versionSpan.className = 'px-2 py-1 rounded-full';
    
    // 根据当前模型添加对应的颜色类
    const colorClasses = [
      ['bg-blue-500/20', 'dark:bg-blue-500/30', 'text-blue-600', 'dark:text-blue-300'],     // ChatGPT
      ['bg-purple-500/20', 'dark:bg-purple-500/30', 'text-purple-600', 'dark:text-purple-300'], // Claude
      ['bg-green-500/20', 'dark:bg-green-500/30', 'text-green-600', 'dark:text-green-300'],  // DeepSeek
      ['bg-amber-500/20', 'dark:bg-amber-500/30', 'text-amber-600', 'dark:text-amber-300'],  // Gemini
      ['bg-red-500/20', 'dark:bg-red-500/30', 'text-red-600', 'dark:text-red-300']          // Grok
    ];
    
    if (colorClasses[index]) {
      this.elements.versionSpan.classList.add(...colorClasses[index]);
    }
  }
  
  updateModelListHighlight(index) {
    // 获取所有模型列表项
    const listItems = document.querySelectorAll('#content ul li');
    
    // 先隐藏所有列表项
    listItems.forEach(item => {
      item.classList.remove('active', 'bg-white/20', 'dark:bg-gray-700/50');
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
  
  updateBlogArticleHighlight(index) {
    // 隐藏所有文章
    this.elements.modelArticles.forEach((article, i) => {
      article.classList.add('hidden');
      article.classList.remove('active');
      article.style.opacity = '0';
    });
    
    // 显示当前选中的文章
    const currentArticle = document.getElementById(`model-article-${index}`);
    if (currentArticle) {
      currentArticle.classList.remove('hidden');
      setTimeout(() => {
        currentArticle.classList.add('active');
        currentArticle.style.opacity = '1';
      }, 100);
    }
  }
}

// 创建并初始化内容显示模块
const contentDisplay = new ContentDisplay();

// 在document的样式中添加过渡效果
const transitionStyle = document.createElement('style');
transitionStyle.textContent = `
  body.transitioning #model-container {
    transition: all 0.6s ease-out;
  }
  
  #background-accent {
    background-color: transparent;
    mix-blend-mode: overlay;
  }
  
  .dark #background-accent {
    mix-blend-mode: color-dodge;
  }
`;
document.head.appendChild(transitionStyle);

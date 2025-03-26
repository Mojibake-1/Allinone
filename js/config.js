/* CONFIG MODULE */
const config = {
  models: [
    { 
      name: "ChatGPT", 
      file: "chatgpt.gltf",
      description: "情商在线、知识广博，是当下最像\"有见识的朋友\"的 AI",
      version: "GPT4.5/o1/deep research"
    },
    { 
      name: "Claude", 
      file: "claude.gltf",
      description: "在编程、审美和稳定性上最可靠， MCP 、Agent 实战利器",
      version: "sonnet3.7 thinking"
    },
    { 
      name: "DeepSeek", 
      file: "deepseek.gltf",
      description: "开源亲民选手，低成本高性能，正快速逼近顶级梯队",
      version: "DeepSeek R1/V3"
    },
    { 
      name: "Gemini", 
      file: "gemini.gltf",
      description: "超长上下文沉浸式翻译，善于多模态分析和复杂信息整合",
      version: "Gemini 2 flash exp/2.5 pro"
    },
    { 
      name: "Grok", 
      file: "grok.gltf",
      description: "定位社交原生、实时联网，回答风格带点个性",
      version: "grok 3"
    }
  ],
  defaultIndex: 0, // 默认加载的模型索引
  rotationSpeed: (2 * Math.PI) / 40, // 40秒完成一圈
}; 

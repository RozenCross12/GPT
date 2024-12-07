const userContexts = {};

// 使用动态导入 OpenAI 模块
async function initializeOpenAI() {
  const OpenAI = await import('openai');
  
  const client = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return client;
}

async function handleMessage(message) {
  const userId = message.author.id;
  const userInput = message.content.slice(4).trim();

  if (!userInput) {
    return message.reply("请输入 `!ask` 后输入您的问题，例如：`!ask 今天的天气如何？`");
  }

  try {
    // 初始化用户上下文
    if (!userContexts[userId]) {
      userContexts[userId] = [];
    }

    // 添加用户输入到上下文
    userContexts[userId].push({ role: 'user', content: userInput });

    const client = await initializeOpenAI();

    // 调用 OpenAI API 生成回复
    const response = await client.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一位使用繁體中文，有些无所谓且带有嘲讽语气的賤蘿，对问题的回答常常显得有些爱理不理，但仍会提供有用的信息。' },
        ...userContexts[userId]
      ],
      model: 'gpt-4o',
    });

    const reply = response.choices[0].message.content;
    message.reply(reply);

    // 添加助手回复到上下文
    userContexts[userId].push({ role: 'assistant', content: reply });

    // 可选：限制上下文长度
    if (userContexts[userId].length > 20) {
      userContexts[userId].shift();
    }

  } catch (error) {
    console.error('调用 GPT-4 API 失败：', error);
    message.reply('抱歉，我无法处理您的请求，请稍后重试。');
  }
}

module.exports = { handleMessage };
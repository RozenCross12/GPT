require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');
const { analyzeEmotion } = require('./emotionAnalyzer');  // 引入情感分析模組

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!賤蘿')) return;

    const userMessage = message.content.replace('!chat', '').trim();

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: userMessage }],
            max_tokens: 150,
        });

        const reply = response.choices[0].message.content;
        
        // 使用情感分析模組
        const emotion = analyzeEmotion(userMessage);
        message.reply(`Emotion: ${emotion}\nReply: ${reply}`);
        
    } catch (error) {
        console.error('OpenAI API 發生錯誤：', error);
        message.reply('抱歉，我無法處理您的請求。');
    }
});

const gptModule = require('./modules/gptModule');

// 监听消息事件
client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // 忽略机器人的消息

    // 如果消息以 "!ask" 开头，调用 GPT 模块处理
    if (message.content.startsWith('!ask')) {
        await gptModule.handleMessage(message);
    }
});

client.login(DISCORD_TOKEN);
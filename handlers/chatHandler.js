  const { OpenAI } = require('openai');
     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

     const userContexts = {};

     async function handleChatCommand(message) {
       const userMessage = message.content.replace('!chat', '').trim();
       const userId = message.author.id;

       if (!userContexts[userId]) {
         userContexts[userId] = [];
       }

       userContexts[userId].push({ role: 'user', content: userMessage });

       try {
         const response = await openai.chat.completions.create({
           model: 'gpt-4',
           messages: userContexts[userId],
           max_tokens: 100,
         });

         const reply = response.choices[0].message.content;
         message.reply(reply);

         userContexts[userId].push({ role: 'assistant', content: reply });
       } catch (error) {
         console.error('OpenAI API error:', error);
         message.reply('抱歉，我無法處理您的請求。');
       }
     }

     module.exports = { handleChatCommand };
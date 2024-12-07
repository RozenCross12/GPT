
const { analyzeEmotion } = require('../emotionAnalyzer');

module.exports = (client) => {
    client.on('messageCreate', (message) => {
        if (message.author.bot) return;
        if (!message.content.startsWith('!chat')) return;

        const userMessage = message.content.replace('!chat', '').trim();
        const emotion = analyzeEmotion(userMessage);

        let reply;
        switch (emotion) {
            case 'neutral':
                reply = '抱歉您現在感到煩躁。有時我們的情緒會受到各種因素的影響。也許您可以嘗試一下深呼吸、散步、聽輕音樂或做一些您喜歡的事情以協助釋放壓力';
                break;
            // 在這裡添加更多情緒和對應的中文回應
            default:
                reply = `情緒：${emotion}`;
        }

        message.channel.send(reply);
    });
};
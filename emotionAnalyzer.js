const positiveWords = {
    'happy': 2,
    'joyful': 3,
    'fantastic': 4,
    'good': 1,
    'excited': 3,
    'amazing': 4
};

const negativeWords = {
    'sad': 2,
    'terrible': 3,
    'bad': 1,
    'angry': 2,
    'horrible': 4,
    'depressing': 3
};

function analyzeEmotion(text) {
    let score = 0;

    for (const word in positiveWords) {
        if (text.includes(word)) {
            score += positiveWords[word];
        }
    }

    for (const word in negativeWords) {
        if (text.includes(word)) {
            score -= negativeWords[word];
        }
    }

    if (score > 4) {
        return '潮爽德';
    } else if (score > 2) {
        return '燦笑';
    } else if (score === 2) {
        return '竊笑';
    } else if (score === 1) {
        return '傲嬌';
    } else if (score === 0) {
        return '無口';
    } else if (score === -1) {
        return '鄙視';
    } else if (score <= -2) {
        return '不耐煩';
    } else if (score <= -4) {
        return '瞪';
    } else {
        return '中指';
    }
}

module.exports = { analyzeEmotion };
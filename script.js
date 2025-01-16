const textDisplay = document.getElementById('text-display');
const inputArea = document.getElementById('input-area');
const startButton = document.getElementById('start-btn');
const results = document.getElementById('results');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const correctWordsDisplay = document.getElementById('correct-words');
const incorrectWordsDisplay = document.getElementById('incorrect-words');
const timerDisplay = document.getElementById('timer');

const words = [
    "làm", "đi", "về", "ăn", "uống", "ngủ", "học", "đọc", "viết", "nói", 
    "nghe", "xem", "nghĩ", "hiểu", "biết", "yêu", "thích", "muốn", "cần", "giúp",
    
    "nhà", "trường", "công", "việc", "sách", "bàn", "ghế", "cửa", "phòng", "bếp", 
    "xe", "đường", "cây", "hoa", "chim", "mèo", "chó", "người", "bạn", "gia",
    
    "đẹp", "xấu", "tốt", "cao", "thấp", "to", "nhỏ", "nhanh", "chậm", "mới", 
    "cũ", "vui", "buồn", "khó", "dễ", "nóng", "lạnh", "đúng", "sai", "hay",
    
    "giờ", "phút", "ngày", "đêm", "sáng", "trưa", "chiều", "tối", "tuần", "tháng", 
    "năm", "mùa", "xuân", "hạ", "thu", "đông", "mai", "qua", "nay", "sau",
    
    "đây", "đó", "trong", "ngoài", "trên", "dưới", "phải", "trái", "giữa", "góc", 
    "cạnh", "sau", "trước", "xa", "gần", "bắc", "nam", "đông", "tây", "quê",
    
    "cơm", "phở", "bánh", "thịt", "cá", "rau", "trái", "nước", "trà", "cà", 
    "phê", "bia", "rượu", "mặn", "ngọt", "chua", "cay", "đắng", "bữa", "nấu",
    
    "vui", "buồn", "giận", "sợ", "yêu", "ghét", "nhớ", "thương", "mệt", "khỏe", 
    "đau", "ốm", "lo", "mừng", "tin", "ngại", "hận", "hy", "vọng", "tủi",
    
    "học", "thi", "điểm", "bài", "viết", "đọc", "hiểu", "nghĩ", "làm", "xong", 
    "đúng", "sai", "giỏi", "kém", "gắng", "thành", "bại", "kinh", "năng", "thức"
];

let wordHistory = [];
let currentWordIndex = 0;
let startTime;
let timer;
let timeLeft = 60;
let isTestActive = false;
let correctWords = 0;
let incorrectWords = 0;
let currentInput = '';

function shuffleWords() {
    for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
    }
}

function displayWords() {
    if (currentWordIndex + 50 >= words.length) {
        shuffleWords();
        currentWordIndex = 0;
    }

    let wordsToShow = words.slice(currentWordIndex, currentWordIndex + 50);
    let html = '';
    
    wordsToShow.forEach((word, index) => {
        const status = wordHistory[currentWordIndex + index] || '';
        if (index === 0) {
            html += `<span class="current-word ${status}">${word}</span> `;
        } else {
            html += `<span class="${status}">${word}</span> `;
        }
    });
    
    textDisplay.innerHTML = html;
    
    const currentWord = textDisplay.querySelector('.current-word');
    if (currentWord) {
        const container = textDisplay.getBoundingClientRect();
        const word = currentWord.getBoundingClientRect();
        if (word.left < container.left || word.right > container.right) {
            currentWord.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
        }
    }
}

function startTest() {
    if (isTestActive) return;
    
    inputArea.value = "";
    shuffleWords();
    currentWordIndex = 0;
    correctWords = 0;
    incorrectWords = 0;
    wordHistory = new Array(words.length).fill('');
    currentInput = '';
    timeLeft = 60;
    
    displayWords();
    inputArea.disabled = false;
    startButton.disabled = true;
    results.classList.add('hidden');
    inputArea.focus();
    
    isTestActive = true;
    startTime = new Date().getTime();
    updateTimer();
}

function updateTimer() {
    timerDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
        endTest();
    } else if (isTestActive) {
        timeLeft--;
        timer = setTimeout(updateTimer, 1000);
    }
}

function checkWord() {
    if (!isTestActive) return;

    const currentWord = words[currentWordIndex];
    const typedWord = currentInput.trim();
    
    if (typedWord === currentWord) {
        correctWords++;
        wordHistory[currentWordIndex] = 'correct';
    } else {
        incorrectWords++;
        wordHistory[currentWordIndex] = 'incorrect';
    }
    
    currentWordIndex++;
    currentInput = '';
    inputArea.value = '';
    displayWords();
}

function endTest() {
    isTestActive = false;
    clearTimeout(timer);
    inputArea.disabled = true;
    startButton.disabled = false;
    
    if (currentInput.trim() !== '') {
        checkWord();
    }
    
    const timeInMinutes = 1;
    const grossWPM = Math.round((correctWords + incorrectWords) / timeInMinutes);
    const netWPM = Math.round(correctWords / timeInMinutes);
    const accuracy = Math.round((correctWords / (correctWords + incorrectWords)) * 100) || 0;
    
    wpmDisplay.textContent = netWPM;
    accuracyDisplay.textContent = accuracy;
    correctWordsDisplay.textContent = correctWords;
    incorrectWordsDisplay.textContent = incorrectWords;
    
    results.classList.remove('hidden');
}

inputArea.addEventListener('input', (e) => {
    if (!isTestActive) return;
    
    currentInput = e.target.value;
    const currentWord = words[currentWordIndex];
    
    const currentWordElement = textDisplay.querySelector('.current-word');
    if (currentWordElement) {
        if (currentWord.startsWith(currentInput.trim())) {
            currentWordElement.classList.remove('incorrect-input');
            currentWordElement.classList.add('correct-input');
        } else {
            currentWordElement.classList.remove('correct-input');
            currentWordElement.classList.add('incorrect-input');
        }
    }
});

inputArea.addEventListener('keydown', (e) => {
    if (!isTestActive) return;
    
    if (e.code === 'Space') {
        e.preventDefault();
        if (currentInput.trim() !== '') {
            checkWord();
        }
    }
});

startButton.addEventListener('click', startTest);

let balance = parseInt(localStorage.getItem('balance')) || 1000000;
const canvas = document.getElementById('rouletteWheel');
const ctx = canvas.getContext('2d');
let isSpinning = false;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wheel sections
    NUMBERS.forEach((number, i) => {
        const angle = (i * 360 / NUMBERS.length + wheelRotation) * Math.PI / 180;
        const nextAngle = ((i + 1) * 360 / NUMBERS.length + wheelRotation) * Math.PI / 180;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, nextAngle);
        ctx.closePath();
        
        ctx.fillStyle = number === 0 ? '#0f8a3c' : RED_NUMBERS.includes(number) ? '#dc3545' : '#000';
        ctx.fill();
        ctx.stroke();
        
        // Draw numbers
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + (nextAngle - angle) / 2);
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(number.toString(), radius * 0.75, 0);
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    
    // Draw ball
    if (isSpinning) {
        const ballAngle = (ballRotation) * Math.PI / 180;
        const ballRadius = radius * 0.85;
        ctx.beginPath();
        ctx.arc(
            centerX + Math.cos(ballAngle) * ballRadius,
            centerY + Math.sin(ballAngle) * ballRadius,
            8,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

let wheelRotation = 0;
let ballRotation = 0;
let spinSpeed = 0;
let ballSpeed = 0;

function spin() {
    if (isSpinning) return;
    
    const betAmount = parseInt(document.getElementById('betAmount').value);
    if (betAmount > balance) {
        alert('Insufficient balance!');
        return;
    }
    
    // Clear previous bet summaries
    document.querySelectorAll('.bet-summary').forEach(el => el.remove());
    
    // Show active bets
    const activeBets = [];
    document.querySelectorAll('.bet-option.active').forEach(bet => {
        activeBets.push(bet.dataset.type);
    });
    
    if (activeBets.length === 0) {
        alert('Please select at least one bet type!');
        return;
    }
    
    // Display bet summary
    const betSummary = document.createElement('div');
    betSummary.className = 'bet-summary';
    betSummary.innerHTML = `
        <h3>Current Bet: $${betAmount.toLocaleString()}</h3>
        <p>On: ${activeBets.join(', ')}</p>
    `;
    document.querySelector('.roulette-table').prepend(betSummary);
    
    balance -= betAmount;
    updateBalanceDisplay();
    localStorage.setItem('balance', balance.toString());
    
    document.getElementById('spinButton').disabled = true;
    isSpinning = true;
    spinSpeed = 20;
    ballSpeed = 30;
    
    const finalNumber = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    const targetRotation = NUMBERS.indexOf(finalNumber) * (360 / NUMBERS.length);
    
    function animate() {
        wheelRotation = (wheelRotation + spinSpeed) % 360;
        ballRotation = (ballRotation + ballSpeed) % 360;
        
        spinSpeed *= 0.995;
        ballSpeed *= 0.99;
        
        drawWheel();
        
        if (spinSpeed > 0.1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            document.getElementById('spinButton').disabled = false;
            checkWin(finalNumber, betAmount);
        }
    }
    
    animate();
}

function checkWin(number, bet) {
    let winAmount = 0;
    const selectedBets = document.querySelectorAll('.bet-option.active');
    
    selectedBets.forEach(betOption => {
        const betType = betOption.dataset.type;
        if (
            (betType === 'red' && RED_NUMBERS.includes(number)) ||
            (betType === 'black' && !RED_NUMBERS.includes(number) && number !== 0) ||
            (betType === 'even' && number % 2 === 0 && number !== 0) ||
            (betType === 'odd' && number % 2 === 1) ||
            (betType === '1-18' && number >= 1 && number <= 18) ||
            (betType === '19-36' && number >= 19 && number <= 36)
        ) {
            winAmount += bet * 2;
        }
    });
    
    if (winAmount > 0) {
        balance += winAmount;
        showWin(winAmount);
    }
    
    updateBalanceDisplay();
    localStorage.setItem('balance', balance.toString());
}

function updateBalanceDisplay() {
    document.getElementById('balanceDisplay').textContent = `$${balance.toLocaleString()}`;
}

function setMaxBet() {
    document.getElementById('betAmount').value = balance;
}

function showWin(amount) {
    const popup = document.createElement('div');
    popup.className = 'win-popup';
    popup.innerHTML = `
        <div class="win-content">
            <h2>Won $${amount.toLocaleString()}!</h2>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

document.querySelectorAll('.bet-option').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
    });
});

updateBalanceDisplay();
drawWheel();

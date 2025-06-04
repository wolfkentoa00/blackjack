document.addEventListener('DOMContentLoaded', () => {
    // --- Game State ---
    let balance = 1000.00;
    let currentChipValue = 10;
    let bets = {};
    let isSpinning = false;
    let totalBetAmount = 0;

    // --- DOM Elements ---
    const balanceDisplay = document.getElementById('balance-display');
    const messageArea = document.getElementById('message-area');
    const wheel = document.getElementById('wheel');
    const ball = document.getElementById('ball');
    const bettingTable = document.getElementById('betting-table');
    const spinButton = document.getElementById('spin-button');
    const clearBetsButton = document.getElementById('clear-bets-button');
    const chipRail = document.querySelector('.chip-rail');

    // --- Constants ---
    const ROULETTE_NUMBERS_ORDER = [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
        5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
    ];
    const RED_NUMBERS = [
        32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3
    ];
    const BLACK_NUMBERS = [
        15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26
    ];
    const CHIP_VALUES = [1, 5, 10, 25, 100];
    const SEGMENT_ANGLE = 360 / ROULETTE_NUMBERS_ORDER.length;

    // --- Initialization ---
    function initializeGame() {
        createWheelSegments();
        createBettingTable();
        createChips();
        updateBalanceDisplay();
        setupEventListeners();
        updateMessage("Place your bets!");
        spinButton.disabled = true;
    }

    function createWheelSegments() {
        wheel.innerHTML = '';
        const segmentSkewAngle = 90 - SEGMENT_ANGLE;

        ROULETTE_NUMBERS_ORDER.forEach((number, index) => {
            const segment = document.createElement('div');
            segment.classList.add('segment');
            segment.dataset.number = number;
            const rotation = index * SEGMENT_ANGLE;
            segment.style.transform = `rotate(${rotation}deg) skewY(${segmentSkewAngle}deg)`;

            const textContainer = document.createElement('div');
            textContainer.classList.add('segment-text');
            textContainer.textContent = number;
            textContainer.style.transform = `skewY(-${segmentSkewAngle}deg) rotate(${SEGMENT_ANGLE / 2}deg)`;

            if (number === 0) segment.style.backgroundColor = '#009900';
            else if (RED_NUMBERS.includes(number)) segment.style.backgroundColor = '#c00000';
            else segment.style.backgroundColor = '#1c1c1c';
            
            segment.appendChild(textContainer);
            wheel.appendChild(segment);
        });
    }

    function createBettingTable() {
        bettingTable.innerHTML = '';
        const zeroSpot = createBetSpot('0', '0', ['zero']);
        bettingTable.appendChild(zeroSpot);
        for (let i = 1; i <= 36; i++) {
            const spotClasses = ['number'];
            if (RED_NUMBERS.includes(i)) spotClasses.push('red');
            else if (BLACK_NUMBERS.includes(i)) spotClasses.push('black');
            bettingTable.appendChild(createBetSpot(i.toString(), i.toString(), spotClasses));
        }
        bettingTable.appendChild(createBetSpot('Red', 'Red', ['outside-bet', 'red-bet']));
        bettingTable.appendChild(createBetSpot('Black', 'Black', ['outside-bet', 'black-bet']));
    }

    function createBetSpot(id, text, classes = []) {
        const spot = document.createElement('div');
        spot.classList.add('bet-spot', ...classes);
        spot.dataset.betId = id;
        spot.textContent = text;
        spot.addEventListener('click', () => handleBetPlacement(id, spot));
        return spot;
    }

    function createChips() {
        chipRail.innerHTML = '';
        CHIP_VALUES.forEach(value => {
            const chip = document.createElement('div');
            chip.classList.add('chip');
            chip.dataset.value = value;
            chip.textContent = `$${value}`;
            chip.style.backgroundColor = getChipColor(value);
            if (value === currentChipValue) chip.classList.add('selected');
            chip.addEventListener('click', () => selectChip(value, chip));
            chipRail.appendChild(chip);
        });
    }

    function getChipColor(value) {
        switch (value) {
            case 1: return '#4CAF50';
            case 5: return '#F44336';
            case 10: return '#2196F3';
            case 25: return '#FFEB3B';
            case 100: return '#9C27B0';
            default: return '#777';
        }
    }

    function setupEventListeners() {
        spinButton.addEventListener('click', spinWheel);
        clearBetsButton.addEventListener('click', clearAllBets);
    }

    function selectChip(value, chipElement) {
        currentChipValue = value;
        document.querySelector('.chip.selected').classList.remove('selected');
        chipElement.classList.add('selected');
    }

    function handleBetPlacement(betId, spotElement) {
        if (isSpinning) return;
        if (balance < currentChipValue) {
            updateMessage("Insufficient balance!");
            return;
        }
        balance -= currentChipValue;
        totalBetAmount += currentChipValue;
        if (!bets[betId]) bets[betId] = { amount: 0 };
        bets[betId].amount += currentChipValue;
        updateBalanceDisplay();
        updateMessage(`Bet $${currentChipValue} on ${betId}. Total: $${bets[betId].amount}`);
        addChipVisualToSpot(spotElement, currentChipValue);
        spinButton.disabled = false;
    }

    function addChipVisualToSpot(spotElement, chipValue) {
        const chipVisual = document.createElement('div');
        chipVisual.classList.add('placed-chip-visual');
        chipVisual.style.backgroundColor = getChipColor(chipValue);
        chipVisual.style.color = chipValue === 25 ? '#333' : 'white';
        chipVisual.textContent = `$${chipValue}`;
        const existingChips = spotElement.querySelectorAll('.placed-chip-visual').length;
        chipVisual.style.bottom = `${5 + existingChips * 3}px`;
        chipVisual.style.right = `${5 + existingChips * 2}px`;
        spotElement.appendChild(chipVisual);
    }

    function clearAllBets() {
        if (isSpinning) return;
        balance += totalBetAmount;
        totalBetAmount = 0;
        bets = {};
        document.querySelectorAll('.placed-chip-visual').forEach(cv => cv.remove());
        updateBalanceDisplay();
        updateMessage("Bets cleared. Place new bets.");
        spinButton.disabled = true;
    }

    function spinWheel() {
        if (isSpinning || totalBetAmount === 0) return;
        isSpinning = true;
        spinButton.disabled = true;
        clearBetsButton.disabled = true;
        updateMessage("Spinning...");

        const winningNumberIndex = Math.floor(Math.random() * ROULETTE_NUMBERS_ORDER.length);
        const winningNumber = ROULETTE_NUMBERS_ORDER[winningNumberIndex];
        const targetWheelRotation = -(winningNumberIndex * SEGMENT_ANGLE) - (SEGMENT_ANGLE / 2);
        const randomExtraSpins = Math.floor(Math.random() * 4) + 6;
        const finalWheelRotation = targetWheelRotation + (360 * randomExtraSpins);
        
        wheel.style.transform = `rotate(${finalWheelRotation}deg)`;
        animateBall();

        setTimeout(() => {
            determineWinnings(winningNumber);
        }, 7000);
    }
    
    function animateBall() {
        let currentBallAngle = Math.random() * 360;
        const ballSpinDuration = 6500;
        const animationStartTime = Date.now();

        function frame() {
            const elapsedTime = Date.now() - animationStartTime;
            if (elapsedTime >= ballSpinDuration) {
                const landingAngleDegrees = 270;
                const landingAngleRadians = landingAngleDegrees * Math.PI / 180;
                const ballTrackRadius = wheel.offsetWidth * 0.44;
                const wheelCenter = wheel.offsetWidth / 2;
                const ballX = wheelCenter + ballTrackRadius * Math.cos(landingAngleRadians) - (ball.offsetWidth / 2);
                const ballY = wheelCenter + ballTrackRadius * Math.sin(landingAngleRadians) - (ball.offsetHeight / 2);
                ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
                return;
            }

            const progress = elapsedTime / ballSpinDuration;
            const decelerationFactor = 1 - Math.pow(progress, 2);
            currentBallAngle += (15 * decelerationFactor) + 0.5;
            currentBallAngle %= 360;

            const ballAngleRadians = currentBallAngle * Math.PI / 180;
            const ballTrackRadius = wheel.offsetWidth * 0.44;
            const wheelCenter = wheel.offsetWidth / 2;
            const ballX = wheelCenter + ballTrackRadius * Math.cos(-ballAngleRadians) - (ball.offsetWidth / 2);
            const ballY = wheelCenter + ballTrackRadius * Math.sin(-ballAngleRadians) - (ball.offsetHeight / 2);
            ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    function determineWinnings(winningNumber) {
        let winningsThisRound = 0;
        let resultMessage = `Winning Number: ${winningNumber} (${RED_NUMBERS.includes(winningNumber) ? "Red" : (winningNumber === 0 ? "Green" : "Black")}). `;

        for (const betId in bets) {
            const bet = bets[betId];
            let payoutMultiplier = -1;

            if (betId === winningNumber.toString()) payoutMultiplier = 35;
            else if (betId === 'Red' && RED_NUMBERS.includes(winningNumber)) payoutMultiplier = 1;
            else if (betId === 'Black' && BLACK_NUMBERS.includes(winningNumber)) payoutMultiplier = 1;

            if (payoutMultiplier > -1) {
                const winAmountForBet = (bet.amount * payoutMultiplier) + bet.amount;
                winningsThisRound += winAmountForBet;
            }
        }
        
        const netResult = winningsThisRound - totalBetAmount;
        balance += winningsThisRound;
        
        if (netResult > 0) updateMessage(resultMessage + `You won $${netResult.toFixed(2)}!`);
        else if (netResult < 0) updateMessage(resultMessage + `You lost $${Math.abs(netResult).toFixed(2)}.`);
        else updateMessage(resultMessage + "You broke even.");

        totalBetAmount = 0;
        bets = {};
        document.querySelectorAll('.placed-chip-visual').forEach(cv => cv.remove());
        updateBalanceDisplay();
        isSpinning = false;
        clearBetsButton.disabled = false;
        spinButton.disabled = true;
    }

    function updateBalanceDisplay() {
        balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
    }

    function updateMessage(text) {
        messageArea.textContent = text;
    }

    initializeGame();
});

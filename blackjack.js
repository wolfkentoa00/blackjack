document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const balanceDisplay = document.getElementById('balance-display');
    const dealerScoreDisplay = document.getElementById('dealer-score');
    const playerScoreDisplay = document.getElementById('player-score');
    const dealerCardsContainer = document.getElementById('dealer-cards');
    const playerCardsContainer = document.getElementById('player-cards');
    const gameMessage = document.getElementById('game-message');
    const insuranceControls = document.getElementById('insurance-controls');
    const insuranceMessage = document.getElementById('insurance-message');
    const takeInsuranceBtn = document.getElementById('take-insurance-btn');
    const noInsuranceBtn = document.getElementById('no-insurance-btn');
    const betAmountInput = document.getElementById('bet-amount-input');
    const betHalfBtn = document.getElementById('bet-half-btn');
    const betDoubleBtn = document.getElementById('bet-double-btn');
    const betMaxBtn = document.getElementById('bet-max-btn');
    const dealBetBtn = document.getElementById('deal-bet-btn');
    const hitBtn = document.getElementById('hit-btn');
    const standBtn = document.getElementById('stand-btn');
    const doubleDownBtn = document.getElementById('double-down-btn');
    const bettingControlsUI = document.getElementById('betting-controls');
    const inGameActionsUI = document.getElementById('in-game-actions');

    // Game State Variables
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let playerScore = 0;
    let dealerScore = 0;
    let balance = 1000; // Initial balance
    let currentBet = 0;
    let insuranceBet = 0;
    let gameInProgress = false;
    let playerTurn = false;

    const SUITS = ['♥', '♦', '♣', '♠'];
    const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const CARD_VALUE_MAP = {
        'A': 11, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10
    };

    // Card display offsets
    const CARD_X_OFFSET = 70; // Horizontal offset for each new card in a hand
    const CARD_Y_OFFSET = 25; // Vertical offset for each new card in a hand
    const CARD_ELEMENT_WIDTH = 80; // The width of a single card element in pixels

    // --- UTILITY FUNCTIONS ---
    function createDeck() {
        deck = [];
        for (let suit of SUITS) {
            for (let value of VALUES) {
                deck.push({ suit, value });
            }
        }
        shuffleDeck();
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCard(hand, container, isDealer, isHidden = false) {
        if (deck.length === 0) createDeck();
        const card = deck.pop();
        hand.push(card);
        renderCard(card, container, isHidden, hand.length - 1, isDealer, hand);
        return card;
    }

    function renderCard(card, container, isHidden, cardIndex, isDealerHand, currentHandRef) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        if (isHidden) {
            cardDiv.classList.add('face-down');
        } else {
            const color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
            cardDiv.classList.add(color);

            const cardInfoTopLeft = document.createElement('div');
            cardInfoTopLeft.classList.add('card-info-top-left');

            const rankDisplay = document.createElement('div');
            rankDisplay.classList.add('rank');
            rankDisplay.textContent = card.value;
            cardInfoTopLeft.appendChild(rankDisplay);

            const suitDisplay = document.createElement('div');
            suitDisplay.classList.add('suit');
            suitDisplay.textContent = card.suit;
            cardInfoTopLeft.appendChild(suitDisplay);

            cardDiv.appendChild(cardInfoTopLeft);
        }

        // --- Card Positioning Logic ---
        const containerWidth = container.offsetWidth; // Get the current width of the card container div

        // Determine the number of cards currently in the specific hand being rendered.
        // currentHandRef should be the actual hand array (playerHand or dealerHand).
        const handCardCount = currentHandRef && currentHandRef.length > 0 ? currentHandRef.length : 1;

        // Calculate the total visual width that all cards in this hand will occupy.
        // This includes the width of one card, plus the accumulated horizontal offsets for subsequent cards.
        const totalVisualWidthOfHand = (handCardCount - 1) * CARD_X_OFFSET + CARD_ELEMENT_WIDTH;

        // Calculate the starting 'left' position for the first card in the hand
        // to ensure the entire group of cards is centered within the container.
        // It's the center of the container minus half the total width of the hand.
        const baseLeftOffsetForCentering = (containerWidth / 2) - (totalVisualWidthOfHand / 2);

        // The actual 'left' position for the current card (cardIndex) is:
        // the centering offset + its own offset based on its position in the hand.
        cardDiv.style.left = (baseLeftOffsetForCentering + (cardIndex * CARD_X_OFFSET)) + 'px';
        cardDiv.style.top = (cardIndex * CARD_Y_OFFSET) + 'px'; // Stacking offset from the top
        cardDiv.style.zIndex = cardIndex; // Ensures cards stack with later cards on top

        container.appendChild(cardDiv);
        setTimeout(() => cardDiv.classList.add('visible'), 50 + (cardIndex * 100));
    }


    function calculateScore(hand) {
        let score = 0;
        let aceCount = 0;
        for (let card of hand) {
            score += CARD_VALUE_MAP[card.value];
            if (card.value === 'A') {
                aceCount++;
            }
        }
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }
        return score;
    }

    function updateScores() {
        playerScore = calculateScore(playerHand);
        playerScoreDisplay.textContent = playerScore;

        const revealedDealerHand = dealerHand.filter(card => card.isRevealed !== false);
        dealerScore = calculateScore(revealedDealerHand);

        if (dealerHand.length > 1 && dealerHand[1].isRevealed === false) {
             dealerScoreDisplay.textContent = calculateScore([dealerHand[0]]);
        } else {
            dealerScoreDisplay.textContent = dealerScore;
        }
    }

    function updateBalanceDisplay() {
        balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
    }

    function clearTable() {
        dealerCardsContainer.innerHTML = '';
        playerCardsContainer.innerHTML = '';
        dealerScoreDisplay.textContent = '0';
        playerScoreDisplay.textContent = '0';
        gameMessage.textContent = 'Set your bet and click Deal!';
        insuranceControls.classList.add('hidden');
        playerHand = [];
        dealerHand = [];
        insuranceBet = 0;
        playerScoreDisplay.classList.remove('win', 'lose', 'push');
        dealerScoreDisplay.classList.remove('win', 'lose', 'push');
    }

    function toggleControls(showBetting) {
        if (showBetting) {
            bettingControlsUI.classList.remove('hidden');
            inGameActionsUI.classList.add('hidden');
            dealBetBtn.disabled = false;
            betAmountInput.disabled = false;
        } else {
            bettingControlsUI.classList.add('hidden');
            inGameActionsUI.classList.remove('hidden');
            dealBetBtn.disabled = true;
            betAmountInput.disabled = true;
        }
        hitBtn.disabled = false;
        standBtn.disabled = false;
        doubleDownBtn.disabled = false;
    }

    function placeBet() {
        const bet = parseInt(betAmountInput.value);
        if (isNaN(bet) || bet <= 0) {
            gameMessage.textContent = "Please enter a valid bet amount.";
            return false;
        }
        if (bet > balance) {
            gameMessage.textContent = "Insufficient balance for this bet.";
            return false;
        }
        currentBet = bet;
        balance -= currentBet;
        updateBalanceDisplay();
        gameMessage.textContent = `Bet of $${currentBet} placed. Dealing...`;
        return true;
    }

    function startGame() {
        if (gameInProgress) return;
        if (!placeBet()) return;

        gameInProgress = true;
        playerTurn = true;
        clearTable();
        gameMessage.textContent = `Bet: $${currentBet}. Good luck!`;

        createDeck();

        dealCard(playerHand, playerCardsContainer, false);
        playerHand[playerHand.length-1].isRevealed = true;
        dealCard(dealerHand, dealerCardsContainer, true);
        dealerHand[dealerHand.length-1].isRevealed = true;
        dealCard(playerHand, playerCardsContainer, false);
        playerHand[playerHand.length-1].isRevealed = true;
        dealCard(dealerHand, dealerCardsContainer, true, true);
        dealerHand[dealerHand.length-1].isRevealed = false;

        updateScores();
        toggleControls(false);

        if (playerScore === 21) {
            gameMessage.textContent = "Blackjack!";
            playerTurn = false;
            setTimeout(dealerPlaysIfNoBlackjack, 1500);
            return;
        }

        const dealerUpCard = dealerHand[0];
        if (dealerUpCard.value === 'A') {
            offerInsurance();
        } else {
            doubleDownBtn.disabled = !(balance >= currentBet && playerHand.length === 2);
        }
    }

    function dealerPlaysIfNoBlackjack() {
        revealDealerHiddenCard();
        updateScores();

        playerScoreDisplay.classList.remove('win', 'lose', 'push');
        dealerScoreDisplay.classList.remove('win', 'lose', 'push');

        if (dealerScore === 21 && dealerHand.length === 2) {
            gameMessage.textContent = "Dealer Blackjack! It's a Push!";
            playerScoreDisplay.classList.add('push');
            dealerScoreDisplay.classList.add('push');
            balance += currentBet;
        } else if (playerScore === 21) {
            gameMessage.textContent = `Blackjack! You win $${(currentBet * 1.5).toFixed(2)}!`;
            playerScoreDisplay.classList.add('win');
            dealerScoreDisplay.classList.add('lose');
            balance += currentBet + (currentBet * 1.5);
        } else {
            playerTurn = true;
            doubleDownBtn.disabled = !(balance >= currentBet && playerHand.length === 2);
            hitBtn.disabled = false;
            standBtn.disabled = false;
            return;
        }
        endRound();
    }


    function offerInsurance() {
        insuranceControls.classList.remove('hidden');
        insuranceMessage.textContent = `Dealer shows an Ace. Insurance pays 2 to 1. Cost: $${(currentBet / 2).toFixed(2)}`;
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleDownBtn.disabled = true;

        takeInsuranceBtn.onclick = () => handleInsurance(true);
        noInsuranceBtn.onclick = () => handleInsurance(false);
    }

    function handleInsurance(tookInsurance) {
        insuranceControls.classList.add('hidden');
        if (tookInsurance) {
            const insuranceCost = currentBet / 2;
            if (balance < insuranceCost) {
                gameMessage.textContent = "Not enough balance for insurance. Declined.";
            } else {
                insuranceBet = insuranceCost;
                balance -= insuranceBet;
                updateBalanceDisplay();
                gameMessage.textContent = `Insurance bet of $${insuranceBet.toFixed(2)} placed.`;
            }
        } else {
            gameMessage.textContent = "Insurance declined.";
        }

        dealerHand[1].isRevealed = true;
        const dealerHasBJ = calculateScore(dealerHand) === 21 && dealerHand.length === 2;
        dealerHand[1].isRevealed = false;

        playerScoreDisplay.classList.remove('win', 'lose', 'push');
        dealerScoreDisplay.classList.remove('win', 'lose', 'push');

        if (dealerHasBJ) {
            revealDealerHiddenCard();
            updateScores();
            gameMessage.textContent = "Dealer has Blackjack!";
            dealerScoreDisplay.classList.add('win');

            if (insuranceBet > 0) {
                const winnings = insuranceBet * 2;
                balance += insuranceBet + winnings;
                gameMessage.textContent += ` Insurance pays $${winnings.toFixed(2)}!`;
                updateBalanceDisplay();
            }

            if(playerScore !== 21) {
                playerScoreDisplay.classList.add('lose');
            } else {
                balance += currentBet;
                playerScoreDisplay.classList.add('push');
                dealerScoreDisplay.classList.add('push');
                gameMessage.textContent += " Main hand is a Push!";
            }
            endRound();
        } else {
            gameMessage.textContent += (insuranceBet > 0 ? " Insurance bet lost." : " Dealer does not have Blackjack.");
            hitBtn.disabled = false;
            standBtn.disabled = false;
            doubleDownBtn.disabled = !(balance >= currentBet && playerHand.length === 2);
            playerTurn = true;
        }
    }

    function revealDealerHiddenCard() {
        const hiddenCardDiv = dealerCardsContainer.children[1];
        if (hiddenCardDiv && hiddenCardDiv.classList.contains('face-down')) {
            hiddenCardDiv.classList.remove('face-down');
            const cardData = dealerHand[1];
            dealerHand[1].isRevealed = true;

            hiddenCardDiv.innerHTML = '';
            const color = (cardData.suit === '♥' || cardData.suit === '♦') ? 'red' : 'black';
            hiddenCardDiv.classList.add(color);

            const cardInfoTopLeft = document.createElement('div');
            cardInfoTopLeft.classList.add('card-info-top-left');

            const rankDisplay = document.createElement('div');
            rankDisplay.classList.add('rank');
            rankDisplay.textContent = cardData.value;
            cardInfoTopLeft.appendChild(rankDisplay);

            const suitDisplay = document.createElement('div');
            suitDisplay.classList.add('suit');
            suitDisplay.textContent = cardData.suit;
            cardInfoTopLeft.appendChild(suitDisplay);

            hiddenCardDiv.appendChild(cardInfoTopLeft);
        }
    }

    function playerHit() {
        if (!gameInProgress || !playerTurn) return;
        dealCard(playerHand, playerCardsContainer, false);
        playerHand[playerHand.length-1].isRevealed = true;
        updateScores();
        doubleDownBtn.disabled = true;

        if (playerScore > 21) {
            gameMessage.textContent = `Player Busts with ${playerScore}! Dealer wins.`;
            playerScoreDisplay.classList.remove('win', 'lose', 'push');
            dealerScoreDisplay.classList.remove('win', 'lose', 'push');
            playerScoreDisplay.classList.add('lose');
            dealerScoreDisplay.classList.add('win');
            endRound();
        } else if (playerScore === 21) {
            playerStand();
        }
    }

    function playerStand() {
        if (!gameInProgress || !playerTurn) return;
        playerTurn = false;
        gameMessage.textContent = "Player stands. Dealer's turn.";
        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleDownBtn.disabled = true;
        setTimeout(dealerPlay, 1000);
    }

    function playerDoubleDown() {
        if (!gameInProgress || !playerTurn || playerHand.length !== 2) return;
        if (balance < currentBet) {
            gameMessage.textContent = "Not enough balance to double down.";
            doubleDownBtn.disabled = true;
            return;
        }

        balance -= currentBet;
        currentBet *= 2;
        updateBalanceDisplay();
        gameMessage.textContent = `Player doubles down! Bet is now $${currentBet}.`;

        dealCard(playerHand, playerCardsContainer, false);
        playerHand[playerHand.length-1].isRevealed = true;
        updateScores();

        hitBtn.disabled = true;
        standBtn.disabled = true;
        doubleDownBtn.disabled = true;
        playerTurn = false;

        if (playerScore > 21) {
            gameMessage.textContent = `Player Busts with ${playerScore} on double down! Dealer wins.`;
            playerScoreDisplay.classList.remove('win', 'lose', 'push');
            dealerScoreDisplay.classList.remove('win', 'lose', 'push');
            playerScoreDisplay.classList.add('lose');
            dealerScoreDisplay.classList.add('win');
            endRound();
        } else {
            setTimeout(dealerPlay, 1000);
        }
    }

    function dealerPlay() {
        revealDealerHiddenCard();
        updateScores();

        function hitLoop() {
            const currentDealerScore = calculateScore(dealerHand);
            if (currentDealerScore < 17 || (currentDealerScore === 17 && dealerHand.some(c => c.value === 'A' && calculateScore(dealerHand.filter(card => card.value !== 'A')) + 11 === 17))) {
                gameMessage.textContent = "Dealer hits...";
                dealCard(dealerHand, dealerCardsContainer, true);
                dealerHand[dealerHand.length-1].isRevealed = true;
                updateScores();
                const newDealerScore = calculateScore(dealerHand);
                if (newDealerScore > 21) {
                    gameMessage.textContent = `Dealer Busts with ${newDealerScore}! You win $${currentBet}!`;
                    playerScoreDisplay.classList.remove('win', 'lose', 'push');
                    dealerScoreDisplay.classList.remove('win', 'lose', 'push');
                    playerScoreDisplay.classList.add('win');
                    dealerScoreDisplay.classList.add('lose');
                    balance += currentBet * 2;
                    endRound();
                } else {
                    setTimeout(hitLoop, 1000);
                }
            } else {
                determineWinner();
            }
        }
        setTimeout(hitLoop, 500);
    }

    function determineWinner() {
        updateScores();

        const finalPlayerScore = calculateScore(playerHand);
        const finalDealerScore = calculateScore(dealerHand);

        playerScoreDisplay.classList.remove('win', 'lose', 'push');
        dealerScoreDisplay.classList.remove('win', 'lose', 'push');

        if (finalPlayerScore > 21) {
            gameMessage.textContent = `Player Busts! Dealer wins.`;
            playerScoreDisplay.classList.add('lose');
            dealerScoreDisplay.classList.add('win');
        } else if (finalDealerScore > 21) {
            gameMessage.textContent = `Dealer Busts! You win $${currentBet}!`;
            playerScoreDisplay.classList.add('win');
            dealerScoreDisplay.classList.add('lose');
            balance += currentBet * 2;
        } else if (finalPlayerScore > finalDealerScore) {
            gameMessage.textContent = `You win with ${finalPlayerScore} vs ${finalDealerScore}! Pays $${currentBet}.`;
            playerScoreDisplay.classList.add('win');
            dealerScoreDisplay.classList.add('lose');
            balance += currentBet * 2;
        } else if (finalDealerScore > finalPlayerScore) {
            gameMessage.textContent = `Dealer wins with ${finalDealerScore} vs ${finalPlayerScore}.`;
            playerScoreDisplay.classList.add('lose');
            dealerScoreDisplay.classList.add('win');
        } else {
            gameMessage.textContent = `Push! It's a tie with ${finalPlayerScore}.`;
            playerScoreDisplay.classList.add('push');
            dealerScoreDisplay.classList.add('push');
            balance += currentBet;
        }
        endRound();
    }

    function endRound() {
        gameInProgress = false;
        playerTurn = false;
        updateBalanceDisplay();
        toggleControls(true);
        dealBetBtn.textContent = "DEAL";
    }

    // --- EVENT LISTENERS ---
    dealBetBtn.addEventListener('click', () => {
        if (dealBetBtn.textContent === "BET" || dealBetBtn.textContent === "DEAL") {
            startGame();
        }
    });
    hitBtn.addEventListener('click', playerHit);
    standBtn.addEventListener('click', playerStand);
    doubleDownBtn.addEventListener('click', playerDoubleDown);

    betHalfBtn.addEventListener('click', () => {
        let currentVal = parseInt(betAmountInput.value) || 0;
        betAmountInput.value = Math.max(1, Math.floor(currentVal / 2));
    });
    betDoubleBtn.addEventListener('click', () => {
        let currentVal = parseInt(betAmountInput.value) || 0;
        const newBet = Math.min(balance, currentVal * 2);
        betAmountInput.value = newBet > 0 ? newBet : (currentVal > 0 ? currentVal : 1);
    });
    betMaxBtn.addEventListener('click', () => {
        betAmountInput.value = Math.max(1, balance);
    });

    // Initialize Game
    updateBalanceDisplay();
    toggleControls(true);
    dealBetBtn.textContent = "BET";
});

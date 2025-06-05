/* General Styles - Inspired by blackjack.css */
body {
    font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
    background-color: #0f212e; /* Dark blue-grey background */
    color: #e0e0e0; /* Light grey text */
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow-x: hidden; /* Prevent horizontal scroll */
}

#game-container {
    width: 95%;
    max-width: 1000px; /* Max width for the game */
    background-color: #1a2c3a; /* Darker container background */
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-sizing: border-box;
}

/* Header */
#game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #2a3f50; /* Separator line */
    margin-bottom: 15px;
}

#balance-display.balance {
    font-size: 1.2em;
    color: #5cb85c; /* Green for balance, like blackjack */
    font-weight: bold;
}

#game-logo {
    font-size: 1.5em;
    font-weight: bold;
    color: #e0e0e0;
}

#message-area.message {
    font-size: 1em;
    color: #8a9bad; /* Muted color for messages */
    min-width: 150px;
    text-align: right;
}

/* Main Game Area */
#game-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px; /* Space between wheel and table */
    margin-bottom: 20px;
}

/* Wheel Section */
#wheel-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

#wheel-container {
    position: relative;
    width: 320px;
    height: 320px;
    border: 10px solid #2a3f50;
    border-radius: 50%;
    background-color: #0d1721;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.5);
}

#wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    transition: transform 7s cubic-bezier(0.15, 0.45, 0.35, 1);
}

.segment {
    position: absolute;
    width: 50%;
    height: 50%;
    transform-origin: 100% 100%;
    overflow: hidden; /* Hide parts of text container that stick out */
    user-select: none;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.segment-text {
    position: absolute;
    left: -100%; /* Reposition because of the 50% width of parent */
    width: 200%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 120%; /* Pushes text to the outer edge of the circle */
    box-sizing: border-box;
    /* The transform here will be set by JS to un-skew the text */
}

#ball-track {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    border-radius: 50%;
    pointer-events: none;
}

#ball {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255,255,255,0.7);
    z-index: 100;
}

#wheel-center-cover {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    background-color: #2a3f50;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: 5px solid #0d1721;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 50;
}

/* Betting Section */
#betting-section {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
}

#betting-table {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 3px;
    background-color: #004d00;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #003300;
}

.bet-spot {
    background-color: #006600;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    min-height: 45px;
    font-size: 0.9em;
    font-weight: bold;
    user-select: none;
    border-radius: 4px;
    transition: background-color 0.2s ease, transform 0.1s ease;
    position: relative;
}

.bet-spot:hover {
    background-color: #008000;
    transform: scale(1.03);
}

.bet-spot.zero { grid-column: 1 / span 12; background-color: #008000; }
.bet-spot.number.red { background-color: #c00000; }
.bet-spot.number.red:hover { background-color: #e00000; }
.bet-spot.number.black { background-color: #1c1c1c; }
.bet-spot.number.black:hover { background-color: #333333; }

.bet-spot.outside-bet {
    grid-column: span 6;
    padding: 10px 0;
    font-size: 1em;
}
.bet-spot.red-bet { background-color: #c00000; }
.bet-spot.red-bet:hover { background-color: #e00000; }
.bet-spot.black-bet { background-color: #1c1c1c; }
.bet-spot.black-bet:hover { background-color: #333333; }

.placed-chip-visual {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.7em;
    font-weight: bold;
    color: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.5);
    animation: chip-drop-animation 0.3s ease-out;
    pointer-events: none;
}

@keyframes chip-drop-animation {
    from {
        opacity: 0;
        transform: translate(-50%, -70%) scale(0.5);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

/* Footer Controls */
#game-controls {
    padding: 15px 10px;
    border-top: 1px solid #2a3f50;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

#chip-selection-area {
    width: 100%;
    display: flex;
    justify-content: center;
}

.chip-rail {
    display: flex;
    gap: 10px;
    padding: 10px;
    background-color: rgba(0,0,0,0.2);
    border-radius: 25px;
}

.chip {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 0.9em;
    cursor: pointer;
    border: 3px solid transparent;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.chip:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.4);
}

.chip.selected {
    border-color: #ffd700;
    transform: scale(1.15);
    box-shadow: 0 0 10px #ffd700, 0 4px 8px rgba(0,0,0,0.4);
}

.chip[data-value="1"] { background-color: #4CAF50; color: white; }
.chip[data-value="5"] { background-color: #F44336; color: white; }
.chip[data-value="10"] { background-color: #2196F3; color: white; }
.chip[data-value="25"] { background-color: #FFEB3B; color: #333; }
.chip[data-value="100"] { background-color: #9C27B0; color: white; }


#action-buttons-area {
    display: flex;
    gap: 15px;
}

.action-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
    min-width: 120px;
    text-align: center;
}

.action-button.primary-action {
    background-color: #2ecc71;
    color: #fff;
}
.action-button.primary-action:hover { background-color: #27ae60; }

.action-button {
    background-color: #4a5c6a;
    color: #e0e0e0;
}
.action-button:hover { background-color: #5a6c7a; }
.action-button:active { transform: scale(0.97); }

.action-button:disabled {
    background-color: #333;
    color: #777;
    cursor: not-allowed;
}

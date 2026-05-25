const suits = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valueMap = { A: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 11, Q: 12, K: 13 };

let currentCard = null;

const redSuits = ['♥', '♦'];

let deck = [];
let drawnCards = [];

const drawBtn = document.getElementById('draw-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const cardDisplay = document.getElementById('card-display');
const drawnCardsEl = document.getElementById('drawn-cards');
const cardsRemaining = document.getElementById('cards-remaining');

const guessSection = document.getElementById('guess-section');
const higherBtn = document.getElementById('higher-btn');
const lowerBtn = document.getElementById('lower-btn');
const resultMessage = document.getElementById('result-message');


function buildDeck() {
  deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function createCardEl(card, large = false) {
  const el = document.createElement('div');
  const isRed = redSuits.includes(card.suit);
  el.className = `card ${isRed ? 'red' : 'black'}`;

  el.innerHTML = `
    <span>${card.value}</span>
    <span class="suit">${card.suit}</span>
  `;
  return el;
}

function updateRemaining() {
  cardsRemaining.textContent = `Cards remaining: ${deck.length}`;
  drawBtn.disabled = deck.length === 0;
}

function drawCard() {
  if (deck.length === 0) return;

  const card = deck.pop();
  drawnCards.push(card);
  currentCard = card;

  cardDisplay.innerHTML = '';
  cardDisplay.appendChild(createCardEl(card, true));

  drawnCardsEl.innerHTML = '';
  drawnCards.forEach(c => drawnCardsEl.appendChild(createCardEl(c)));

  guessSection.classList.remove('hidden');
  resultMessage.textContent = '';
  resultMessage.className = 'result-message';

  updateRemaining();
}


function resetDeck() {
  buildDeck();
  shuffle();
  drawnCards = [];
  drawnCardsEl.innerHTML = '';
  cardDisplay.innerHTML = '<p class="placeholder">Deck shuffled — draw a card!</p>';
  updateRemaining();
}

function makeGuess(direction) {
  if (deck.length === 0) {
    guessSection.classList.add('hidden');
    return;
  }

  const previousValue = valueMap[currentCard.value];
  drawCard();
  const newValue = valueMap[currentCard.value];

  resultMessage.className = 'result-message';

  if (newValue === previousValue) {
    resultMessage.textContent = "It's a tie!";
    resultMessage.classList.add('tie');
  } else if (
    (direction === 'higher' && newValue > previousValue) ||
    (direction === 'lower'  && newValue < previousValue)
  ) {
    resultMessage.textContent = 'Correct!';
    resultMessage.classList.add('correct');
  } else {
    resultMessage.textContent = 'Wrong!';
    resultMessage.classList.add('wrong');
  }
}

higherBtn.addEventListener('click', () => makeGuess('higher'));
lowerBtn.addEventListener('click',  () => makeGuess('lower'));


drawBtn.addEventListener('click', drawCard);
shuffleBtn.addEventListener('click', resetDeck);

buildDeck();
shuffle();
updateRemaining();

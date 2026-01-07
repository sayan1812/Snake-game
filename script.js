const board = document.querySelector(".board");
const startbutton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerText = highScore;

const blockwidth = 20;
const blockheight = 20;

const cols = Math.floor(board.clientWidth / blockwidth);
const rows = Math.floor(board.clientHeight / blockheight);

let IntervalId = null;
let timeIntervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

let direction = "up";
const blocks = [];
let snake = [
  {
    x: 4,
    y: 3,
  },
];

// # Generate a grid of blocks and map each cell using row-col coordinates
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

// # Render one game frame
function render() {
  let head = null;
// # Place food on the board at its current position
  blocks[`${food.x}-${food.y}`].classList.add("food");
// # Calculate next head position based on current direction
// #   If left  → move head left
// #   If right → move head right
// #   If down  → move head down
// #   If up    → move head up
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
// # Check wall collision
// #   If head goes outside grid → stop game → show game over modal
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(IntervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";

    return;
  }
// # Check self collision
// #   If head overlaps any snake body segment → stop game → game over
  if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    clearInterval(IntervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }
// # Check food collision
// #   If head reaches food position
// #     Remove food from current cell
// #     Generate new random food position
// #     Add food to new cell
// #     Increase snake length
// #     Increase score
// #     Update high score in localStorage if needed
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);

    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }
// # Clear previous snake body from board
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
// # Move snake forward
// #   Add new head to front
// #   Remove last tail segment
  snake.unshift(head);
  snake.pop();
// # Draw updated snake body on board
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}
// # Initialize game state, reset score, start snake movement and game timer
startbutton.addEventListener("click", () => {
  localStorage.removeItem("highScore");
  let highScore = 0;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  IntervalId = setInterval(() => {
    render();
  }, 300);
  timeIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);
    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }
    time = `${min}:${sec}`;
    timeElement.innerText = time;
  }, 1000);
});

// # Reset all game states and restart snake movement from initial position
restartButton.addEventListener("click", restartGame);

function restartGame() {
  score = 0;
  time = `00:00`;
  scoreElement.innerText = score;
  timeElement.innerText = time;
  highScoreElement.innerText = highScore;

  blocks[`${food.x}-${food.y}`].classList.remove("food");

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  modal.style.display = "none";
  snake = [
    {
      x: 4,
      y: 3,
    },
  ];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  IntervalId = setInterval(() => {
    render();
  }, 300);
  direction = "down";
}

// # Listen for keyboard keydown events

// # If ArrowUp key is pressed
// #   Change snake direction to up

// # If ArrowDown key is pressed
// #   Change snake direction to down

// # If ArrowRight key is pressed
// #   Change snake direction to right

// # If ArrowLeft key is pressed
// #   Change snake direction to left
addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  }
});

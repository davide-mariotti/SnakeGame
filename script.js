const boardSize = 50;
const gameBoard = document.getElementById("game-board");
const gameOverDiv = document.getElementById("game-over");
const gameInfoDiv = document.getElementById("game-info");

let snake = [{ x: 5, y: 5 }];
let food = getRandomFoodPosition();
let direction = { x: 1, y: 0 }; // Inizialmente il serpente si muove verso destra

let gameInterval; // Dichiarazione di gameInterval
let speed = 200;
let score = 0;
let startTime;

function getRandomFoodPosition() {
  return { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
}

function isWallCollision(position) {
  return position.x < 0 || position.x >= boardSize || position.y < 0 || position.y >= boardSize;
}

function isSelfCollision(position) {
  return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}

function updateGameBoard() {
  gameBoard.innerHTML = "";

  const foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y + 1;
  foodElement.style.gridColumnStart = food.x + 1;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);

  snake.forEach((segment, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = segment.y + 1;
    snakeElement.style.gridColumnStart = segment.x + 1;
    snakeElement.classList.add("snake");

    if (index === 0) {
      snakeElement.classList.add("head");
    } else if (index === snake.length - 1) {
      snakeElement.classList.add("tail");
    } else {
      snakeElement.classList.add("body");
    }

    gameBoard.appendChild(snakeElement);
  });
  gameInfoDiv.textContent = `Score: ${score} | Speed: ${speed} | Time: ${calculateTimePlayed()}`;
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (isWallCollision(head) || isSelfCollision(head)) {
    clearInterval(gameInterval);
    showGameOver("Game Over!");
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = getRandomFoodPosition();
    speed -= 1;
    clearInterval(gameInterval);
    gameInterval = setInterval(moveSnake, speed);
    score += 1;
  } else {
    snake.pop();
  }

  updateGameBoard();
}

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 1) {
        direction = { x: 0, y: -1 };
      }
      break;
    case "ArrowDown":
      if (direction.y !== -1) {
        direction = { x: 0, y: 1 };
      }
      break;
    case "ArrowLeft":
      if (direction.x !== 1) {
        direction = { x: -1, y: 0 };
      }
      break;
    case "ArrowRight":
      if (direction.x !== -1) {
        direction = { x: 1, y: 0 };
      }
      break;
  }
}

document.addEventListener("keydown", handleKeyPress);

function showGameOver(message) {
  gameOverDiv.textContent = message;
  gameOverDiv.style.display = "block";
  setTimeout(hideGameOver, 50);
}
function hideGameOver() {
  gameOverDiv.style.display = "none";
}

function calculateTimePlayed() {
  const currentTime = new Date();
  const timeElapsed = Math.floor((currentTime - startTime) / 1000); // Tempo trascorso in secondi
  return `${timeElapsed} s`;
}

startTime = new Date();

setInterval(moveSnake, speed);

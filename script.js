document.addEventListener("DOMContentLoaded", event => {
    initializeTheGame();

})


function initializeTheGame() {

    let gameBoard = document.getElementById("gameBoard");
    let upControl = document.getElementById("up");
    let downControl = document.getElementById("down");
    let leftControl = document.getElementById("left");
    let rightControl = document.getElementById("right");
    let snake = document.getElementById("snake");
    let snakeSegments = [snake]
    let food = document.getElementById("food");
    let scoreBoard = document.getElementById("score");
    let gameovercontainer = document.getElementById("gameovercontainer");
    let displayScore = document.getElementById("displayScore")
    let restartBtn = document.getElementById("restartBtn")
    let modeTXT = document.getElementById("mode-text");

    let score = 0;
    let snakeX = 0;
    let snakeY = 0;
    let snakeDx = 0;
    let snakeDy = 0;
    let foodDx = 0;
    let foodDy = 0;
    let dificulty = 25

    let rightVelocity = false;
    let leftVelocity = false;
    let topVelocity = false;
    let bottomVelocity = false;
    let mainInterval;

    // Restart the game once the reload button is clicked in the gameover menu. 🔄
    restartBtn.addEventListener("click", () => { location.reload(); })

    // Spwan the food at a random location every time game loads.....
    spawnFood()

    function moveUP() {
        leftVelocity = false;
        rightVelocity = false;
        bottomVelocity = false;
        topVelocity = true;
    }

    function moveDown() {
        leftVelocity = false;
        rightVelocity = false;
        topVelocity = false;
        bottomVelocity = true;
    }

    function moveLeft() {
        rightVelocity = false;
        bottomVelocity = false;
        topVelocity = false;
        leftVelocity = true;
    }

    function moveRight() {
        leftVelocity = false;
        bottomVelocity = false;
        topVelocity = false;
        rightVelocity = true;
    }


    // ON SCREEN TOUCH CONTROL CODE >> 🕹🕹

    upControl.addEventListener("click", () => {
        moveUP();
    })
    downControl.addEventListener("click", () => {
        moveDown();
    })
    leftControl.addEventListener("click", () => {
        moveLeft();
    })
    rightControl.addEventListener("click", () => {
        moveRight();
    })


    // KEYBOARD CONTROL FOR THE SNAKE 🕹🕹

    document.addEventListener("keydown", (event) => {
        moveSnake(event);
    })

    function moveSnake(event) {
        if (event.key === "w" || event.key == "ArrowUp" || event.key == "W") {
            moveUP();
        }

        if (event.key === "s" || event.key == "ArrowDown" || event.key == "S") {
            moveDown();
        }

        if (event.key === "a" || event.key == "ArrowLeft" || event.key == "A") {
            moveLeft();

        }
        if (event.key === "d" || event.key == "ArrowRight" || event.key == "D") {
            moveRight();
        }
        if (event.key === "r" || event.key === "R") {
            location.reload();
        }
    }


    // MOVING THE SNAKE AUTOMATICALLY (5PX / 40 MS) 🐍🐍

    function startFunction(dificulty) {
        clearInterval(mainInterval);
        mainInterval = setInterval(main, dificulty)
    }

    function main() {
        collisionDetection(snake, food)
        if (topVelocity) {
            if (snakeY >= (gameBoard.offsetTop + 10)) {
                snakeDy -= 5;
            }
            else {

                clearInterval(mainInterval)
                gameoverFunc();
            }
        }

        if (leftVelocity) {
            if (snakeX >= gameBoard.offsetLeft + 10) {
                snakeDx -= 5;
            }
            else {
                clearInterval(mainInterval)
                gameoverFunc();
            }
        }

        if (bottomVelocity) {
            if (snakeY <= gameBoard.offsetHeight - 39) {
                snakeDy += 5;
            }
            else {
                clearInterval(mainInterval)
                gameoverFunc();
            }
        }

        if (rightVelocity) {
            if (snakeX <= gameBoard.offsetWidth - 39) {
                snakeDx += 5;
            }
            else {
                clearInterval(mainInterval)
                gameoverFunc();
            }
        }
        snakeX += snakeDx;
        snakeY += snakeDy;

        snake.style.left = snakeX + "px";
        snake.style.top = snakeY + "px";
        snakeDx = 0;
        snakeDy = 0;

        updateSnakeBody();
        console.log(dificulty)
    }

    // COLLISION DETECTION LOGIC FOR THE FOOD AND SNAKE 🚗🚗

    function collisionDetection() {

        let snakeBoundary = snake.getBoundingClientRect();
        let foodBoundary = food.getBoundingClientRect();

        let isColliding = snakeBoundary.right < foodBoundary.left || snakeBoundary.left > foodBoundary.right || snakeBoundary.bottom < foodBoundary.top || snakeBoundary.top > foodBoundary.bottom;


        if (!isColliding) {
            score += 5
            scoreBoard.innerText = score
            console.log(modeTXT)
            spawnFood();
            growSnake();

            if (score <= 35) {
                dificulty = 25
                modeTXT.textContent = "Easy";
                clearInterval(mainInterval);
                startFunction(dificulty)
            }
            else if (score >= 35 && score < 70) {
                dificulty = 18;
                modeTXT.textContent = "Medium";
                clearInterval(mainInterval);
                startFunction(dificulty)
            }
            else if (score >= 70 && score <= 150) {
                dificulty = 12;
                modeTXT.textContent = "Hard";

                clearInterval(mainInterval);
                startFunction(dificulty);

            }
            else {
                dificulty = 6;
                modeTXT.textContent = "God";
                clearInterval(mainInterval);
                startFunction(dificulty);

            }

        }
    }

    // SNAKE FOOD SPWANING RANDOMLY ON THE GAMEBOARD 🍅🍅

    function spawnFood() {
        foodDx = Math.floor(Math.random() * (gameBoard.offsetWidth - 20));
        foodDy = Math.floor(Math.random() * (gameBoard.offsetHeight - 20));

        food.style.left = foodDx + "px";
        food.style.top = foodDy + "px";
    }


    function gameoverFunc() {

        gameovercontainer.style.display = "flex";
        displayScore.innerText = score;
    }


    function growSnake() {
        const newSegment = document.createElement('div');
        newSegment.classList.add('snakeBody');
        gameBoard.appendChild(newSegment);

        const lastSegment = snakeSegments[snakeSegments.length - 1];
        const lastSegmentRect = lastSegment.getBoundingClientRect();

        newSegment.style.left = lastSegmentRect.left + 'px';
        newSegment.style.top = lastSegmentRect.top + 'px';

        snakeSegments.push(newSegment);
    }

    // UPDATE THE BODY POSITION OF THE SNAKE BEHIND THE MAIN SNAKE HEAD.
    const previousPositions = [];
    function updateSnakeBody() {
        previousPositions.unshift({ x: snakeX, y: snakeY });
        for (let i = 0; i < snakeSegments.length; i++) {
            const currentSegment = snakeSegments[i];

            if (previousPositions.length > i) {
                const prevPosition = previousPositions[i];

                const deltaX = prevPosition.x - snakeX;
                const deltaY = prevPosition.y - snakeY;

                const offsetX = deltaX * (3); // Adjust the multiplier as needed
                const offsetY = deltaY * (3); // Adjust the multiplier as needed

                currentSegment.style.left = (snakeX + offsetX) + "px";
                currentSegment.style.top = (snakeY + offsetY) + "px";
            }
        }
        if (previousPositions.length > snakeSegments.length) {
            previousPositions.pop();
        }

    }

    startFunction(dificulty);

}
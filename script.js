document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-game-btn');
    const gameContainer = document.getElementById('game-container');
    const dog = document.getElementById('dog');
    const obstacle = document.getElementById('obstacle');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');

    let isJumping = false;
    let isGameOver = false;
    let score = 0;
    let highScore = 0;

    startBtn.addEventListener('click', startGame);

    function startGame() {
        isGameOver = false;
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        obstacle.style.left = gameContainer.offsetWidth + 'px';

        moveObstacle();
        incrementScore();
        document.addEventListener('keydown', control);
    }

    function control(e) {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault(); // prevent scroll on spacebar event 
            if (!isJumping) {
                jump();
            }
        }
    }

    function jump() {
        if (isJumping) return;
        isJumping = true;

        let jumpHeight = 190;
        let gravity = 6;
        let dogBottom = parseInt(getComputedStyle(dog).bottom);

        // jump
        let upInterval = setInterval(() => {
            if (dogBottom >= jumpHeight) {
                clearInterval(upInterval);
                // fall
                let downInterval = setInterval(() => {
                    if (dogBottom <= 0) {
                        clearInterval(downInterval);
                        isJumping = false;
                        dogBottom = 0;
                        dog.style.bottom = dogBottom + 'px';
                    } else {
                        dogBottom -= gravity;
                        dog.style.bottom = dogBottom + 'px';
                    }
                }, 20);
            } else {
                dogBottom += gravity;
                dog.style.bottom = dogBottom + 'px';
            }
        }, 20);
    }

    function moveObstacle() {
        let obstacleLeft = gameContainer.offsetWidth;
        const obstacleWidth = parseInt(getComputedStyle(obstacle).width);

        function move() {
            if (isGameOver) return;
            obstacleLeft -= 5;
            obstacle.style.left = obstacleLeft + 'px';

            // detect a collision
            const dogLeft = parseInt(getComputedStyle(dog).left);
            const dogWidth = parseInt(getComputedStyle(dog).width);
            const dogRight = dogLeft + dogWidth;
            const obstacleRight = obstacleLeft + obstacleWidth;
            const dogBottom = parseInt(getComputedStyle(dog).bottom);

            if (
                obstacleLeft < dogRight &&
                obstacleRight > dogLeft &&
                dogBottom <= 50
            ) {
                gameOver();
                return;
            }

            if (obstacleLeft > -obstacleWidth) {
                requestAnimationFrame(move);
            } else {
                obstacleLeft = gameContainer.offsetWidth;
                // delay obstacle, can tinker with it, change dimensions in css. 
                setTimeout(() => {
                    if (!isGameOver) {
                        requestAnimationFrame(move);
                    }
                }, Math.random() * 2000 + 1000);
            }
        }

        requestAnimationFrame(move);
    }

    function incrementScore() {
        if (isGameOver) return;
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        setTimeout(incrementScore, 100);
    }

    function gameOver() {
        isGameOver = true;
        document.removeEventListener('keydown', control);
        alert('Game Over! Your score: ' + score);

        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = 'High Score: ' + highScore;
        }

        resetGame();
    }

    function resetGame() {
        isJumping = false;
        dog.style.bottom = '0px';
        obstacle.style.left = gameContainer.offsetWidth + 'px';
        startBtn.style.display = 'block';
    }
});
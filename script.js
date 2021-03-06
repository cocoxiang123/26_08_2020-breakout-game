const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;

const brickRowCount = 5;
const brickColumnCount = 9;

//Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};
//Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};
//Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};
//Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = j * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = i * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}
//Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}
//Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//Draw score on canvas
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score:${score}`, canvas.width - 100, 30);
}
//Draw bricks on canvas
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}
//Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}
//Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}
//move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall collision(right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; //ball.dx = ball.dx * -1
  }
  //Wall top and bottom
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  //Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }
  //Brick collision
  bricks.forEach((row) => {
    row.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });
  //Hit bottom wall -lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}
//Increase score
function increaseScore() {
  score++;
  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}
//Make all bricks appear
function showAllBricks() {
  bricks.forEach((row) => {
    row.forEach((brick) => (brick.visible = true));
  });
}
//Rules and close event
rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});
//key down event
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}
//key up event
function keyUp(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

//key board event handles
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//Update canvas drawing and animation
function update() {
  moveBall();
  movePaddle();
  //Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

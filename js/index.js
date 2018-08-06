
var oCanvas = $('#myCanvas')[0];
var ctx = oCanvas.getContext('2d');

// 小球初始位置
var x = oCanvas.width / 2;
var y = oCanvas.height - 25;
//小球
var ball = new Ball(x, y);
function Ball(x, y) {
    // 位置
    this.x = x;
    this.y = y;
    // 速度
    this.dx = -4;
    this.dy = -4;
    //颜色
    this.color = '#f44280';
    //半径
    this.radius = 10;
    //画球
    this.drowBall = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
//弹板
var paddle = new Paddle();
function Paddle() {
    //宽,高
    this.height = 15;
    this.width = 90;
    // 位置
    this.x = (oCanvas.width - this.width) / 2;
    this.y = oCanvas.height - this.height;
    //画弹板
    this.drawPaddle = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = '#0000ff';
        ctx.fill();
        ctx.closePath();
    }
}
//砖块
var brick = new Brick();
function Brick() {
    //行,列
    this.row = 5;
    this.col = 6;
    //砖块间的间距
    this.padding = 6;
    //所有砖块总和离上面和左右的距离
    this.top = 35;
    this.left = 15;

    //每个砖块宽高
    this.width = 70;
    this.height = 20;
    //绘画砖块
    this.drawBricks = function () {
        // i列j行
        for (var i = 0; i < this.col; i++) {
            for (var j = 0; j < this.row; j++) {
                if (bricks[i][j].status == 1) {
                    // 每个砖块的位置
                    var brickX = i * (this.width + this.padding) + this.left;
                    var brickY = j * (this.height + this.padding) + this.top;
                    bricks[i][j].x = brickX;
                    bricks[i][j].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, this.width, this.height);
                    ctx.fillStyle = '#8f63cc';
                    ctx.fill();
                    ctx.closePath();
                }

            }

        }

    }
}

//随机砖块生成
var num = 0;
var bricks = [];
var arr =[];
function randomArr(){
        for (var i = 0; i < brick.row * brick.col; i++) {
            arr[i] = Math.random() - 0.4 > 0 ? 1 : 0;
        }
        for (var i = 0; i < brick.col; i++) {
            bricks[i] = [];
            for (var j = 0; j < brick.row; j++) {
                bricks[i][j] = {
                    x: 0,
                    y: 0,
                    status: arr[j * brick.col + i]
                };
                if (bricks[i][j].status == 1) {
                    num++;
                }
                // 砖块显示为1,0为不显示
            }
        }
    
}
randomArr();

//控制开关
var rightPressed = false; //开始之后 键盘控制弹板右移动
var leftPressed = false; //开始之后 键盘控制弹板左移动
var stop_status = true; //停止键是否有效，用来判断游戏结束后不能按停止键；
var stop; //停止动画
var canvas_status = true; //初始未按停止键

var score = 0; //分数初始化
var lives = 3; //生命值初始化
//分数
function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ff4280';
    ctx.fillText('Score:' + score, 15, 20);
}
//生命
function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ff4280';
    ctx.fillText('Lives:' + lives, oCanvas.width - 70, 20);
}
//游戏失败
function drawGO() {
    ctx.font = '30px Arial';
    ctx.fillStyle = '#ff4280';
    ctx.fillText('GameOver', 160, 240);
}
//游戏成功
function success(score){
    if(score == num){
        alert('Congration!');
        document.location.reload(); //方法用于重新加载当前文档。
    }
}

// 砖块消失,球与砖块碰撞条件判断,x,y为小球位置
function collisionDetection() {
    for (var i = 0; i < brick.col; i++) {
        for (var j = 0; j < brick.row; j++) {
            var b = bricks[i][j];
            if (b.status == 1) {
                if (ball.x > b.x && ball.x < b.x + brick.width && ball.y > b.y && ball.y < b.y + brick.height) {
                    // 碰撞,y轴的速度方向改变;
                    ball.dy = -ball.dy;
                    b.status = 0; //砖块消失
                    score++;
                    // 判断是否砖块全部消失,是的话重新开始游戏
                    success(score);
                }
            }
        }
    }
}


function draw() {
    ctx.clearRect(0, 0, oCanvas.width, oCanvas.height);
    ball.drowBall();
    paddle.drawPaddle();
    brick.drawBricks();
    drawScore();
    drawLives();

    collisionDetection();

    if (ball.x + ball.dx > oCanvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
        ball.dx = -ball.dx;
    }
    //到达顶部,
    if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > oCanvas.height - (ball.radius + paddle.height)) { //底部
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) { //盘子接住了球，改变方向
            ball.dy = -ball.dy;
        }
        //如果弹板接不住小球
        else {
            lives--; //生命减少一个
            if (lives == 0) {
                //游戏结束，重置参数
                drawGO(); //结束游戏
                $(".start").attr("flage", "flage"); //设置或返回被选元素的属性值。
                lives = 4; //生命回归四条
                score = 0; //分数变为0
                stop_status = false; //游戏失败,不能按空格停止
                num = 0;
                return;
            } else {
                ball.x = oCanvas.width / 2;
                ball.y = oCanvas.height - 30;
                ball.dx = 4;
                ball.dy = -4;
                paddle.x = (oCanvas.width - paddle.width) / 2; //弹板位置回归中间
            }
        }
    }
    //键盘控制弹板移动
    if (rightPressed && paddle.x < oCanvas.width - paddle.width) { //如果右移弹板的位置小于canvas宽度-弹板宽度
        paddle.x += 5;
    } else if (leftPressed && paddle.x > 0) { //否则如果左移的位置大于0
        paddle.x -= 5;
    }
    ball.x += ball.dx;
    ball.y += ball.dy;
    //    stop = setTimeout(function(){
    //        draw();
    //    },16)
    stop = requestAnimationFrame(draw); //动画继续--与setTimeout相似
}


//键盘右键，左键控制弹板移动开关
function keyDownHandler(e) {
    if (e.keyCode == 39) { //键盘右箭头数字
        rightPressed = true;
    } else if (e.keyCode == 37) { //键盘左箭头数字 
        leftPressed = true;
    } else if (e.keyCode == 32) {
        if (stop_status) { //停止键是否有效，用来判断游戏结束后不能按停止键；
            if (canvas_status) {
                window.cancelAnimationFrame(stop); //可以取消该次动画。
                canvas_status = false;
            } else {
                stop = requestAnimationFrame(draw); //动画继续
                canvas_status = true;
            }
        }
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}
//移动鼠标控制弹板
function mouseMoveHandler(e) {
    var relativeX = e.clientX - oCanvas.offsetLeft; // e.clientX 事件属性返回当事件被触发时鼠标指针向对于浏览器页面（或客户区）的水平坐标。
    if (relativeX >= 0 && relativeX <= oCanvas.width) {

        paddle.x = relativeX - paddle.width / 2; //弹板滑动的位置 
        if (paddle.x < 0) {
            paddle.x = 0;
        }
        if (paddle.x > oCanvas.width - paddle.width) {
            paddle.x = oCanvas.width - paddle.width;
        }
    }
}
$(function () {
    ball.drowBall();
    paddle.drawPaddle();
    brick.drawBricks(); //砖块
    drawScore(); //分数
    drawLives(); //生命

    $(".start").click(function () { //点击开始时
        stop_status = true; //停止键是否有效，用来判断游戏结束后不能按停止键；
        if ($(".start").attr("flage") == "flage") { //设置或返回被选元素的属性值。//判断是否游戏结束之后可以继续点击开始游戏
            //重新开始之后重置砖块
            num = 0;
            for (var i = 0; i < brick.col; i++) {

                bricks[i] = [];
                for (var j = 0; j < brick.row; j++) {
                    bricks[i][j] = {
                        x: 0,
                        y: 0,
                        status: arr[j * brick.col + i]
                    };
                    if (bricks[i][j].status == 1) {

                        num++;
                        console.log(num);
                    }
                    // 砖块显示为1,0为不显示
                }
            }
            $(".start").attr("flage", "");
            draw();
            //实时监听操作键盘和鼠标事件
            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            document.addEventListener("mousemove", mouseMoveHandler, false); //事件监听 滑盘鼠标跟随事件
        }
    })
})

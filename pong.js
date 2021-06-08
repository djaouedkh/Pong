var canvas = document.querySelector('#canvas');
var game;
var playerHeight = 100;
var playerWidth = 5;

// CREATION OF THE FIELD-----------------------------------------------------------
function field(){
    
    // .GETCONTEXT('2D') CREATE A 2D CONTEXT WHERE YOU CAN DRAW
    var context = canvas.getContext('2d');

//---------------------

    // DRAWING OF THE FIELD

    // COLOR IN CONTEXT 2D
    context.fillStyle = 'black';
    // (x starting point horizontal, y starting point vertical, width, height) CONTEXT 2D
    context.fillRect(0, 0, canvas.width, canvas.height);
    

 //-------------------   

    // DRAWING OF THE MEDIAN LINE

    // COLOR LINE
    context.strokeStyle = 'white';
    // CREATION OF THE LINE
    context.beginPath();
    // Line starting point (x,y)
    // in our case so that the line is always in the center we take the width of our canvas that we divide by 2
    context.moveTo(canvas.width / 2, 0);
    // Line ending point (x,y)
    context.lineTo(canvas.width / 2, canvas.height);
    // DISPLAYS THE LINE
    context.stroke();



//---------------------
    
    // DRAWING PLAYERS


    context.fillStyle = 'white';
    
    // PLAYER LEFT
    // (x,y, width, height)
    context.fillRect(0, game.player.y, playerWidth, playerHeight);

    //PLAYER RIGHT
    // in this case the x is defined by the width of the field - width player so that it is inside the field 
    context.fillRect(canvas.width - playerWidth, game.computer.y, playerWidth, playerHeight);

//---------------------

    // DRAWING BALL

    context.beginPath();
    context.fillStyle = 'white';
    // (x,y,rayon,angle depart,angle fin,sens anti horaire)
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
    
    
    
}

// GAME LAUNCH-----------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    play();
});

// GAME OBJECT CONTAINING PLAYER COMPUTER BALL-------------------------------------
    game = {
        player: {
            y: canvas.height / 2 - playerHeight / 2
        },
        computer: {
            y: canvas.height / 2 - playerHeight / 2
        },
        ball: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            r: 10,
            speed: {
                x: 2,
                y: 2
            }
        }
    }

// TRANSLATION BALL--------------------------------------------------------------

function changeDirection(playerPosition) {
    var impact = game.ball.y - playerPosition - playerHeight / 2;
    var ratio = 100 / (playerHeight / 2);
    // VALUE BETWEEN 0 TO 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function collision(player){
    // SI PLAYER MISSES THE BALL
    if (game.ball.y < player.y || game.ball.y > player.y + playerHeight) {
        // PLACE THE BALL AND PLAYER IN THE CENTER
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.player.y = canvas.height / 2 - playerHeight / 2;
        game.computer.y = canvas.height / 2 - playerHeight / 2;
        
        // RESET SPEED
        game.ball.speed.x = 2;
    } 
    // ELSE INCREASES THE SPEED OF THE BALL AND CHANGES THE DIRECTION
    else {       
        game.ball.speed.x *= -1.2;
        changeDirection(player.y);
    }
}


function ballMove(){
    
    // BALL BOUNCES ON THE TOP AND BOTTOM OF THE COURT
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }

    if (game.ball.x > canvas.width - playerWidth) {
        collision(game.computer);
    } 
    else if (game.ball.x < playerWidth) {
        collision(game.player);
    }


    // WE ADD TO BALL.X THE VALUE OF BALL.SPEED.X AND THE SAME FOR Y
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}


function play(){

    field();
    ballMove();
    computerMove();

    // RESTART THE PLAY FUNCTION SEVERAL TIMES TO GET THE IMPRESSION THAT THE BALL IS TRANSLATING
    requestAnimationFrame(play);
}


// MOUSE EVENT--------------------------------------------------------------------

// MOUSE EVENT PLAYER
canvas.addEventListener('mousemove', playerMove);
// EVENT IS A CALLBACK, IN THIS CASE IT IS THE CANVAS
function  playerMove(event) {

    // .GETBOUNDINGCLIENTRECT()  RETRIEVE ALL VALUES OF AN OBJECT (x,y,width,height,top,right...)
    var canvasLocation = canvas.getBoundingClientRect();

    // EVENT.CLIENTY = THE Y POSITION OF THE MOUSE IN THE CANVAS , EVENT => CANVAS
    // WE SUBTRACT FROM EVENTCLIENTY THE Y VALUE OF THE CANVAS WHICH WE RECOVER WITH GetBoundingClientRect()
    var mouseLocation = event.clientY - canvasLocation.y;

    // WE CHANGE THE POSITION Y OF THE PLAYER WITH THE MOUSE AND WE CENTER
    game.player.y = mouseLocation - playerHeight / 2;
    
    if (mouseLocation < playerHeight / 2) {
        game.player.y = 0;
    } else if (mouseLocation > canvas.height - playerHeight / 2) {
        game.player.y = canvas.height - playerHeight;
    } else {
        game.player.y = mouseLocation - playerHeight / 2;
    }



}

// MOUSE EVENT COMPUTER

function computerMove(){
    // WE MODIFY THE Y POSITION OF THE COMPUTER WE ADD THE Y POSITION OF THE BALL 
    // WE MULTIPLY IT BY 0.85 TO GIVE DELAY TO THE COMPUTER
    game.computer.y += game.ball.speed.y * 0.85;
}
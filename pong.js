var canvas = document.querySelector('#canvas');
var game;
var playerHeight = 100;
var playerWidth = 5;

// CREATION DU TERRAIN-----------------------------------------------------------
function terrain(){
    
    // .GETCONTEXT('2D') SERT A CREER UN CONTEXT 2D DONT LEQUEL ON PEUT DESSINER
    var context = canvas.getContext('2d');

//---------------------

    // Dessin du terrain

    // SERT A DONNER UNE COULEUR AU CONTEXT 2D
    context.fillStyle = 'black';
    // (x POINT DE DEPART ABSCISSE, y PT DE DEPART ORDONNEE, LARGEUR, HAUTEUR) DU CONTEXT 2D
    context.fillRect(0, 0, canvas.width, canvas.height);
    

 //-------------------   

    // Dessin de la ligne médiane

    // DONNE UNE COULEUR A LA LIGNE
    context.strokeStyle = 'white';
    // CREER UNE LIGNE
    context.beginPath();
    // GERE LE PT DE DEPART DE LA LIGNE (x,y)
    // dans notre cas pr que la ligne se trouve tjr au centre on prend la largeur de notre canvas qu'on divise par 2
    context.moveTo(canvas.width / 2, 0);
    // GERE LE PT DE DEPART DE LA LIGNE (x,y)
    // cest les coordonnées du pt d'arrivée de la ligne
    context.lineTo(canvas.width / 2, canvas.height);
    // AFFICHE LA LIGNE
    context.stroke();



//---------------------
    
    // Dessin des players


    context.fillStyle = 'white';
    
    // PLAYER LEFT
    // (x,y, LARGEUR, HAUTEUR)
    context.fillRect(0, game.player.y, playerWidth, playerHeight);

    //PLAYER RIGHT
    // dans ce cas le x est defini par largeur du terrain - largeur player pour qu il soit a l'interieur du terrain 
    context.fillRect(canvas.width - playerWidth, game.computer.y, playerWidth, playerHeight);

//---------------------

    // Dessin balle

    context.beginPath();
    context.fillStyle = 'white';
    // (x,y,rayon,angle depart,angle fin,sens anti horaire)
    context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
    context.fill();
    
    
    
}

// LANCEMENT DE TOUS LE JEU-----------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    play();
});

// OBJET GAME CONTENANT PLAYER COMPUTER BALL-------------------------------------
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
    // VALEUR ENTRE 0 ET 10
    game.ball.speed.y = Math.round(impact * ratio / 10);
}

function collision(player){
    // SI PLAYER RATE LA BALLE
    if (game.ball.y < player.y || game.ball.y > player.y + playerHeight) {
        // PLACE BALL ET PLAYER AU CENTRE
        game.ball.x = canvas.width / 2;
        game.ball.y = canvas.height / 2;
        game.player.y = canvas.height / 2 - playerHeight / 2;
        game.computer.y = canvas.height / 2 - playerHeight / 2;
        
        // RESET LA VITESSE
        game.ball.speed.x = 2;
    } 
    // SINON AUGMENTE LA VITESSE DE LA BALL ET CHANGE LA DIRECTION
    else {       
        game.ball.speed.x *= -1.2;
        changeDirection(player.y);
    }
}


function ballMove(){
    
    // BALL REBONDIT SUR LE HAUT ET BAS DU TERRAIN
    if (game.ball.y > canvas.height || game.ball.y < 0) {
        game.ball.speed.y *= -1;
    }

    if (game.ball.x > canvas.width - playerWidth) {
        collision(game.computer);
    } 
    else if (game.ball.x < playerWidth) {
        collision(game.player);
    }


    // ON AJOUTE A BALL.X LA VALEUR DE BALL.SPEED.X ET PAREIL POUR Y
    game.ball.x += game.ball.speed.x;
    game.ball.y += game.ball.speed.y;
}


function play(){

    terrain();
    ballMove();
    computerMove();

    // PERMET DE RELANCER PLUSIEURS FOIS LA FONCTION PLAY POUR AVOIR L IMPRESSION QUE LA BALLE TRANSLATE
    requestAnimationFrame(play);
}


// MOUSE EVENT--------------------------------------------------------------------

// MOUSE EVENT PLAYER
canvas.addEventListener('mousemove', playerMove);
// EVENT EST UN CALLBACK, DANS CE CAS IL S AGIT DU CANVAS
function  playerMove(event) {

    // .GETBOUNDINGCLIENTRECT() PERMET DE RECUPERER TOUTES LES VALEURS D UN OBJET (x,y,width,height,top,right...)
    var canvasLocation = canvas.getBoundingClientRect();

    // EVENT.CLIENTY = LA POSITION Y DE LA SOURIS DANS LE CANVAS CAR EVENT => CANVAS
    //ON SOUSTRAIT A EVENTCLIENTY LA VALEUR Y DU CANVAS QU ON RECUPERER AVEC GetBoundingClientRect()
    var mouseLocation = event.clientY - canvasLocation.y;

    // ON MODIFIE LA POSITION Y DU PLAYER AU MVMT DE LA SOURIS ET ON CENTRE
    game.player.y = mouseLocation - playerHeight / 2;
    
    if (mouseLocation < playerHeight / 2) {
        game.player.y = 0;
    } else if (mouseLocation > canvas.height - playerHeight / 2) {
        game.player.y = canvas.height - playerHeight;
    } else {
        game.player.y = mouseLocation - playerHeight / 2;
    }



}

// -----------------------------------METHODE PLAYERMOVE DJAOUED------------------------------------

    //DJAOUED PLAYER MOVE
// canvasDimension = canvas.getBoundingClientRect();

// canvas.addEventListener('mousemove', function playerMove(e){
    // PERMET DE CENTRER LA SOURIS PAR RAPPORT AU PLAYER
    // game.player.y = (e.y - canvasDimension.y) - playerHeight / 2;

    // BLOQUE LA SOURIS EN HAUT
    // if (game.player.y <= 0) {
    //     game.player.y = 0;
    // }
    // BLOQUE LA SOURIS EN BAS
//     else if (game.player.y >= (canvas.height - playerHeight)) {
//         game.player.y = (canvas.height - playerHeight)
//     }
// })
// ---------------------------------------------------------------------------------------------








// MOUSE EVENT COMPUTER

function computerMove(){
    // ON MODIFIE LA POSITION Y DU COMPUTER ON LUI AJOUTONS LA POSITION LA POSITION Y DE LA BALLE 
    // ON LE MULTIPLIE PAR 0.85 POUR QU IL AI UN PEU DE RETARD ET GAGNE
    game.computer.y += game.ball.speed.y * 0.85;
}
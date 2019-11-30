
var musicaAmbiente = new Audio("res/musica_ambiente.mp3");
musicaAmbiente.loop = true;

var efectos = {
    cannon: "res/Cannon.mp3",
    nivel_final: "res/goal.mp3",
    ganar: "res/win.mp3",
    perder: "res/lose.mp3",
    enemigo_muere: "res/Torpedo+Explosion.mp3",
}

function reproducirMusica() {
    musicaAmbiente.play();
}

function pararMusica() {
    musicaAmbiente.stop();
}

function reproducirEfecto( srcEfecto ) {
    var efecto = new Audio( srcEfecto );
    efecto.play();
}
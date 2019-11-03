// Lista re recursos a precargar
var imagenes = {
    barco_una_vida: "res/barco_jugador_una_vida.png",
    barco_dos_vidas: "res/barco_jugador_dos_vidas.png",
    barco_tres_vidas: "res/barco_jugador_tres_vidas.png",
    fondo_3: "res/fondo.png",
    mensaje_como_jugar : "res/mensaje_como_jugar.png",
    boton_disparo : "res/boton_disparo.png",
    boton_salto : "res/boton_salto.png",
    menu_fondo : "res/menu_fondo.png",
    boton_jugar : "res/boton_jugar.png",
    enemigo : "res/enemigo.png",
    enemigo_movimiento : "res/barco_enemigo.png",
    enemigo_morir : "res/animacion_muerte_enemigo.png",
    bloque_tierra : "res/tile_07.png",
    bloque_tierra_esquina_izquierda : "res/tile_06.png",
    bloque_tierra_esquina_derecha: "res/tile_09.png",
    bloque_tierra_tile_82: "res/tile_82.png",
    disparo_jugador: "res/cannonBall.png",
    jugador: "res/jugador.png",
    jugador_moviendo_abajo: "res/jugador_moviendo_abajo.png",
    jugador_moviendo_arriba:"res/jugador_moviendo_arriba.png",
    jugador_moviendo_derecha:"res/jugador_moviendo_derecha.png",
    jugador_moviendo_izquierda:"res/jugador_moviendo_izquierda.png",
    pad :"res/pad.png",
};


var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice){
    var imagenCargar = new Image();
    imagenCargar.src = rutasImagenes[indice];
    imagenCargar.onload = function(){
        if ( indice < rutasImagenes.length-1 ){
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}

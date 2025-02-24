// Lista re recursos a precargar
var imagenes = {
    barco_una_vida: "res/barco_jugador_una_vida.png",
    barco_dos_vidas: "res/barco_jugador_dos_vidas.png",
    barco_tres_vidas: "res/barco_jugador_tres_vidas.png",
    fondo_3: "res/fondo.png",
    mensaje_como_jugar : "res/como_jugar.png",
    boton_disparo : "res/disparo.png",
    boton_salto : "res/boton_salto.png",
    menu_fondo : "res/portada.png",
    boton_jugar : "res/boton_jugar.png",
    enemigo : "res/enemigo.png",
    no_enemigo : "res/no_enemigo.png",
    enemigo_movimiento_izquierda : "res/barco_enemigo_izquierda.png",
    enemigo_movimiento_derecha : "res/barco_enemigo_derecha.png",
    enemigo_movimiento_arriba : "res/barco_enemigo_arriba.png",
    enemigo_movimiento_abajo : "res/barco_enemigo_abajo.png",
    enemigo_morir : "res/animacion_muerte_enemigo.png",
    no_enemigo_movimiento : "res/barco_no_enemigo.png",
    bloque_tierra : "res/bloque_tierra.png",
    bloque_tierra_combinada: "res/imagenTierraCombinada_4.png",
    bloque_tierra_combinada_2: "res/imagenTierraCombinada_2.png",
    bloque_tierra_combinada_3: "res/imagenTierraCombinada_3.png",
    bloque_tierra_combinada_4: "res/imagenTierraCombinada_5.png",
    disparo_jugador: "res/cannonBall.png",
    disparo_enemigo: "res/bala.png",
    jugador: "res/jugador.png",
    jugador_moviendo_abajo: "res/jugador_moviendo_abajo.png",
    jugador_moviendo_arriba:"res/jugador_moviendo_arriba.png",
    jugador_moviendo_derecha:"res/jugador_moviendo_derecha.png",
    jugador_moviendo_izquierda:"res/jugador_moviendo_izquierda.png",
    pad :"res/pad_reducido.png",
    icono_puntos : "res/icono_puntos.png",
    icono_recolectable : "res/cofre.png",
    tile_destruible : "res/bomba.png",
    tile_vida : "res/vida.png",
    tile_velocidad : "res/rayo.png",
    tile_tiempo : "res/reloj.png",
    recolectable : "res/animacion_cofre.png",
    mensaje_ganar : "res/mensaje_ganar.png",
    mensaje_perder : "res/mensaje_perder.png",
    serpiente_derecha : "res/serpiente_derecha.png",
    serpiente_izquierda : "res/serpiente_izquierda.png",
    boton_dejar_serpiente : "res/boton_serpiente_reducido.png",
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

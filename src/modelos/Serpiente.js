class Serpiente extends Modelo {

    constructor(x, y) {
        super(imagenes.no_enemigo, x, y);

        this.vy = 0;
        this.vx = 0;

        this.orientacion = orientaciones.derecha;

        // Animaciones
        this.aIdleDerecha = new Animacion(imagenes.serpiente_derecha ,
            this.ancho, this.alto, 6, 3);
        this.aIdleIzquierda = new Animacion(imagenes.serpiente_izquierda,
            this.ancho, this.alto, 6, 3);
        this.animacion = this.aIdleDerecha;
    }

    actualizar (){
        // Actualizar animación
        this.animacion.actualizar();

        if (this.orientacion == orientaciones.derecha) {
            this.animacion = this.aIdleDerecha;
        }
        if (this.orientacion == orientaciones.izquierda) {
            this.animacion = this.aIdleIzquierda;
        }
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }

}
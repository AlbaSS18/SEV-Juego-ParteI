class Serpiente extends Modelo {

    constructor(x, y) {
        super(imagenes.no_enemigo, x, y);

        this.vy = 0;
        this.vx = 0;

        // Animaciones
        this.aMoverSerpiente = new Animacion(imagenes.serpiente ,
            this.ancho, this.alto, 6, 3);
        this.animacion = this.aMoverSerpiente;
    }

    actualizar (){
        // Actualizar animación
        this.animacion.actualizar();
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }

}
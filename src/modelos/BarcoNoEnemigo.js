class BarcoNoEnemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.no_enemigo, x, y);
        this.estadoNoEnemigo = estados.moviendo;

        this.vy = 0;
        this.vx = -1;

        // Animaciones
        this.aMoverNoEnemigo = new Animacion(imagenes.no_enemigo_movimiento ,
            this.ancho, this.alto, 6, 3);
        this.aMorirNoEnemigo = new Animacion(imagenes.enemigo_morir,
            this.ancho, this.alto, 6, 3, this.finAnimacionMorirNoEnemigo.bind(this));
        this.animacion = this.aMoverNoEnemigo;
    }

    finAnimacionMorirNoEnemigo() {
        this.estadoNoEnemigo = estados.muerto;
    }

    dibujar(scrollX) {
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }

    actualizar() {
        // Actualizar animación
        this.animacion.actualizar();

        switch (this.estadoNoEnemigo) {
            case estados.moviendo:
                this.animacion = this.aMoverNoEnemigo;
                break;
            case estados.muriendo:
                this.animacion = this.aMorirNoEnemigo;
                break;
        }

        if (this.estadoNoEnemigo == estados.muriendo) {
            this.vx = 0;
        } else {
            if (this.vx == 0) {
                this.vx = -1;
            }
        }
    }

    impactadoNoEnemigo() {
        if (this.estadoNoEnemigo != estados.muriendo) {
            this.estadoNoEnemigo = estados.muriendo;
        }
    }

}
class Enemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.enemigo, x, y);
        this.estado = estados.moviendo;

        this.vy = 0;
        this.vx = -1;

        this.aMover = new Animacion(imagenes.enemigo_movimiento,
            this.ancho, this.alto, 6, 3);
        this.aMorir = new Animacion(imagenes.enemigo_morir,
          this.ancho,this.alto,6,3, this.finAnimacionMorir.bind(this));
        this.animacion = this.aMover;
    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        this.animacion.dibujar(this.x - scrollX, this.y);
    }

    actualizar (){
        // Actualizar animación
        this.animacion.actualizar();

        switch (this.estado){
            case estados.moviendo:
                this.animacion = this.aMover;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

        if ( this.estado == estados.muriendo) {
            this.vx = 0;
        } else {
            if ( this.vx == 0){
                this.vx = -1;
            }
        }
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

}
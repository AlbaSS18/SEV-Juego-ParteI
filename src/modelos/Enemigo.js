class Enemigo extends Modelo {

    constructor(x, y) {
        super(imagenes.enemigo, x, y);
        this.estado = estados.moviendo;

        this.vy = this.devolverVelocidadY();
        this.vx = this.devolverVelocidadX();
        this.numeroAnteriorX;
        this.numeroAnteriorY;

        // Disparo
        this.cadenciaDisparo = 80;
        this.tiempoDisparo = 0;

        // Animaciones
        this.aMover = new Animacion(imagenes.enemigo_movimiento,
            this.ancho, this.alto, 6, 3);
        this.aMorir = new Animacion(imagenes.enemigo_morir,
          this.ancho,this.alto,6,3, this.finAnimacionMorir.bind(this));
        this.animacion = this.aMover;
    }

    devolverVelocidadX(){
        var numero = this.getRandomArbitrary(1,4);
        while(numero == this.numeroAnteriorX){
            numero = this.getRandomArbitrary(1,4);
        }
        this.numeroAnteriorX = numero;
        return this.devolverNumero(numero);

    }

    devolverVelocidadY(){
        var numero = this.getRandomArbitrary(1,4);
        while(numero == this.numeroAnteriorY){
            numero = this.getRandomArbitrary(1,4);
        }
        this.numeroAnteriorY = numero;
        return this.devolverNumero(numero);

    }

    devolverNumero(numero){
        if(numero >= 1 && numero < 2){
            return 0;
        }
        else if(numero >= 2 && numero < 3){
            return -1;
        }
        else {
            return 1;
        }
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
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
                this.vy = -1;
            }
            if(this.x - this.ancho/2 <= 0){
              this.vx = this.devolverVelocidadX();
              this.vy = this.devolverVelocidadY();
            }

            if(this.y - this.alto/2 <= 0){
               this.vx = this.devolverVelocidadX();
               this.vy = this.devolverVelocidadY();
            }

            if(this.y + this.alto/2 >= 320){
                this.vx = this.devolverVelocidadX();
                this.vy = this.devolverVelocidadY();
            }
        }

        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 ) {
            this.tiempoDisparo--;
        }
    }

    disparar(){
        if ( this.tiempoDisparo == 0) {
            // reiniciar Cadencia
            this.estado = estados.disparando;
            this.tiempoDisparo = this.cadenciaDisparo;
            var disparos = [];

            var disparoDerecha = new DisparoEnemigoDerecha(this.x, this.y);
            disparos.push(disparoDerecha);
            var disparoIzquierda = new DisparoEnemigoIzquierda(this.x, this.y);
            disparos.push(disparoIzquierda);
            return disparos;
        } else {
            return null;
        }
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

}
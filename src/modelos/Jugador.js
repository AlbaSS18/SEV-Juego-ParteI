class Jugador extends Modelo {

    constructor(x, y) {
        super(imagenes.jugador , x, y);
        this.vidas = 3;
        this.tiempoInvulnerable = 0;
        this.tiempoMejorVelocidad = 0;
        this.vx = 0; // velocidadX
        this.vy = 0; // velocidadY
        this.estado = estados.moviendo;

        // Disparo
        this.cadenciaDisparo = 30;
        this.tiempoDisparo = 0;

        // Disparo serpiente
        this.cadenciaDisparoSerpiente = 30;
        this.tiempoDisparoSerpiente = 0;

        // Animaciones
        this.aIdleDerecha = new Animacion(imagenes.jugador_moviendo_derecha,
            this.ancho, this.alto, 6, 3);
        this.animacion = this.aIdleDerecha;
        this.aIdleIzquierda = new Animacion(imagenes.jugador_moviendo_izquierda,
            this.ancho, this.alto, 6, 3);
        this.aMoviendoDerecha =
            new Animacion(imagenes.jugador_moviendo_derecha,
                this.ancho, this.alto, 6, 3);
        this.aMoviendoIzquierda = new Animacion(imagenes.jugador_moviendo_izquierda,
            this.ancho, this.alto, 6, 3);
        this.aMoviendoArriba = new Animacion(imagenes.jugador_moviendo_arriba,
            this.ancho, this.alto, 6, 3);
        this.aMoviendoAbajo = new Animacion( imagenes.jugador_moviendo_abajo,
            this.ancho, this.alto, 6, 3);
    }

    actualizar(){

        if (this.tiempoInvulnerable > 0 ){
            this.tiempoInvulnerable --;
        }

        if (this.tiempoMejorVelocidad > 0 ){
            this.tiempoMejorVelocidad --;
        }

        this.animacion.actualizar();

        // Establecer orientación
        if ( this.vx > 0 ){
            this.orientacion = orientaciones.derecha;
        }
        if ( this.vx < 0 ){
            this.orientacion = orientaciones.izquierda;
        }

        if ( this.vy < 0 ){
            this.orientacion = orientaciones.arriba;
        }

        if ( this.vy > 0 ){
            this.orientacion = orientaciones.abajo;
        }

        switch (this.estado){
            case estados.moviendo:
                if ( this.vx != 0 ) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aMoviendoDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aMoviendoIzquierda;
                    }
                }
                if ( this.vx == 0){
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aIdleDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aIdleIzquierda;
                    }
                }
                if ( this.vy != 0){
                    if (this.orientacion == orientaciones.arriba) {
                        this.animacion = this.aMoviendoArriba;
                    }
                    if (this.orientacion == orientaciones.abajo) {
                        this.animacion = this.aMoviendoAbajo;
                    }
                }
                break;
        }

        // Tiempo Disparo
        if ( this.tiempoDisparo > 0 ) {
            this.tiempoDisparo--;
        }

        // Tiempo Disparo
        if ( this.tiempoDisparoSerpiente > 0 ) {
            this.tiempoDisparoSerpiente--;
        }
    }

    moverX (direccion){
        this.vx = direccion * 3;
    }

    moverY (direccion){
        this.vy = direccion * 3;
    }

    crearDisparo(disparo){
        if ( this.orientacion == orientaciones.izquierda ){
            disparo.vx = disparo.vx*-1; //invertir
        }
        else if ( this.orientacion == orientaciones.arriba ){
            disparo.vy = disparo.vx*-1;
            disparo.vx = 0;
        }
        else if ( this.orientacion == orientaciones.abajo ){
            disparo.vy = disparo.vx;
            disparo.vx = 0;
        }
        return disparo;
    }

    disparar(){
        if ( this.tiempoDisparo == 0) {
            // reiniciar Cadencia
            this.tiempoDisparo = this.cadenciaDisparo;
            reproducirEfecto(efectos.cannon);
            var disparos = [];

            var disparo = this.crearDisparo(new DisparoJugador(this.x, this.y));
            disparos.push(disparo);

            var disparoIzquierda = this.crearDisparo(new DisparoJugadorIzquierda(this.x, this.y));
            if(this.orientacion == orientaciones.arriba || this.orientacion == orientaciones.abajo ){
                disparoIzquierda.vx = 9;
            }
            disparos.push(disparoIzquierda);

            var disparoDerecha = this.crearDisparo(new DisparoJugadorDerecha(this.x, this.y));
            if(this.orientacion == orientaciones.arriba || this.orientacion == orientaciones.abajo ){
                disparoDerecha.vx = -9;
            }
            disparos.push(disparoDerecha);

            return disparos;
        } else {
            return null;
        }
    }

    dejarSerpiente(){
        if ( this.tiempoDisparoSerpiente == 0) {
            // reiniciar Cadencia
            this.tiempoDisparoSerpiente = this.cadenciaDisparoSerpiente;
            var disparoSerpiente = new Serpiente(this.x, this.y);
            return disparoSerpiente;

        } else {
            return null;
        }
    }

    dibujar (scrollX){
        scrollX = scrollX || 0;
        if ( this.tiempoInvulnerable > 0) {
            contexto.globalAlpha = 0.5;
            this.animacion.dibujar(this.x - scrollX, this.y);
            contexto.globalAlpha = 1;
        } else {
            this.animacion.dibujar(this.x - scrollX, this.y);
        }

    }

    golpeado (){
        if (this.tiempoInvulnerable <= 0) {
            if (this.vidas > 0) {
                this.vidas--;
                this.tiempoInvulnerable = 100;
                // 100 actualizaciones de loop
            }
        }
    }

    reducirVida(){
        if (this.vidas > 0) {
            this.vidas--;
        }
    }

    mejorarVelocidad(){
        if(this.tiempoMejorVelocidad <= 0){
            this.tiempoMejorVelocidad = 100;
        }
    }

    aumentarVida(){
        this.vidas ++;
    }






}

class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.iniciar();
    }

    iniciar() {
        this.espacio = new Espacio(0);

        this.botonSalto = new Boton(imagenes.boton_salto,480*0.9,320*0.55);
        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);

        this.pad = new Pad(480*0.14,320*0.8);

        this.scrollX = 0;

        this.fondo = new Fondo(imagenes.fondo_3,480*0.5,320*0.5);

        this.disparosJugador = [];
        this.disparosEnemigo = []
        this.enemigos = [];
        this.bloques = [];
        this.tilesDestruiblesDisparo = [];
        this.recolectable = [];


        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);
        this.fondoRecolectable =
            new Fondo(imagenes.icono_recolectable, 480*0.65,320*0.06);
        this.puntos = new Texto(0,480*0.9,320*0.07 );
        this.puntosRecolectables = new Texto(0,480*0.7,320*0.07 );

        this.cargarMapa("res/"+nivelActual+".txt");

    }

    actualizar (){

        if (this.pausa){
            return;
        }

        this.espacio.actualizar();

        this.fondo.vx = -1;
        this.fondo.actualizar();

        // Crear los disparos del enemigo
        for(var i=0; i < this.enemigos.length; i++){
            var disparos = this.enemigos[i].disparar();
            if(disparos != null){
                for(var i=0; i<2; i++){
                    var nuevoDisparo = disparos[i];
                    if ( nuevoDisparo != null ) {
                        this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                        this.disparosEnemigo.push(nuevoDisparo);
                    }
                }
            }
        }

        console.log("disparosJugador: "+this.disparosJugador.length);
        // Eliminar disparos fuera de pantalla
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                !this.disparosJugador[i].estaEnPantalla()){
                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
                i=i-1;
            }
        }

        this.jugador.actualizar();
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].actualizar();
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        for (var i=0; i < this.recolectable.length; i++) {
            this.recolectable[i].actualizar();
        }

        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {

                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);
                this.enemigos.splice(j, 1);
                j = j-1;
            }
        }

        // A partir de aquí solo hago colisiones
        // colisiones

        //colisiones, jugador - enemigo
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }
            }
        }

        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    var enemigo = this.enemigos[j];
                    this.enemigos[j].impactado();

                    for(var x=0; x<3; x++) {
                        var recolectables = new ItemRecolectable(enemigo.x+(x*20),enemigo.y+(x*10));
                        this.espacio.agregarCuerpoDinamico(recolectables);
                        this.recolectable.push(recolectables);
                    }
                    this.puntos.valor++;

                }
            }
        }

        //colisiones, jugador - recolectable
        for (var i=0; i < this.recolectable.length; i++){
            if ( this.jugador.colisiona(this.recolectable[i])){
                this.espacio.eliminarCuerpoDinamico(this.recolectable[i]);
                this.recolectable.splice(i, 1);
                i = i-1;
                this.puntosRecolectables.valor++;
            }
        }


        // colisiones , disparoJugador - bloque
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.bloques.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.bloques[j] != null &&
                    this.disparosJugador[i].colisiona(this.bloques[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                }
            }
        }

        // colisiones , disparoEnemigo - bloque
        for (var i=0; i < this.disparosEnemigo.length; i++){
            for (var j=0; j < this.bloques.length; j++){
                if (this.disparosEnemigo[i] != null &&
                    this.bloques[j] != null &&
                    this.disparosEnemigo[i].colisiona(this.bloques[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosEnemigo[i]);
                    this.disparosEnemigo.splice(i, 1);
                    i = i-1;
                }
            }
        }

        //colisiones, jugador - enemigo
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }
            }
        }

        // colisiones , disparoJugador - tileDestruibleDisparo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.tilesDestruiblesDisparo.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.tilesDestruiblesDisparo[j] != null &&
                    this.disparosJugador[i].colisiona(this.tilesDestruiblesDisparo[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    this.espacio
                        .eliminarCuerpoEstatico(this.tilesDestruiblesDisparo[j]);
                    this.tilesDestruiblesDisparo.splice(j, 1);
                    j = j-1;
                }
            }
        }

        // colisiones , jugador - tileDestruibleDisparo
        for (var i=0; i < this.tilesDestruiblesDisparo.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.espacio
                    .eliminarCuerpoEstatico(this.tilesDestruiblesDisparo[i]);
                this.tilesDestruiblesDisparo.splice(i, 1);
                i = i-1;
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }
            }
        }

        // colisiones , jugador - disparoEnemigo
        for (var i=0; i < this.disparosEnemigo.length; i++){
            if ( this.jugador.colisiona(this.disparosEnemigo[i])){
                this.espacio
                    .eliminarCuerpoEstatico(this.disparosEnemigo[i]);
                this.disparosEnemigo.splice(i, 1);
                i = i-1;
                this.jugador.golpeado();
                if (this.jugador.vidas <= 0){
                    this.iniciar();
                }
            }
        }

    }

    crearRecolectables(){
        for(var x=0; x<3; x++) {
            var recolectables = new ItemRecolectable(this.enemigos[j].x*x,this.enemigos[j].y*x);
            this.espacio.agregarCuerpoDinamico(recolectables);
            this.recolectable.push(recolectables);
        }
    }

    calcularScroll(){
        // limite izquierda
        if ( this.jugador.x > 480 * 0.3) {
            if (this.jugador.x - this.scrollX < 480 * 0.3) {
                this.scrollX = this.jugador.x - 480 * 0.3;
            }
        }

        // limite derecha
        if ( this.jugador.x < this.anchoMapa - 480 * 0.3 ) {
            if (this.jugador.x - this.scrollX > 480 * 0.7) {
                this.scrollX = this.jugador.x - 480 * 0.7;
            }
        }


    }

    dibujar (){

        this.calcularScroll();
        this.fondo.dibujar();

        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].dibujar(this.scrollX);
        }

        this.jugador.dibujar(this.scrollX);
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.tilesDestruiblesDisparo.length; i++){
            this.tilesDestruiblesDisparo[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.recolectable.length; i++){
            this.recolectable[i].dibujar(this.scrollX);
        }


        // HUD --> A partir de aquí son elementos de interfaz
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.fondoRecolectable.dibujar();
        this.puntosRecolectables.dibujar();
        if ( !this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.botonSalto.dibujar();
            this.pad.dibujar();
        }

        if ( this.pausa ) {
            this.mensaje.dibujar();
        }

    }

    procesarControles( ){
        if (controles.continuar){
            controles.continuar = false;
            this.pausa = false;
        }
        // disparar
        if (  controles.disparo ){
            var disparos = this.jugador.disparar();
            if(disparos != null){
                for(var i=0; i<disparos.length; i++){
                    var nuevoDisparo = disparos[i];
                    if ( nuevoDisparo != null ) {
                        this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                        this.disparosJugador.push(nuevoDisparo);
                    }
                }
            }
        }

        // Eje X
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);
        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.jugador.moverY( 1);
        } else if ( controles.moverY < 0 ){
            this.jugador.moverY( -1);
        } else {
            this.jugador.moverY( 0);
        }

    }

    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            this.anchoMapa = (lineas[0].length-1) * 40;
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];
                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = 40/2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y){
        switch(simbolo) {
            case "T":
                var tierra = new Bloque(imagenes.bloque_tierra, x,y);
                tierra.y = tierra.y - tierra.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(tierra);
                this.espacio.agregarCuerpoEstatico(tierra);
                break;
            case "6":
                var tierra = new Bloque(imagenes.bloque_tierra_combinada, x,y);
                tierra.y = tierra.y - tierra.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(tierra);
                this.espacio.agregarCuerpoEstatico(tierra);
                break;
            case "7":
                var tierra = new Bloque(imagenes.bloque_tierra_combinada_2, x,y);
                tierra.y = tierra.y - tierra.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(tierra);
                this.espacio.agregarCuerpoEstatico(tierra);
                break;
            case "8":
                var tierra = new Bloque(imagenes.bloque_tierra_combinada_3, x,y);
                tierra.y = tierra.y - tierra.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(tierra);
                this.espacio.agregarCuerpoEstatico(tierra);
                break;
            case "U":
                var tileDestruible = new TilesDestruibles(imagenes.tile_destruible,x,y);
                tileDestruible.y = tileDestruible.y - tileDestruible.alto/2;
                // modificación para empezar a contar desde el suelo
                this.tilesDestruiblesDisparo.push(tileDestruible);
                this.espacio.agregarCuerpoEstatico(tileDestruible);
                break;
            case "E":
                var enemigo = new Enemigo(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);

        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        this.botonSalto.pulsado = false;
        // suponemos que el pad está sin tocar
        controles.moverX = 0;

        // Suponemos a false
        controles.continuar = false;

        for(var i=0; i < pulsaciones.length; i++){
            // MUY SIMPLE SIN BOTON cualquier click en pantalla lo activa
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }
            if (this.pad.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if ( orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = orientacionX;
                }
                if ( orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = orientacionX;
                }
            }

            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

            if (this.botonSalto.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonSalto.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.moverY = 1;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }

        // No pulsado - Boton Salto
        if ( !this.botonSalto.pulsado ){
            controles.moverY = 0;
        }
    }




}

class GameLayer extends Layer {

    constructor() {
        super();
        reproducirMusica();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.iniciar();
    }

    iniciar() {
        this.espacio = new Espacio(0);

        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.5,320*0.90);

        this.pad = new Pad(480*0.14,320*0.9);

        this.scrollX = 0;

        this.fondo = new Fondo(imagenes.fondo_3,480*0.5,320*0.5);

        this.disparosJugador = [];
        this.disparosEnemigo = []
        this.enemigos = [];
        this.noEnemigos = [];
        this.bloques = [];
        this.tilesDestruiblesDisparo = [];
        this.recolectable = [];
        this.tilesVelocidad = [];
        this.tilesVidas = [];
        this.serpientes = [];
        this.recolectablesCogidos = 0;
        this.tiempo = 900;

        this.fondoPuntos =
            new Fondo(imagenes.icono_puntos, 480*0.85,320*0.05);
        this.fondoRecolectable =
            new Fondo(imagenes.icono_recolectable, 480*0.65,320*0.06);
        this.fondoVida =
            new Fondo(imagenes.tile_vida, 480*0.45,320*0.05);
        this.fondoTiempo =
            new Fondo(imagenes.tile_tiempo, 480*0.20,320*0.05);
        this.puntos = new Texto(0,480*0.9,320*0.07 );
        this.puntosRecolectables = new Texto(0,480*0.7,320*0.07 );
        this.vida = new Texto(3,480*0.5,320*0.07 );
        this.tiempoTexto = new Texto(900,480*0.25,320*0.07 );

        this.cargarMapa("res/"+nivelActual+".txt");

    }

    actualizar (){

        if (this.pausa){
            return;
        }

        if (this.tiempo <= 0){
            if(this.recolectablesCogidos > 0){
                nivelActual++;
                if (nivelActual > nivelMaximo){
                    reproducirEfecto(efectos.nivel_final);
                    nivelActual = 0;
                }
                this.pausa = true;
                this.mensaje =
                    new Boton(imagenes.mensaje_ganar, 480/2, 320/2);
                reproducirEfecto(efectos.ganar);
                this.iniciar();
            }
            else{
                this.pausa = true;
                this.mensaje =
                    new Boton(imagenes.mensaje_perder, 480/2, 320/2);
                reproducirEfecto(efectos.perder);
                this.iniciar();
            }
        }

        this.tiempo--;
        this.tiempoTexto.valor--;

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

        for (var i=0; i < this.noEnemigos.length; i++){
            this.noEnemigos[i].actualizar();
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        for (var i=0; i < this.serpientes.length; i++) {
            this.serpientes[i].actualizar();
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

        // No enemigos muertos fuera del juego
        for (var j=0; j < this.noEnemigos.length; j++){
            if ( this.noEnemigos[j] != null &&
                this.noEnemigos[j].estadoNoEnemigo == estados.muerto  ) {

                this.espacio
                    .eliminarCuerpoDinamico(this.noEnemigos[j]);
                this.noEnemigos.splice(j, 1);
                j = j-1;
            }
        }

        // A partir de aquí solo hago colisiones
        // colisiones

        //colisiones, jugador - enemigo
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.jugador.golpeado();
                this.vida.valor = this.jugador.vidas;
                if (this.jugador.vidas <= 0){
                    reproducirEfecto(efectos.perder);
                    this.iniciar();
                }
            }
        }

        //colisiones, jugador - noenemigo
        for (var i=0; i < this.noEnemigos.length; i++){
            if ( this.jugador.colisiona(this.noEnemigos[i])){
                this.jugador.reducirVida();
                this.vida.valor = this.jugador.vidas;
                if (this.jugador.vidas <= 0){
                    reproducirEfecto(efectos.perder);
                    this.iniciar();
                }
            }
        }

        // colisiones , disparoJugador - Enemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                for(var k=0; k < this.disparosEnemigo.length; k++){
                    if (this.disparosJugador[i] != null &&
                        this.enemigos[j] != null &&
                        this.disparosJugador[i].colisiona(this.enemigos[j])) {

                        this.espacio
                            .eliminarCuerpoDinamico(this.disparosJugador[i]);
                        this.disparosJugador.splice(i, 1);
                        i = i-1;
                        var enemigo = this.enemigos[j];
                        this.enemigos[j].impactado();
                        reproducirEfecto(efectos.enemigo_muere);
                        this.cogerRecolectables(enemigo);
                        this.puntos.valor++;

                    }
                }
            }
        }

        // colisiones , disparoJugador - noEnemigo
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.noEnemigos.length; j++){
                if (this.disparosJugador[i] != null &&
                    this.noEnemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.noEnemigos[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    i = i-1;
                    this.noEnemigos[j].impactadoNoEnemigo();
                    this.jugador.reducirVida();
                    this.vida.valor = this.jugador.vidas;
                    if (this.jugador.vidas <= 0){
                        reproducirEfecto(efectos.perder);
                        this.iniciar();
                    }

                }
            }
        }

        //colisiones, jugador - recolectable
        for (var i=0; i < this.recolectable.length; i++){
            if ( this.jugador.colisiona(this.recolectable[i])){
                this.espacio.eliminarCuerpoDinamico(this.recolectable[i]);
                this.recolectable.splice(i, 1);
                i = i-1;
                reproducirEfecto(efectos.coger_recolectable);
                this.recolectablesCogidos++;
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

        // colisiones , enemigo - bloque
        for (var i=0; i < this.enemigos.length; i++){
            for (var j=0; j < this.bloques.length; j++){
                if (this.enemigos[i] != null &&
                    this.bloques[j] != null &&
                    this.enemigos[i].colisiona(this.bloques[j])) {

                    this.enemigos[i].vx = this.enemigos[i].devolverVelocidadX();
                    this.enemigos[i].vy = this.enemigos[i].devolverVelocidadY();
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
            if ( this.jugador.colisiona(this.tilesDestruiblesDisparo[i])){
                this.espacio
                    .eliminarCuerpoDinamico(this.tilesDestruiblesDisparo[i]);
                this.tilesDestruiblesDisparo.splice(i, 1);
                i = i-1;
                this.jugador.golpeado();
                reproducirEfecto(efectos.tileDestruibleDisparo);
                this.vida.valor = this.jugador.vidas;
                if (this.jugador.vidas <= 0){
                    reproducirEfecto(efectos.perder);
                    this.iniciar();
                }
            }
        }

        // colisiones , jugador - tileVelocidad
        for (var i=0; i < this.tilesVelocidad.length; i++){
            if ( this.jugador.colisiona(this.tilesVelocidad[i])){
                this.espacio
                    .eliminarCuerpoDinamico(this.tilesVelocidad[i]);
                this.tilesVelocidad.splice(i, 1);
                i = i-1;
                this.jugador.mejorarVelocidad();
            }
        }

        // colisiones , jugador - tileVida
        for (var i=0; i < this.tilesVidas.length; i++){
            if ( this.jugador.colisiona(this.tilesVidas[i])){
                this.espacio
                    .eliminarCuerpoDinamico(this.tilesVidas[i]);
                this.tilesVidas.splice(i, 1);
                i = i-1;
                reproducirEfecto(efectos.coger_recolectable);
                this.jugador.aumentarVida();
                this.vida.valor = this.jugador.vidas;
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
                this.vida.valor = this.jugador.vidas;
                if (this.jugador.vidas <= 0){
                    reproducirEfecto(efectos.perder);
                    this.iniciar();
                }
            }
        }

        // colisiones , enemigo - serpiente
        for (var i=0; i < this.serpientes.length; i++){
            for (var j=0; j < this.enemigos.length; j++){
                if (this.serpientes[i] != null &&
                    this.enemigos[j] != null &&
                    this.serpientes[i].colisiona(this.enemigos[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.serpientes[i]);
                    this.serpientes.splice(i, 1);
                    i = i-1;

                    var enemigo = this.enemigos[j];
                    this.enemigos[j].impactado();
                    reproducirEfecto(efectos.enemigo_muere);
                    this.cogerRecolectables(enemigo);
                    this.puntos.valor++;
                }
            }
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

        for (var i=0; i < this.serpientes.length; i++){
            this.serpientes[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].dibujar(this.scrollX);
        }

        this.jugador.dibujar(this.scrollX);
        for (var i=0; i < this.enemigos.length; i++){
            this.enemigos[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.noEnemigos.length; i++){
            this.noEnemigos[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.tilesDestruiblesDisparo.length; i++){
            this.tilesDestruiblesDisparo[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.tilesVelocidad.length; i++){
            this.tilesVelocidad[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.tilesVidas.length; i++){
            this.tilesVidas[i].dibujar(this.scrollX);
        }

        for (var i=0; i < this.recolectable.length; i++){
            this.recolectable[i].dibujar(this.scrollX);
        }


        // HUD --> A partir de aquí son elementos de interfaz
        this.fondoPuntos.dibujar();
        this.puntos.dibujar();
        this.fondoRecolectable.dibujar();
        this.puntosRecolectables.dibujar();
        this.fondoVida.dibujar();
        this.vida.dibujar();
        this.fondoTiempo.dibujar();
        this.tiempoTexto.dibujar();
        if ( !this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.pad.dibujar();
        }

        if ( this.pausa ) {
            this.mensaje.dibujar();
        }

    }

    cogerRecolectables(enemigo){
        for(var x=0; x<3; x++) {
            var recolectables = new ItemRecolectable(enemigo.x+(x*20),enemigo.y+(x*10));
            this.espacio.agregarCuerpoDinamico(recolectables);
            this.recolectable.push(recolectables);
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
        // disparar
        if (  controles.disparoSerpiente ){
            console.log(34);
            var serpiente = this.jugador.dejarSerpiente();
            if ( serpiente != null ) {
                this.espacio.agregarCuerpoDinamico(serpiente);
                this.serpientes.push(serpiente);
                reproducirEfecto(efectos.serpiente);
            }
        }

        // Eje X
        if ( controles.moverX > 0 ){
            this.cambiarVelocidadX(4,1);
        }else if ( controles.moverX < 0){
            this.cambiarVelocidadX(-4,-1);
        } else {
            this.cambiarVelocidadX(0,0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.cambiarVelocidadY(-4,-1);
        } else if ( controles.moverY < 0 ){
            this.cambiarVelocidadY(4,1);
        } else {
            this.cambiarVelocidadY(0,0);
        }

    }

    cambiarVelocidadX(direccionVelocidad, direccionNormal){
        if(this.jugador.tiempoMejorVelocidad > 0){
            this.jugador.moverX(direccionVelocidad);
        }
        else{
            this.jugador.moverX(direccionNormal);
        }
    }

    cambiarVelocidadY(direccionVelocidad, direccionNormal){
        if(this.jugador.tiempoMejorVelocidad > 0){
            this.jugador.moverY(direccionVelocidad);
        }
        else{
            this.jugador.moverY(direccionNormal);
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
                this.espacio.agregarCuerpoDinamico(tileDestruible);
                break;
            case "V":
                var tileVelocidad = new TilesDestruibles(imagenes.tile_velocidad,x,y);
                tileVelocidad.y = tileVelocidad.y - tileVelocidad.alto/2;
                // modificación para empezar a contar desde el suelo
                this.tilesVelocidad.push(tileVelocidad);
                this.espacio.agregarCuerpoDinamico(tileVelocidad);
                break;
            case "S":
                var tileVida = new TilesDestruibles(imagenes.tile_vida,x,y);
                tileVida.y = tileVida.y - tileVida.alto/2;
                // modificación para empezar a contar desde el suelo
                this.tilesVidas.push(tileVida);
                this.espacio.agregarCuerpoDinamico(tileVida);
                break;
            case "F":
                var barcoNoEnemigo = new BarcoNoEnemigo(x,y);
                barcoNoEnemigo.y = barcoNoEnemigo.y - barcoNoEnemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.noEnemigos.push(barcoNoEnemigo);
                this.espacio.agregarCuerpoDinamico(barcoNoEnemigo);
                break;
            case "E":
                var enemigo = new Enemigo(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;

        }
    }

    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        // suponemos que el pad está sin tocar
        controles.moverX = 0;
        controles.moverY = 0;

        // Suponemos a false
        controles.continuar = false;

        for(var i=0; i < pulsaciones.length; i++){
            console.log(controles.moverY);
            // MUY SIMPLE SIN BOTON cualquier click en pantalla lo activa
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }
            if (this.pad.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                var orientacionY = this.pad.obtenerOrientacionY(pulsaciones[i].y);
                if ( orientacionX > 20 && orientacionX < 50) { // de 0 a 20 no contabilizamos
                    if(orientacionY < 20 && orientacionY > -20 ){
                        controles.moverX = orientacionX;
                    }
                }
                if ( orientacionX < -20 && orientacionX > -50) { // de -20 a 0 no contabilizamos
                    if(orientacionY < 20 && orientacionY > -20 ){
                        controles.moverX = orientacionX;
                    }
                }
                if ( orientacionY > 20) { // de -20 a 0 no contabilizamos
                    if(orientacionX < 20 && orientacionX > -20 ){
                        controles.moverY = -orientacionY;
                    }
                }
                if ( orientacionY < -20) { // de -20 a 0 no contabilizamos
                    if(orientacionX < 20 && orientacionX > -20 ){
                        controles.moverY = -orientacionY;
                    }
                }
            }

            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }

        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }
    }




}

/**
 * Clase para manejar valores Ascii
 * 
 * <code>
 * var objAscii = new Ascii( 'Hola mundo!!' );
 * document.write( 'Bin: '+   objAscii.getBin()   +'<br />' );
 * document.write( 'Oct: '+   objAscii.getOct()   +'<br />' );
 * document.write( 'Dec: '+   objAscii.getDec()   +'<br />' );
 * document.write( 'Hex: '+   objAscii.getHex()   +'<br />' );
 * document.write( 'Ascii: '+ objAscii.getAscii() +'<br />' );
 * </code>
 * 
 * @link https://developer.mozilla.org/es/docs/Referencia_de_JavaScript_1.5/Objetos_globales/String/charCodeAt
 * @link https://developer.mozilla.org/es/docs/Referencia_de_JavaScript_1.5/Funciones_globales/parseInt
 * @link http://www.w3schools.com/jsref/jsref_tostring_number.asp
 */
var Ascii = (function () {
    /**
     * Constructor, recibe una cadena de texto, recorre todos los caracteres que 
     * la componen, toma el valor Unicode de cada uno lo convierte a decimal y 
     * almacena internamente su valor en colecciones cuyos elementos estaran 
     * en bases 2, 4, 8, 16 y Unicode 
     * 
     * charCodeAt: Devuelve el código Unicode del carácter que se encuentra en la posición dada por el valor del parámetro pasado
     *      Ejemplo: ( new String('abc') ).charCodeAt(2); retorna 99 que es el código de la letra c
     * 
     * parserInt: Convierte (parsea) un argumento de tipo cadena y devuelve un entero de la base especificada. 
     *      Ejemplo: parseInt(cadena[, base]);
     * 
     * toString: Aplicada en la clase Number lo convierte en una cadena, el retorno puede variar si se señala 
     *      la base del numero empleando el parámetro opcional con un valor entre 2 y 36
     *      Ejemplo: (new Number(15) ).toString(16); retorna F
     * 
     * fromCharCode: Retorna caracteres a partir del o los valores Unicodes pasados como parámetro
     *      Ejemplo: String.fromCharCode(65,66,67); retorna ABC
     */
    function Ascii ( value ) {
        var charDec = null, 
            character = 0, 
            characters = new String( value ),
            length = characters.length,
            limitNumbers = Math.pow(2, 53);
            
        this.dec = 0;
        this.ascii = '';
        
        /* Convierte el valor Ascii a su correspondiente valor decimal */
        for( character; character<length; character++ ) {
            /* Toma el valor decimal del carácter Ascii y verifica que el mismo  
             * no exceda 255, número que representa la tabla Ascii extendida*/
            charDec = parseInt( characters.charCodeAt( character ), 10 );
            if ( parseInt(charDec) > 255 ) {
                throw 'El carácter '+ characters.charAt( character ) +' cuyo valor decimal es '+ charDec +' excede el rango de valores manejados por un juego de caracteres Ascii extendido que debe poseer 256 elementos(0, 255) de modo tal que su representación binaria no exceda los 8bit.';
            }

            /* Suma al valor decimal actual, el nuevo multiplicado por 256 elevado
             * a la posición actual del carácter */
            this.dec = ( charDec * ( Math.pow(256, ( length - character - 1 )) ) ) + this.dec;
            this.ascii += String.fromCharCode( charDec );
            
            /* Verifica que el valor decimal no exceda los manejados por JavaScript */
            if ( this.dec >= limitNumbers ) {
                throw 'La conversión implica un valor decimal('+ this.dec +') que excede el rango entero manejado como Integer por JavaScript(2^53 ó +/- '+ limitNumbers +').';
            }
        }

        /* Empleando el valor decimal, forma las conversiones a base 2, 8 y 16 */
        this.bin = /* this.complete( */ (this.dec).toString(2) /* , 8) */;
        this.oct = /* this.complete( */ (this.dec).toString(8) /* , 3) */;
        this.hex = /* this.complete( */ (this.dec).toString(16).toUpperCase() /* , 2) */;
    }

    /* Atributos estáticos */
    /* var dec = []; */
    
    /* Métodos pribados */
    /* function metod( ) { } */

    /**
     * Complementa la variable chars con tantos ceros a la izquierda que permitan
     * hacer que el largo de la cadena chars sea divisible entre mod
     * Ejemplo: Complete(8, 3); => 008
     */
    Ascii.prototype.complete = function ( val, length ) {
        val = new String(val);
        while ( val.length < length ) {
            val = '0' + val;
        }
        return val;
    };
    /**
     * Quita todos los caracteres que sean ceros a la izquierda
     */
    Ascii.prototype.reduce = function ( value ) {
        value = ( new String( value) ).replace( RegExp('^0*'), '');
        return (value.length) 
            ? value 
            : '0';
    };
    
    /**
     * Retorna el valor Ascii original
     */
    Ascii.prototype.val = function () {
        return this.getAscii();
    };
    
    /**
     * Conversiones: Binario, Hexadecimal, Decimal y Octal
     */
    Ascii.prototype.getBin = function () {
        return this.bin;
    };
    Ascii.prototype.getOct = function () {
        return this.oct;
    };
    Ascii.prototype.getDec = function () {
        return this.dec;
    };
    Ascii.prototype.getHex = function () {
        return this.hex;
    };
    Ascii.prototype.getAscii = function () {
        return this.ascii;
    };
    
    /**
     * Retorna la función constructora con su prototipo preparado
     */
    return Ascii;
})();

/**
 * Clase para manejar valores Octales
 */
var Oct = (function () {
    /**
     * Función constructora
     */
    function Oct ( value ) {
        var charOct = '',
            charsDec = 0,
            chars = Complete(new String(value), 3), 
            length = chars.length,
            character = 0;
            
        /* Convierte el valor octal a decimal */
        for( character; character<length; character++ ) {
            /* Verifica si el valor decimal del carácter actual está comprendido
             * en el dominio octal(0..7) */
            charOct = parseInt( chars.charAt( character ) );
            if ( charOct > 7 ) {
                throw 'El valor '+ chars.charAt( character ) +' esta fuera del rango octal, comprendido entre 0 y 8.';
            }
            
            /* Realiza la suma consecutiva de cada valor octal multiplicado por
             * la potencia de 8 a la posición del número */
            charsDec = charsDec + ( charOct * Math.pow(8, length - character - 1) );
        }

        /* Instancia una clase Dec para que ella maneje las conversiones */
        this.dec = new Dec( charsDec );
    }

    /**
     * Complementa la variable chars con tantos ceros a la izquierda que permitan
     * hacer que el largo de la cadena chars sea divisible entre mod
     * Ejemplos: Complete(8, 2); => 08 / Complete(88, 2); => 88 / Complete(8, 4); => 0008
     */
    function Complete(chars, mod) {
        chars = new String(chars);
        while ( ( chars.length % mod ) != 0 ) {
            chars = '0' + chars;
        }
        return chars;
    }
    
    /**
     * Quita todos los caracteres que sean ceros a la izquierda
     */
    Oct.prototype.reduce = function ( value ) {
        return this.dec.reduce( value );
    };
    
    /**
     * Retorna el valor Octal original
     */
    Oct.prototype.val = function () {
        return this.getOct();
    };
    
    /**
     * Conversiones: Binario, Hexadecimal, Decimal y Octal
     */
    Oct.prototype.getBin = function () {
        return this.dec.getBin();
    };
    Oct.prototype.getOct = function () {
        return this.dec.getOct();
    };
    Oct.prototype.getDec = function () {
        return this.dec.getDec();
    };
    Oct.prototype.getHex = function () {
        return this.dec.getHex();
    };
    Oct.prototype.getAscii = function () {
        return this.dec.getAscii();
    };
    
    /**
     * Retorna la función constructora con su prototipo preparado
     */
    return Oct;
})();

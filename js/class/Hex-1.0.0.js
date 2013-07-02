/**
 * Clase para manejar valores Hexadecimales
 */
var Hex = (function () {
    /**
     * Función constructora
     */
    function Hex ( value ) {
        var charHex = '', 
            charsHex = '', 
            charsAscii = '', 
            chars = Complete(new String( value ), 2),
            length = chars.length,
            character = 0;

        /* Convierte los valores en cadenas Ascii */
        for( character; character<length; character++ ) {
            /* El carácter es forzado a number con base 16([0..9]..[A..F]) si 
             * el carácter no esta comprendido en el rango retornara NaN */
            charHex = chars.charAt( character );
            if ( isNaN( parseInt( charHex, 16) ) == true ) {
                throw 'El valor '+ chars.charAt( character ) +' esta fuera del rango hexadecimal, comprendido entre 0 a 1 y A a F.';
            }
            
            /* Almacena el carácter hasta que se poseea dos */
            charsHex += charHex;
            if ( charsHex.length == 2 ) {
                /* Agrega al apuntador de Ascii un nuevo carácter */
                charsAscii = charsAscii + String.fromCharCode( parseInt(charsHex, 16 ) );
                charsHex = '';
            }
        }

        /* Instancia un objeto tipo Ascii para manejar las conversiones */
        this.ascii = new Ascii( charsAscii );
    }
    /**
     * Complementa la variable chars con tantos ceros a la izquierda que permitan
     * hacer que el largo de la cadena chars sea dibisible entre mod
     * Ejemplo: Complete(8, 3); => 008
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
    Hex.prototype.reduce = function ( value ) {
        return this.ascii.reduce( value );
    };
    
    /**
     * Retorna el valor Hexadecimal original
     */
    Hex.prototype.val = function () {
        return this.getHex();
    };
    
    /**
     * Conversiones: Binario, Hexadecimal, Decimal y Octal
     */
    Hex.prototype.getBin = function () {
        return this.ascii.getBin();
    };
    Hex.prototype.getOct = function () {
        return this.ascii.getOct();
    };
    Hex.prototype.getDec = function () {
        return this.ascii.getDec();
    };
    Hex.prototype.getHex = function () {
        return this.ascii.getHex();
    };
    Hex.prototype.getAscii = function () {
        return this.ascii.getAscii();
    };
    
    /**
     * Retorna la función constructora con su prototipo preparado
     */
    return Hex;
})();

/**
 * Clase para manejar valores Binarios
 */
var Bin = (function () {
    /**
     * Función constructora
     */
    function Bin ( value ) {
        var charDec = null, 
            charsDec = '', 
            character = 0, 
            characters = Complete( new String( value ), 8), 
            charactersAscii = '', 
            length = characters.length;

        /* Convierte los bits en caracteres Ascii */ 
        for( character; character<length; character++ ) {
            /* Verifica que el carácter este comprendido entre el 0 y 1 */
            charDec = parseInt( characters.charAt( character ) ); 
            if ( charDec != 0 && charDec != 1 ) {
                throw 'El valor '+ charDec +' esta fuera del rango binario, comprendido entre 0 y 1.';
            }
            
            /* Almacena el bit en un apuntador */
            charsDec = charsDec +''+ charDec;
            /* Si el apuntador es divisible entre 8 quiere decir que posee 8 caracteres/bit */
            if ( charsDec.length == 8 ) {
                /* Convierte los 8bit en un valor Ascii equivalente */
                charactersAscii = charactersAscii + String.fromCharCode( parseInt(charsDec, 2) );
                charsDec = '';
            }
        }

        /* Instancia una clase Ascii para que maneje las conversiones */
        this.ascii = new Ascii( charactersAscii );
    }

    /**
     * Complementa la variable chars con tantos ceros a la izquierda que permitan
     * hacer que el largo de la cadena chars sea dibisible entre mod
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
     * Complementa la variable chars con tantos ceros a la izquierda que permitan
     * hacer que el largo de la cadena chars sea dibisible entre mod
     * Ejemplo: Complete(8, 3); => 008
     */
    Bin.prototype.complete = function ( val, length, der ) {
        val = new String(val);

        if ( der ) {
            while ( val.length < length ) {
                val = val + '0';
            }
        } else {
            while ( val.length < length ) {
                val = '0' + val;
            }
        }

        return val;
    };
    
    /**
     * Quita todos los caracteres que sean ceros a la izquierda
     */
    Bin.prototype.reduce = function ( value ) {
        value = ( new String( value) ).replace( RegExp('^0*'), '');
        return (value.length) 
            ? value 
            : '0';
    };
    
    /**
     * Complemento A1, remplaza los 0 por 1, como paso intermedio remplaza los ceros 
     * por O para que no se produzca pérdida de valores(ej: 0001 (0x1)> 1111 (1x0)> 0000 )
     * La expresión regular gi permite realizar el remplazo de todas las apariciones
     * del carácter/es buscado/s.
     */
    Bin.prototype.complementoA1 = function ( largo ) {
        var binario = this.ascii.getBin();
        
        /* complmenta con ceros a la izq */
        while ( binario.length < largo ) {
            binario = '0' + binario;
        }
        
        return binario.replace('0', 'O', 'gi')
                      .replace('1', '0', 'gi')
                      .replace('O', '1', 'gi');
    };
    
    /**
     * Complemento A2, luego de aplicar complemento A1 toma el valor decimal 
     * correspondiente al resultado binario y le suma uno, el resultado es 
     * empleado para crea una instancia de Dec con la que se accede al
     * valor binario
     */
    Bin.prototype.complementoA2 = function ( largo ) {
        var binario = /* ( new Bin( */
                    ( new Dec( 
                        ( new Bin( 
                            this.complementoA1( largo ) 
                        ) ).getDec() + 1
                    ) ).getBin()
                /* ) ).getBin(); */
                    
        /* complmenta con ceros a la izq */
        while ( binario.length < largo ) {
            binario = '0' + binario;
        }

        return binario;
    };
    
    /**
     * Retorna el valor Binario original
     */
    Bin.prototype.val = function () {
        return this.getBin();
    };
    
    /**
     * Conversiones: Binario, Hexadecimal, Decimal y Octal
     */
    Bin.prototype.getOct = function () {
        return this.ascii.getOct();
    };
    Bin.prototype.getDec = function  () {
        return this.ascii.getDec();
    };
    Bin.prototype.getHex = function () {
        return this.ascii.getHex();
    };
    Bin.prototype.getAscii = function () {
        return this.ascii.getAscii();
    };
    Bin.prototype.getBin = function () {
        return this.ascii.getBin();
    };
    
    /**
     * Retorna la función constructora con su prototipo preparado
     */
    return Bin;
})();

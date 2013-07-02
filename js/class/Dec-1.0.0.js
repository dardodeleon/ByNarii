/**
 * Clase para manejar valores Decimales
 */
var Dec = (function () {
    /**
     * Función constructora
     */
    function Dec ( value ) {
        /* Convierte el valor a numero */
        var decimal = new Number( value ),
        /* Almacena el límite para números de Javascriot */
            limitNumbers = Math.pow(2, 53);
        /* Verifica si se formó un número y si el mismo no excede el mayor 
         * numero manejado por JavaScript */
        if ( isNaN( decimal ) || decimal >= limitNumbers ) {
            throw 'El valor decimal '+ value +' excede el rango entero manejado como Integer por JavaScript(2^53 ó +/- '+ limitNumbers +').';
        }

        /* Instancia una clase Bin para manejar las conversiones, pasándole  
         * el valor binario que surge del decimal recibido */
        this.bin = new Bin( ( decimal ).toString(2) );
    }

    /**
     * Quita todos los caracteres que sean ceros a la izquierda
     */
    Dec.prototype.reduce = function ( value ) {
        return this.bin.reduce( value );
    };
    
    /**
     * Retorna el valor Decimal original
     */
    Dec.prototype.val = function () {
        return this.getDec();
    };
    
    /**
     * Conversiones: Binario, Hexadecimal, Decimal y Octal
     */
    Dec.prototype.getBin = function () {
        return this.bin.getBin();
    };
    Dec.prototype.getOct = function () {
        return this.bin.getOct();
    };
    Dec.prototype.getHex = function () {
        return this.bin.getHex();
    };
    Dec.prototype.getAscii = function () {
        return this.bin.getAscii();
    };
    Dec.prototype.getDec = function () {
        return this.bin.getDec();
    };
    
    /**
     * Retorna la función constructora con su prototipo preparado
     */
    return Dec;
})();

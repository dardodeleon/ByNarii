/* manejador de errores */
window.onerror = function (message, url, line) {
    if ( typeof DOM.salidaError == 'object' && DOM.salidaError.html ) {
        DOM.salidaError.html( 'Error['+ line +']: '+ message );
    } else {
        alert( 'Error['+ line +']: '+ message );
    }
    return true;
};
/* elementos del DOM que seran empleados */
var DOM = {
    dropdownMenuLinks: 'li .optDropdownMenu', /* .optDropdownMenu === a */
    
    dropdownMenuSigno: '#dropdownMenuSigno', 
    dropdownMenuFraccion: '#dropdownMenuFraccion', 
    dropdownMenuElevado: '#dropdownMenuElevado',  
    dropdownMenuExponente: '#dropdownMenuExponente', 
    dropdownMenuSignoExponente: '#dropdownMenuSignoExponente', 
    
    optDropdownMenuSinFraccion: '#optDropdownMenuSinFraccion', 
    
    inputs: 'input[type=text]', 
    inputEntero: '#entero', 
    inputFraccion: '#fraccion', 
    inputElevado: '#elevado', 
    inputExponente: '#exponente', 
    
    salidaComplementoA1: '#salidaComplementoA1', 
    salidaComplementoA2: '#salidaComplementoA2', 
    salidaError: '#salidaError', 
    salidaValor: '#salidaValor', 
    salidaAscii: '#salidaAscii', 
    salidaBin: '#salidaBin', 
    salidaDec: '#salidaDec', 
    salidaOct: '#salidaOct', 
    salidaHex: '#salidaHex',
    
    tablaRepresentacion: '#tablaRepresentacion',
    
    popover: '.popOver'
};
/* variables empleadas */
var VAR = {
    signoEntero: '+',
    signoExponente: '+',
    /* true si el número actual es una fracción */
    flotante: false, 
    /* espacio de almacenamiento actual, 8, 16, 32, 64 */
    almacenamiento: {}, 
    /* para el caso Ascii no se tiene en cuenta el signo al complementar */
    valorConSigno: false,
    precision: { 
        8: {
            signo: 1,
            exponente: 4,
            mantisa: 3,
            almacena: 8
        },
        16 : {
            signo: 1,
            exponente: 8,
            mantisa: 7,
            almacena: 16
        },
        32 : { /* simple */
            signo: 1,
            exponente: 8,
            mantisa: 23,
            almacena: 32
        }, 
        64 : { /* doble */
            signo: 1,
            exponente: 11,
            mantisa: 52,
            almacena: 64
        }
    } 
};
/* funciones empleadas */
var selectSigno = function (input, title, value, caption ) {
    VAR.signoEntero = (value == '-') ? '-' :  '+';
    
    representar();
};
var selectSignoExponente = function (input, title, value, caption ) {
    VAR.signoExponente = (value == '-') ? '-' :  '+';
    
    representar();
};
var selectBase = function (input, title, value, caption ) {
    var mensaje = '', 
        filter = function (arr, inarray) {
        array = [];

        for (i in arr) {
            if ( jQuery.inArray(arr[i], inarray) >= 0 ) {
                array.push( arr[i] );
            }
        }

        return array;
    };
    VAR.valorConSigno = true;
    DOM.dropdownMenuSigno.removeClass('disabled');
    DOM.dropdownMenuFraccion.removeClass('disabled');
    /* DOM.dropdownMenuElevado - DOM.dropdownMenuExponente */
    switch ( value ) {
        case 'hex':
            mensaje = 'Permitirá ingresar Hex';
            DOM.inputEntero.val( filter(DOM.inputEntero.val().split(''), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f']).join('') );
            DOM.inputFraccion.val( filter(DOM.inputFraccion.val().split(''), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f']).join('') );
            break;
        case 'oct':
            mensaje = 'Permitirá ingresar Oct';
            DOM.inputEntero.val( filter(DOM.inputEntero.val().split(''), ['0', '1', '2', '3', '4', '5', '6', '7', '8']).join('') );
            DOM.inputFraccion.val( filter(DOM.inputFraccion.val().split(''), ['0', '1', '2', '3', '4', '5', '6', '7', '8']).join('') );
            break;
        case 'dec':
            mensaje = 'Permitirá ingresar Dec';
            DOM.inputEntero.val( filter(DOM.inputEntero.val().split(''), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']).join('') );
            DOM.inputFraccion.val( filter(DOM.inputFraccion.val().split(''), ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']).join('') );
            break;
        case 'ascii':
        default:
            VAR.valorConSigno = false;
            mensaje = 'Permitirá ingresar Ascii';     
            DOM.dropdownMenuSigno.addClass('disabled');
            DOM.dropdownMenuFraccion.addClass('disabled');
            /* asegura que no esté seleccionada la opción de 
             * fracción ya que los ascii no la requieren; como se 
             * producía conflicto al cerrar los selectores con 
             * dropdown se establece la operación para 1/2 después
             * de modo que el evento actual finalice y cierre el menú */
            window.setTimeout(function () {
                DOM.optDropdownMenuSinFraccion.trigger('click')
                                              .dropdown('toggle');
            }, 250);                           
    }
    DOM.inputEntero.attr('placeholder', mensaje)
                   .data('baseDato', value); 
    DOM.inputFraccion.attr('placeholder', mensaje)
                     .data('baseDato', value); 

    representar();
};
var selectFraccion = function (input, title, value, caption ) {
    DOM.dropdownMenuElevado.removeClass('disabled'); 
    DOM.dropdownMenuExponente.removeClass('disabled');
    DOM.dropdownMenuSignoExponente.removeClass('disabled');
    switch ( value ) {
        case 'cf':
            VAR.flotante = true;
            DOM.inputFraccion.removeAttr('disabled');
            /* DOM.inputElevado.removeAttr('disabled'); */
            DOM.inputExponente.removeAttr('disabled');
            break;
        case 'sf':
        default:
            VAR.flotante = false;
            DOM.inputFraccion.attr('disabled', true);
            /* DOM.inputElevado.attr('disabled', true); */
            DOM.inputExponente.attr('disabled', true);
            DOM.dropdownMenuElevado.addClass('disabled'); 
            DOM.dropdownMenuExponente.addClass('disabled');
            DOM.dropdownMenuSignoExponente.addClass('disabled');
    }
    
    representar();
}; 
var selectElevado = function (input, title, value, caption ) {
    var mensaje = '';
    switch ( value ) {
        case 'hex':
            mensaje = 'Permitirá ingresar Hex';
            break;
        case 'oct':
            mensaje = 'Permitirá ingresar Oct';
            break;
        case 'dec':
        default:
            mensaje = 'Permitirá ingresar Dec';
    }
    DOM.inputElevado.attr('placeholder', mensaje)
                    .data('baseDato', value); 

    representar();
}; 
var selectExponente = function (input, title, value, caption ) {
    var mensaje = '';
    switch ( value ) {
        case 'hex':
            mensaje = 'Permitirá ingresar Hex';
            break;
        case 'oct':
            mensaje = 'Permitirá ingresar Oct';
            break;
        case 'dec':
        default:
            mensaje = 'Permitirá ingresar Dec';
    }
    DOM.inputExponente.attr('placeholder', mensaje)
                      .data('baseDato', value);  
    
    representar();
};
var selectRepresentacion = function (input, title, value, caption) {
    if ( VAR.precision[value] ) {
        VAR.almacenamiento = VAR.precision[value];

        representar();
        
        return true;
    }
    
    DOM.salidaError.html('La precision seleccionada('+ value +') no esta prevista.')
                   .show();
};          
var representar = function () {
    var binario = '', 
        head = '', 
        body = '',
        bits = false,
        almacenamiento = VAR.almacenamiento,
        exponente = 0;
        
    /* muestra las conversiones posibles para el valor dado */
    DOM.salidaError.hide()
                   .html('');
    
    /* dependiendo del tipo de valor a ingresar solicita la interpretación 
     * correspondiente, entero o fracción */
    try {
        if ( VAR.flotante ) {
            binario = representarFraccion();
        } else {
            binario = representarEntero();
        }
    } catch ( e ) {
        /* si las representaciones produjeron una excepción
         * limpia los contenedores de diagnóstico, muestra el error 
         * y finaliza la función */
        DOM.tablaRepresentacion.html('');
        
        DOM.salidaComplementoA1.html( '...' );
        DOM.salidaComplementoA2.html( '...' );
        DOM.salidaValor.html( '...' );
        DOM.salidaAscii.html( '...' );
        DOM.salidaBin.html( '...' );
        DOM.salidaDec.html( '...' );
        DOM.salidaOct.html( '...' );
        DOM.salidaHex.html( '...' );
        DOM.salidaError.html(e)
                       .show();
        
        return false;
    }
    
    /* complementa con ceros a la izquierda */
    while ( binario.length < almacenamiento.almacena ) {
        binario = '0' + binario;
    }
        
    /* Verifica que no supere los bit de almacenamiento */
    if ( binario.length > almacenamiento.almacena ) {
        DOM.tablaRepresentacion.html('');
        DOM.salidaError.html('El valor binario('+ binario +') excede el espacio de almacenamiento actual('+ almacenamiento.almacena +')')
                       .show();
        
        return false;
    }
    
    /* verifica el signo con el primer bit */
    if ( ( binario.charAt( 0 ) == '1' &&  VAR.signoEntero == '+' ) || ( binario.charAt( 0 ) == '0' &&  VAR.signoEntero == '-' ) ) {
        DOM.tablaRepresentacion.html('');
        DOM.salidaError.html('El valor binario('+ binario +') posee como primer bit '+ binario.charAt( 0 ) +' cuando su signo es '+ ( VAR.signoEntero == '+' ? 'positivo' : 'negativo') +', debiendo ser '+ ( VAR.signoEntero == '+' ? 0 : 1) +'.')
                       .show();
        
        return false;
    }
    
    /* realiza las filas y columnas de la tabla, representando grupos de a 
     * 8bit y debajo si esta en punto flotante el exponente y manrisa */
    exponente = almacenamiento.exponente + 1;
    for (i = 0; i < almacenamiento.almacena; i++) {
        bits = ( (i % 8) == 0 ) ? !bits : bits;
        head += '<th style="background-color: #'+ ( bits ? 'FFF' : 'EEE' ) +';">'+
                '<small>'+ 
                    ( ( (i % 8) == 0 ) 
                        ? '7' 
                        : '' ) + 
                    ( ( (i % 8) == 7 ) 
                        ? '0' 
                        : '' ) +
                '</small>'+
            '</th>', 
        body += '<td style="background: #'+ 
                ( ( VAR.flotante && i != 0 && exponente > 0 ) 
                    ? 'F5F5F5' 
                    : 'FFF') +';">'+ 
                binario.charAt(i) +
            '</td>'
        exponente--;
    }   

    /* forma la tabla de representación */
    DOM.tablaRepresentacion.html(
        '<thead>'+
            '<tr>'+ head +'</tr>'+
        '</thead>'+
        '<tbody>'+
            '<tr>'+ body +'</tr>'+
        '</tbody>'
    );
};
var representarEntero = function () {
    var binario = null,
        objConversion = null;
    try {
        /* crea la instancia del manejador de conversiones que corresponda */
        switch ( DOM.inputEntero.data('baseDato') ) {
            case 'ascii': 
                objConversion = new Ascii( DOM.inputEntero.val() ); 
                break;
            case 'hex':   
                objConversion = new Hex( DOM.inputEntero.val() );   
                break;
            case 'oct':   
                objConversion = new Oct( DOM.inputEntero.val() );   
                break;
            case 'dec':   
                objConversion = new Dec( DOM.inputEntero.val() );   
                break;
        }
        
        /* produce una excepción si no fue posible realizar la instancia de la 
         * base seleccionada */
        if ( objConversion == null) {
            throw 'El valor entero se encuentra en base '+ DOM.inputEntero.data('baseDato') +' que no está prevista.';
        }
        
        /* realiza el diagnostico para la base actual */
        var objBin = new Bin( objConversion.getBin() );
        DOM.salidaValor.html( (( VAR.valorConSigno ) ? VAR.signoEntero + ' ' : '') + objConversion.val() );
        DOM.salidaAscii.html( objConversion.getAscii() +' <sub>('+ objConversion.getAscii().length +' caracteres)</sub>' );
        DOM.salidaComplementoA1.html( objBin.complementoA1() );
        DOM.salidaComplementoA2.html( objBin.complementoA2() );
        DOM.salidaBin.html( objConversion.getBin() );
        DOM.salidaDec.html( objConversion.getDec() );
        DOM.salidaOct.html( objConversion.getOct() );
        DOM.salidaHex.html( objConversion.getHex() );
        
        /* almacena el valor a retornar */
        binario = objConversion.getBin();
        
        /* el valor no es ASCII, es negativo si y solo si su valor decimal es mayor cero */
        if ( VAR.valorConSigno && VAR.signoEntero == '-' && objConversion.getDec() > 0 ) {
            /* aplica complemento A2 */
            objConversion = new Bin( binario );
            binario = objConversion.complementoA2( VAR.almacenamiento.almacena );
        } 
        
    } catch (e) {
        throw e;
    }
    
    return binario
};
var representarFraccion = function () {
    var entero = DOM.inputEntero.val(),
        fraccion = DOM.inputFraccion.val();

    /* verifica que el valor entero y fracción sean mayores que cero */
    if ( ( entero.length <= 0 /* || isNaN(parseInt(entero)) */ || parseInt(entero) == 0 ) && ( fraccion.length <= 0 /* || isNaN(parseInt(fraccion)) */ || parseInt(fraccion) == 0 ) ) {
        /* si el valor es positivo se retorna 0 */
        if ( VAR.signoEntero == '+' ) {
            return '0'
        }
        /* de lo contrario se produce una excepción */
        throw 'El valor ingresado presenta la parte entera y/o fraccionaria como NaN(Not a Number) o cero. Si bien puede ser almacenado como cero, esto solo esta permitido cuando el signo es positivo.';
    }

    /* convierte en cero los valores NaN o vacíos que hayan pasado el control */
    entero = ( entero.length <= 0 && ( isNaN(parseInt(entero)) || parseInt(entero) == 0 ) ) ? 0 : entero;  
    fraccion = ( fraccion.length <= 0 && ( isNaN(parseInt(fraccion)) || parseInt(fraccion) == 0 ) ) ? 0 : fraccion;  

    /* alimenta el diagnostico inferior, en este caso las conversiones quedan vacías */
    DOM.salidaValor.html( (( VAR.valorConSigno ) ? VAR.signoEntero + ' ' : '') + entero +'.'+ fraccion +'<sub class="base">'+ DOM.inputEntero.data('baseDato') +'</sub> '+ DOM.inputElevado.val() +'<sub class="base">'+ DOM.inputElevado.data('baseDato') +'</sub><sup>'+ VAR.signoExponente + DOM.inputExponente.val() +'<sub class="base">'+ DOM.inputExponente.data('baseDato') +'</sub></sup>' );
    DOM.salidaAscii.html( '...' );
    DOM.salidaComplementoA1.html( '...' );
    DOM.salidaComplementoA2.html( '...' );
    DOM.salidaBin.html( '...' );
    DOM.salidaDec.html( '...' );
    DOM.salidaOct.html( '...' );
    DOM.salidaHex.html( '...' );
                
    if ( entero != 0 ) {
        return representarFraccionMayorCero(entero, fraccion);
    }
    
    /* si el valor entero comienzo por 0 */
    return representarFraccionMenorCero(fraccion);
};
var representarFraccionMayorCero = function (entero, fraccion) {
    var elevado = DOM.inputElevado.val(), 
        exponente = DOM.inputExponente.val(), 
        almacenamiento = VAR.almacenamiento, 
        /* valores binarios que se devolverán */
        binarioSigno = ( VAR.signoEntero == '-') ? '1' : '0', 
        binarioExponente = '', 
        binarioMantisa = ''
    switch ( DOM.inputEntero.data('baseDato') ) {
        case 'hex':   
            valEntero = new Hex( entero );   
            valFraccion = new Hex( fraccion );   
            break;
        case 'oct':   
            valEntero = new Oct( entero );   
            valFraccion = new Oct( fraccion );   
            break;
        case 'dec':   
            valEntero = new Dec( entero );   
            valFraccion = new Dec( fraccion );   
            break;
    }  
    switch ( DOM.inputExponente.data('baseDato') ) {
        case 'hex':   
            valExponente = new Hex( exponente );   
            break;
        case 'oct':   
            valExponente = new Oct( exponente );   
            break;
        case 'dec': 
            valExponente = new Dec( exponente );   
            break;
    }

    /* produce una excepción si no fue posible realizar la instancia de la 
     * base seleccionada */
    if ( valEntero == null || valExponente == null ) {
        throw 'El valor entero('+ DOM.inputEntero.data('baseDato') +'), fracción('+ DOM.inputEntero.data('baseDato') +') o exponente('+ DOM.inputExponente.data('baseDato') +') no pudo ser inicializado porque la base en la que se encuentra no esta prevista.';
    }

    /* convierte la parte entera a binario */
    var valBinEntero = valEntero.getBin();
    /* almacena en la mantisa el binario sin el primer carácter(el primer 1) */
    var valBinMantisa = valBinEntero.substr(1);
    /* almacena el largo de la mantisa para: completarla y sumarlo como movimiento 
     * de la coma al valor decimal del exponente */
    var largoMantisa = valBinMantisa.length;
    /* completa con bits la mantisa de forma tal que supere en dos el espacio 
     * para almacenarla; como el bucle contempla la posición 0 se suma uno al 
     * espacio de almacenamiento de la mantisa  */
    valBinMantisa += complementarConFraccion(largoMantisa, almacenamiento.mantisa, fraccion);
    /* toma los ultimos tres caracteres para realizar el redondeo */
    var realizarRedondeo = valBinMantisa.substr(almacenamiento.mantisa-1);
    /* quita los dos últimos bits seleccionando desde el primer carácter hasta
     * el largo de la mantisa */
    valBinMantisa = valBinMantisa.substr(0, almacenamiento.mantisa);
    /* si los últimos tres bit poseen al menos dos bit 1 juntos, suma uno al valor binario */
    if ( realizarRedondeo == '011' || realizarRedondeo == '110' || realizarRedondeo == '111' ) {
        /* crea una instancia de Bin con el valor binario, solicita su conversión
         * a decimal y le suma uno, crea una nueva instancia de decimal y 
         * solicita su conversión a binario */
        valBinMantisa = ( new Dec( 
                            ( new Bin( valBinMantisa ) ).getDec() + 1 
                        ) ).getBin();
    }
    /* almacena la mantisa */
    binarioMantisa += valBinMantisa;

    /* pasa el exponente a decimal */
    var valDecExponente = valExponente.getDec();
    /* si es negativo lo convierte quitándole al valor su doble */
    valDecExponente = valDecExponente - ( ( VAR.signoExponente == '-' ) ? ( valDecExponente * 2 ): 0 );
    /* convierte el valor del exponente al equivalente en base 2 */
    valDecExponente = convertirExponente(valDecExponente, elevado);
    /* le suma las posiciones que se movió la coma en la parte entera, para 1=0
     * otro valor > 1 n posiciones(F = 1111 = 3); */
    valDecExponente = valDecExponente + largoMantisa;
    /* suma sesgo */
    valDecExponente = valDecExponente + sesgo( almacenamiento.exponente );
    /* crea una instancia de Dec para pasar el valor a binario */
    valDecExponente = new Dec( valDecExponente );
    /* complementa el exponente con ceros a la izquierada */
    valDecExponente = new Bin( valDecExponente.getBin() );
    /* almacena el exponente, completo de ceros a la izquierda  */
    binarioExponente += valDecExponente.complete( valDecExponente.getBin(), almacenamiento.exponente);

    /* verifica si los bits del exponente exceden el espacio de almacenamiento 
     * asignado; de todos modos el sistema fallaría al almacenarse */
    if ( valDecExponente.getBin().length > almacenamiento.exponente ) {
        throw 'El exponente('+ valDecExponente.getBin() +') excede el espacio de almacenamiento asignado en esta estructura('+ almacenamiento.exponente +' bits).';
    }
    
    return binarioSigno +''+ binarioExponente +''+ binarioMantisa;
};
var representarFraccionMenorCero = function (fraccion) {
    var elevado = DOM.inputElevado.val(), 
        exponente = DOM.inputExponente.val(), 
        almacenamiento = VAR.almacenamiento, 
        /* valores binarios que se devolverán  */
        binarioSigno = ( VAR.signoEntero == '-') ? '1' : '0', 
        binarioExponente = '', 
        binarioMantisa = ''
    switch ( DOM.inputFraccion.data('baseDato') ) {
        case 'hex':
            valFraccion = new Hex( fraccion );   
            break;
        case 'oct':
            valFraccion = new Oct( fraccion );   
            break;
        case 'dec':
            valFraccion = new Dec( fraccion );   
            break;
    }  
    switch ( DOM.inputExponente.data('baseDato') ) {
        case 'hex':   
            valExponente = new Hex( exponente );   
            break;
        case 'oct':   
            valExponente = new Oct( exponente );   
            break;
        case 'dec': 
            valExponente = new Dec( exponente );   
            break;
    }

    /* produce una excepción si no fue posible realizar la instancia de la 
     * base seleccionada */
    if ( valFraccion == null || valExponente == null ) {
        throw 'El valor de la fracción('+ DOM.inputFraccion.data('baseDato') +') o exponente('+ DOM.inputExponente.data('baseDato') +') no pudo ser inicializado porque la base en la que se encuentra no esta prevista.';
    }

    /* como solo se tomaran los valores después de la aparición del primer 1
     * se solicita el binario que se forma con la multiplicación sucesiva para 
     * el valor actual */
    var valBinMantisa = complementarConFraccion(0, almacenamiento.mantisa, fraccion);
    /* se convierte a binario para eliminar todos los ceros a la izq */
    var valBinarioMantisaSinCeros = ( new Bin(valBinMantisa) ).getBin();
    /* remplaza todos los ceros del comienzo del binario para validar y tener en 
     * cuenta para mover la coma */
    if ( valBinarioMantisaSinCeros.length <= 0 || valBinarioMantisaSinCeros == '0' ) {
        throw 'El valor a almacenar es muy pequeño, al formar la mantisa de '+ almacenamiento.mantisa +' bits('+ valBinMantisa +') ninguno de ellos fue recuperado con valor 1.';
    }
    /* calcula el espacio que se moverá la coma a la derecha y que alterara al 
     * exponente; este valor nunca superara el número de bits asignados a la 
     * mantisa ya que en la verificación anterior si así sucediera finaliza,
     * se le suma uno porque la resta representa el movimiento sin ceros, agregar
     * uno al final representa el primer bit 1 del binario */
    var largoMantisa = ( valBinMantisa.length - valBinarioMantisaSinCeros.length ) + 1;
    /* realiza nuevamente la solicitud de la potencia de números pero esta ves 
     * alterando el largo de la mantisa para que retorne tantos valores binarios
     * como sean necesarios para cubrir el desplazamiento de la como + el largo
     * de la mantisa */
    valBinMantisa = complementarConFraccion(0, almacenamiento.mantisa + largoMantisa, fraccion);
    /* este binario debe tener tantos bits como la mantisa mas dos */
    // valBinMantisa = ( new Bin(valBinMantisa.replace( RegExp('^0*'), '')) ).getBin();
    valBinMantisa = valBinMantisa.replace( RegExp('^0*'), '');
    /* toma los últimos tres caracteres para realizar el redondeo */
    var realizarRedondeo = valBinMantisa.substr(almacenamiento.mantisa-1);
    /* quita los dos últimos bits seleccionando desde el primer carácter hasta
     * el largo de la mantisa */
    valBinMantisa = valBinMantisa.substr(1, almacenamiento.mantisa);
    /* si los últimos tres bit poseen al menos dos bit 1 juntos, suma uno al valor binario */
    if ( realizarRedondeo == '011' || realizarRedondeo == '110' || realizarRedondeo == '111' ) {
        /* crea una instancia de Bin con el valor binario, solicita su conversión
         * a decimal y le suma uno, crea una nueva instancia de decimal y 
         * solicita su conversión a binario */
        valBinMantisa = ( new Dec( 
                            ( new Bin( valBinMantisa ) ).getDec() + 1 
                        ) ).getBin();
    }
    /* almacena la mantisa */
    binarioMantisa += valBinMantisa;

    /* pasa el exponente a decimal */
    var valDecExponente = valExponente.getDec();
    /* si es negativo lo convierte quitándole al valor su doble */
    valDecExponente = valDecExponente - ( ( VAR.signoExponente == '-' ) ? ( valDecExponente * 2 ): 0 );
    /* convierte el valor del exponente al equivalente en base 2 */
    valDecExponente = convertirExponente(valDecExponente, elevado);
    /* le resta las posiciones que se movió la coma en la parte entera, para 1=0
     * otro valor > 1 n posiciones(F = 1111 = 3); */
    valDecExponente = valDecExponente - largoMantisa;
    /* suma sesgo */
    valDecExponente = valDecExponente + sesgo( almacenamiento.exponente );
    /* crea una instancia de Dec para pasar el valor a binario */
    valDecExponente = new Dec( valDecExponente );
    /* complementa el exponente con ceros a la izquierada */
    valDecExponente = new Bin( valDecExponente.getBin() );
    /* almacena el exponente, completo de ceros a la izquierda */
    binarioExponente += valDecExponente.complete( valDecExponente.getBin(), almacenamiento.exponente);

    /* verifica si los bits del exponente exceden el espacio de almacenamiento 
     * asignado; de todos modos el sistema fallaría al almacenarse */
    if ( valDecExponente.getBin().length > almacenamiento.exponente ) {
        throw 'El exponente('+ valDecExponente.getBin() +') excede el espacio de almacenamiento asignado en esta estructura('+ almacenamiento.exponente +' bits).';
    }
    
    return binarioSigno +''+ binarioExponente +''+ binarioMantisa;
};
/* retorna el sesgo para un determinado largo de almacenamiento de mantisa */
var sesgo = function (largoMantisa) {
    return Math.pow(2, ( largoMantisa - 1 )) - 1;
};
var convertirExponente = function (exponente, base) {
    return Math.round( ( exponente * Math.log(base) ) / Math.log(2) );
};
/* 
 * @param mantisaOcupada: bits empleados actualmente en la mantisa con la parte entera
 * @param largoMantisa: espacio a emplear en la mantisa
 * @param fraccion: la parte fraccionaria del numero en decimal, luego la convierte
 *          en el valor entero que representa la parte decimal a decimal,
 *          ej 03 = 0.03 = 3 * 10^numChars(03)
 * @param largoFraccion: almacena el largo de la fracción para convertirla a decimal y establecer
 *                la precisión en el bucle que crea el complemento binario */
var complementarConFraccion = function (mantisaOcupada, largoMantisa, fraccion) {
    var binario = '';
    var largoFraccion = ( new String(fraccion)).length;
    fraccion = fraccion / ( Math.pow(10, largoFraccion ) );
    largoMantisa = largoMantisa +1;
    for (var i = mantisaOcupada; i <= largoMantisa; i++) {
        /* multiplica por dos la fracción */
        fraccion = fraccion * 2;
        /* si el valor resultante es mayor o igual a 1, agrega el bit que corresponda */
        binario += (fraccion >= 1) ? '1' : '0';
        /* si el valor es mayor o igual a 1 le resta uno y acota la precisión del 
         * mismo al largo del decimal inicial, para perder los valores no significativos
         * ej: 1.2 - 1 = 0.19999999999999996  */
        fraccion = ( (fraccion >= 1) ? fraccion - 1 : fraccion ).toPrecision( largoFraccion );
        /* @ToDO valores inferiores a parseFloat('0.000009') se expresan con exponente */
    }
    return binario;
};

/* inicia la aplicación asignando eventos a los elementos del DOM */
$(window).load(function () {
    /**
     * Selecciona todos los elementos del DOM que serán empleados */
    for ( var element in DOM ) {
        DOM[element] = $(DOM[element]);
    }

    /** inicia los popover */
    DOM.popover.popover({
        'trigger': 'hover'
    });
    
    /**
     * Manejo de los menú desplegables. Por defecto Bootstrap proporciona un 
     * widget llamado Dropdowns(http://twitter.github.io/bootstrap/javascript.html#dropdowns) 
     * los mismos muestran un botón que al ser pulsado hace visible un menú, 
     * por defecto el mismo no actualiza el texto del botón de modo tal que 
     * muestre el ultimo elemento seleccionado. 
     * Para lograr este efecto se creo un manejador que captura el evento click 
     * sobre los vínculos de los dropdown y valiéndose de los datos proporcionados 
     * en el elemento actualiza el texto del botón y llama una función donde es 
     * posible realizar operaciones relacionadas a la opción seleccionada, la 
     * función llamada recibe el vínculo sobre el que se realizó clic, el texto 
     * empleado para actualizar el botón el valor contenido en la lista y el 
     * objeto del dom que posee el texto del botón. 
     * Selector: .dropdown-menu li .optDropdownMenu */
    DOM.dropdownMenuLinks.on('click', function (e) {                    
        /* recoge información del DOM a partir del evento recibido */
        var target = $(e.target), 
            menuTitle = $( target.parent().parent().data('menuTitle') ), 
            menuValue = target.data('menuValue'), 
            menuCaption = target.data('menuCaption'), 
            callback = target.parent().parent().data('menuCallback');

        /* verifica que se haya seleccionado un el del DOM a emplear como titulo */
        if ( menuTitle.size() == 1 ) {
            /* establece el nuevo titulo y asigna el nuevo valor como dato */
            menuTitle.html( menuCaption )
                     .data('menuValue', menuValue);

            /* verifica que exista un atributo en el objeto window con el nombre 
             * de la función a ser llamada, verifica que el mismo corresponda a 
             * una función, si es así la ejecuta */
            if ( window[callback] && jQuery.isFunction(window[callback]) ) { 
                (window[callback])( target, menuTitle, menuValue, menuCaption );
            }
        }
        
        /* cierra el menú */
        target.parent().parent().dropdown('toggle');
                    
        /* detiene la propagación del evento, de este modo el click sobre el 
         * vinculo con href # no finaliza y mueve el scroll de la pagina */
        e.stopPropagation();
        return false;
    });
    DOM.dropdownMenuLinks.each(function (index, element) {
        /* itera todos los elementos a seleccionados y verifica si posee como 
         * dato el atributo menu-default con el valor on, si es así dispara el 
         * evento click */
        element = $(element);
        if (element.data('menuDefault') == 'on' ) {
            element.parent().parent().dropdown('toggle');
            element.trigger('click');
        }
    });

    /* Controla todos los input type text,  */
    DOM.inputs.keydown(function (e) {
        /* toma el código de la tecla actual */
        var keyCode = e.keyCode;

        /* verifica si la tecla actual esta comprendida entre las de control */
        var controlKey = {
            8: 'DEL', 
            9: 'TAB', 
            16: 'SHIFT', 
            17: 'CTRL', 
            18: 'ALT', 
            35: 'FIN', 
            36: 'INICIO', 
            37:'PREV', 
            39: 'NEXT', 
            46: 'SUP'
        };
        if ( controlKey[keyCode] ) {
            return true;
        }

        /* en función al tipo de base prevista en el input, verifica si el código
         * de tecla esta comprendido entre los validos para el dominio de valores
         * manejados por la base correspondiente */
        var result = false;
        switch ( $(e.target).data('baseDato') ) {
            case 'ascii': 
                result = ( keyCode >= 0 && keyCode <= 255 );
                break;
            case 'bin': 
                result = ( keyCode == 48 || keyCode == 49 || keyCode == 96 || keyCode == 97 );
                break;
            case 'hex': 
                result = ( ( keyCode >= 48 && keyCode <= 57 ) || ( keyCode >= 96 && keyCode <= 105 ) || ( keyCode >= 65 && keyCode <= 70 ) );
                break;
            case 'dec': 
                result = ( ( keyCode >= 48 && keyCode <= 57 ) || ( keyCode >= 96 && keyCode <= 105 ) );
                break;
            case 'oct': 
                result = ( ( keyCode >= 48 && keyCode <= 55 ) || ( keyCode >= 96 && keyCode <= 103 ) );
                break;
        }

        /* si el código fue evaluado como valido retorna true permitiendo 
         * para que el evento finalizar correctamente */
        if ( result ) {
            return true;
        }

        /* Debug de códigos
        if ( console && console.debug ) {
            console.debug( keyCode );
        } */

        /* cancela la propagación del evento y retorna falso para que
         * la pulsación sobre la tecla no sea tenida en cuenta */
        e.stopPropagation();
        return false;
    });
    /* cuando finaliza la pulsación una de tecla se dispara la representación */
    DOM.inputs.keyup(function (e) {
        representar();
    });
    /* evita el menú contextual */
    DOM.inputs.on('contextmenu', function (e) {
        e.stopPropagation();
        return false; 
    });
    /* evita la combinación de teclas Ctrl+V */
    DOM.inputs.on('paste', function (e) {
        e.stopPropagation();
        return false;
    });
    /* Al perder el focus verifica que tanto la base de elevado y el exponente 
     * no queden vacíos y posean por defecto 10 y 0 respectivamente */
    DOM.inputElevado.on('blur', function () {
        if ( DOM.inputElevado.val().length <= 0 ) {
            DOM.inputElevado.val(10);
        }
    }).trigger('blur'); 
    DOM.inputExponente.on('blur', function () {
        if ( DOM.inputExponente.val().length <= 0 ) {
            DOM.inputExponente.val('0');
        }
    }).trigger('blur');
});

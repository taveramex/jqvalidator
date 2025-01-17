/*==================================================================================================*/
/*   Helper de JavaScript para apoyar la validacion de los inputs y de las formas de la aplicacion. */
/*   Depende de la libreria del jQuery 1.7 o posterior. 							     	*/
/*	 Para que funcione adecuadamente asegurate de cargar el Script con la codificacion ISO-8859-1	*/	
/* 	<script type="text/javascript" src="js/jQValidator.js" charset="ISO-8859-1"></script>	*/
/*  @version:  	1.5Beta
/*  @autor: taveramex(at)gmail.com																 		*/
/*==================================================================================================*/

/*
 * jQValidator modifica el atributo title de los inputs que tiene autorizados modificar, y ahi agrega la descripcion del error  
 *  
 * 
 */

/* Este "objeto de validaciones" tiene todas las clases css que se checaran a los inputs, este es el orden:
 *		nombre de la clase
 *		mensaje de error pequeño que se situa al lado dle campo input
 *		mensaje de error grande y mas descrpitivo que se situara en un acumulativo.
 *		la expresion regular que se comprobara, si la cadena evaulada hace match con esta expresion regular regresara true.
 *	Si necesitas declarar un nuevo criterio de validacion(clase css) para evaluar solo agregalo despues del primer lugar del arreglo
 *	de la mimsa manera que los anteriores y hara la comprobacion correspondiente.
 */

// Esta variable es el nombre de la clase CSS que asignara al elemento con error, puedes modificarla a tu gusto.
// NOTA: solo puedes asignarle una clase CSS, no puedes poner varias.
var cssErrorFieldName = "errorField";

var strError= [
    //este metodo es de sistema Base, no modificar.
	['jqv-required',
		'campo Requerido',
		'Campo no puede estar vacío.',
		/^.*$/g
	],
	
	//desde aqui se pueden agregar metodos definidos por el usuario.
	['jqv-alphabetic',
		'sólo letras',
		'Unicamente son permitidos letras.',
		/^([a-z]+)?$/gi
	],
	['jqv-alphanumeric',
		'solo alfanumericos',
		'Sólo se aceptan letras y números.',
		/^([a-z0-9,]+)?$/gi
	],
	['jqv-alphaextra',
		'solo alfanumericos',
		'Sólo se aceptan letras, números y chars especiales.',
		/^([a-z\xE1\xE9\xED\xF3\xFA\xFC\xF1\s\d\.:;,]+)?$/gi
	],
	['jqv-numeric',
		'solo números',
		'Sólo se aceptan números enteros.',
		/^(\d+)?$/g
	],
	['jqv-percent',
		'formato porcentaje',
		'Formato del campo debe ser porcentaje.',
		/^((100(\.0{1,2})?)|(\d{1,2}(\.\d{1,2})?)\%?)?$/
	],
	['jqv-float',
		'solo flotantes',
		'Solo se aceptan números con/sin decimales.',
		/^((\d+)?((\.)(\d+))?)?$/g
	],
	['jqv-money',
		'solo dinero',
		'Formato del campo debe ser de tipo Moneda.',
		/^(-?\$(((\d{1,3},)+\d{3})|\d+)\.\d{2})?$/
	],
	['jqv-non-zero',
		'Valor incorrecto',
		'El valor no puede ser igual a 0.',
		/^([1-9]+[0-9]*)$/g
	],
	['jqv-email',
		'solo e-mail',
		'Debe contener una dirección de correo electrónico estandar.',
		/^([\w\._]+@[\w\.]+\.[\w]{2,3})?$/gi
	],
	['jqv-phone',
		'Formato teléfono incorrecto',
		'Sólo se aceptan 7, 8 o 10 dígitos para télefonos fijos.',
		/^(\d{7}|\d{8}|\d{10}|)?$/
	],
	['jqv-cellphone',
		'formato teléfono incorrecto',
		'Télefono celular debe ser de 10 dígitos.',
		/^(\d{10})?$/
	],
	['jqv-curp',
		'formato incorrecto',
		'CURP no tiene el formato correcto.',
		/^([A-Za-z]{4}\d{6}[HhMm][A-Za-z]{5}[A-Za-z0-9]{2})?$/
	],
	['jqv-rfc',
		'solo RFC',
		'Formato no corresponde a RFC para Personas Física ó Moral.',
		/^(([A-Za-z]{3,4})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jqv-rfc-fisica',
		'solo RFC fisica',
		'Formato incorrecto para RFC de Persona Física.',
		/^(([A-Za-z]{4})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jqv-rfc-moral',
		'solo RFC moral',
		'Formato incorrecto para RFC de Persona Moral.',
		/^(([A-Za-z]{3})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jqv-date-mx',
		'fecha incorrecta',
		'Debe indicar una fecha válida en formato dd/mm/aaaa',
		/^(\d{2}\/\d{2}\/\d{4})?$/gi
	],
	['jqv-month',
		'Mes incorrecto',
		'Debes indicar un mes válido',
		/^(0[1-9]|1[01])?$/
	]
];

var errorTemp = ''; //variable para reportar errores
var listaErr = ''; // Lista de Errores Si se desea saber que campos contienen el error con un alert
var errorLong = new Array();


/*
 * Esta funcion espera a que la pagina se haya cargado en su totalidad, Ocupa de la libreria de Jquery 1.7+ para funcionar
 */
jQuery(document).ready(function($) {

// no se quien agrego estas lineas, las comento para borrar despues (16-may-2013)
//    var charMap = {
//        "á":'a',
//        "é":'e',
//        "í":'i',
//        "ú":'u',
//        "ó":'o'
//    };

    //este handler maneja las nuevas clases de validacion automatica de los botones
    //Handler que maneja el boton Validador de todo con alerta
    $(document).on('click','.jqv-validate-all-alert',function(e){
        if(!validateAll(true)){
            e.preventDefault();
        }
    });
    // este handler maneja la clase automatica del validador Auto con alerta
    $(document).on('click','.jqv-validate-auto-alert',function(e){
        if(!validateAuto($(this),true)){
            e.preventDefault();
        }
    });

    //TODO: Tomar valores desde el arreglo principal de errores.
    $(document).on('keypress','.jqv-restrict',function(e){
        var input = $(this);
        if(input.hasClass('jqv-numeric')){
                if(!onlyNumbers(input, e, false, false))
                        e.preventDefault();
        }
        if(input.hasClass('jqv-money')||input.hasClass('jqv-float')||input.hasClass('jqv-percent')){
                if(!onlyNumbers(input, e, true, true))
                        e.preventDefault();
        }
        if(input.hasClass('jqv-alphabetic')){
                if(!alfa(e, false, false, false))
                        e.preventDefault();
        }
        if(input.hasClass('jqv-alphanumeric')){
                if(!alfa(e, true, false, false))
                        e.preventDefault();
        }
        if(input.hasClass('jqv-alphaextra')){
                if(!alfa(e, true, true, false))
                        e.preventDefault();
        }
    });
		
    //-- Handler para campos solo mayúsculas
    $(document).on('blur','.jqv-upper-case',function(){
        $(this).val($(this).val().toUpperCase());
    });

    //-- Handler para campos solo minúsculas
    $(document).on('blur','.jqv-lower-case',function(){
        $(this).val($(this).val().toLowerCase());
    });

    //-- Handler para Formato Decimal
    $(document).on('keypress','input[class*="jqv-number"]',function(){
            var input = $(this);
            if(!decimalFormat(input, e))
                    e.preventDefault();
    });
		
    //-- Inicializa eventos para validacion de formatos en general
    $(document).on('change blur','input[type="text"]:enabled',function(){
            var input = $(this);
            input.val(validatorTrimmer(input.val()));
            (checkForErrors(input))?cleanError(input):throwError(input);
    });	

});

/* 
 * Esta funcion es para que el input solo admita Letras, Numeros y chars especiales (de manera configurable) (Solo para evento onKeyPress).
 * @param event Este booleano indica si se convertira en mayusculas todos los char introducidos por el usuario.
 * @param numeric Este booleano indica si se incluiran numeros en los chars permitidos.
 * @param extra Es un Booleano que representa si quieres caracteres adicionales como enies y letras con acentos.
 * @param ctrlAllow Este booleano indica si se peritira el uso de la tecla Ctrl, al no permitirla no puedes usar la combinacion ctrl+v o ctrl+c.
*/
function alfa(event, numeric, extra, ctrlAllow){
    var resultado = false;		//Resultado de la funcion
	var e = event;		//capturamos la tecla presionada.
	var ctrl = ctrlAllow;
	
	if (!event) event = window.event;
	if(event.ctrlKey && !ctrl) {return false;} //asi evitamos el Ctrl v o ctrl C
	if (event.keyCode) code = event.keyCode;
	else if (event.which) code = event.which;
	
	if ((code==null) || (code==0) || (code==8) || (code==9) || (code==27)) {return true;}	//llaves de control {delete,supr,intro y tab}
	if ((code == 13))  {return false;} //es un enter
	//Solo en Firefox el keycode de las flechas debe ser permitido para mover las fechas y usar delete.
//	if (jQuery.browser.mozilla){
//TODO PROBAR FUNCIONAMIENTO
        if(navigator.userAgent.match(/mozilla/i)){
		if((e.keyCode==37)|| (e.keyCode==38)|| (e.keyCode==39)|| (e.keyCode==40)|| (e.keyCode==46)){
			return true;
		}
	}
	
	var character = String.fromCharCode(code);
	// al poner todas las letras en minuscula acortamos la lista del indexOf de las letras por la mitad, optimizando la busqueda.
	character = character.toLowerCase(); 
	
	if (("abcdefghijklmnopqrstuvwxyz").indexOf(character) > -1)
		resultado = true; //comprobacion RegEx que solo admite letras en el input
	
	if (numeric && ("0123456789").indexOf(character) > -1) //comprobacion que solo admite numeros en el input cuando se le dice que debe tener numeros
		resultado = true; 
	
	if (extra && ("áéíóúñü .:;,'").indexOf(character) > -1) 
		resultado = true;
	return resultado;
}

/* 
 * Esta funcion es para que el input solo admita Numericos, decimales y numeros negativos (de manera configurable) (Solo para evento onKeyPress).
 * @param element 
 * @param event 
 * @param decimal 
 * @param minus 
*/
function onlyNumbers(element, event, decimal, minus){
	var resultado = false;
	var code; //key code
	var event;
        
	if (!event) 
            event = window.event;
	if (event.keyCode) 
            code = event.keyCode;
	else if (event.which) code = event.which;
	
	if ((code==null) || (code==0) || (code==8) || (code==9) || (code==27)) {return true;}	//llaves de control {delete,supr,intro y tab}
	if ((code == 13))  {return false;} //es un enter
	//Solo en Firefox el keycode de las flechas debe ser permitido para mover las fechas y usar delete.
	if (jQuery.browser.mozilla){
            if((event.keyCode==37)|| (event.keyCode==38)|| (event.keyCode==39)|| (event.keyCode==40)|| (event.keyCode==46)){
                    return true;
            }
	}
	var character = String.fromCharCode(code);
	
	if(("0123456789").indexOf(character) > -1){
            resultado = true;
	}
	
	//comprobacion para Signo decimal, no comprueba formato.
	if(minus && character == "-"){
            if((element.val()).indexOf("-") > -1){
                    return false;
            }else{
                    return true;
            }
	}
	
	//comprobacion para decimales, no comprueba formato.
	if(decimal && character == "."){
            if((element.val()).indexOf(".") > -1){
                    return false;
            }else{
                    return true;
            }
	}
	
	return resultado;
}

/* 
 * Esta funcion es exclusivamente para el formato de los numeros 
 * decimales y enteros. Para poder usarla debes usar la clase jqv-number99d99 
 * ej.- jqv-number4d2 para un numero de 4 enteros y 2 decimales 
 * @param input
 * @param event 
 */
function decimalFormat(input, event){
	var code; //key code
	
	if (!event) event = window.event;
	if (event.keyCode) code = event.keyCode;
	else if (event.which) code = event.which;
	
	if ((code==null) || (code==0) || (code==8) || (code==9) || (code==27)) {return true;}	//llaves de control {delete,supr,intro y tab}
	if ((code == 13))  {return false;} //es un enter
	//Solo en Firefox el keycode de las flechas debe ser permitido para mover las fechas y usar delete.
	if (jQuery.browser.mozilla){
            if((event.keyCode==37)|| (event.keyCode==38)|| (event.keyCode==39)|| (event.keyCode==40)|| (event.keyCode==46)){
                    return true;
            }
	}
        
	var character = String.fromCharCode(code);
	var texto = input.val()+character;

	try{
            input.attr('class').match(/jqv-number(\d+)d(\d+)/gi);
            var number = RegExp.$1;
            var fraction = RegExp.$2;

            if(number>=0 && fraction>=0){
                var reText = "^(\\d{0,"+number+"}(\\.\\d{0,"+fraction+"})?)?$";
                var re = new RegExp(reText, "g");
                if(re.test(texto))
                    return true;
                else
                    return false;
            }
	}catch(err){}
	alert('jQValidator DecimalFormat Malformed Css Class.');
	return false;
}

/**
 * 
 * 
 */
function validateAuto(el, alert){
	var result = true;
	var inputActual = el;
        var idForm;
        
	if (typeof inputActual.closest('form').attr('id') != "undefined")
            idForm = inputActual.closest('form').attr('id');
	else
            alert('Error: Verifica que el boton este dentro de la forma.');
	
	$('form[id="'+idForm+'"] input[type="password"]:enabled, form[id="'+idForm+'"] input[type="text"]:enabled, form[id="'+idForm+'"] select:enabled, form[id="'+idForm+'"] textarea:enabled').each(function () {
            var input = $(this);
            if (!checkForErrors(input)) {
                result = false;
            }
	});
	
	jQAlertError(result, alert, idForm);
	return result;
}

/**	
 * Esta funcion valida todos los inputs, select y textareas dentro de un Id definido.
 * @param forId Es el String del id de la Forma que se quiere Checar.
 * @param alert Es un parametro booleando que indica si se quiere que lanze una alerta.
 * @returns {Boolean} si algun campo tiene un error retornara un falso.
 * @example validateFormId('FormaCompras', false);  validateFormId(null,false); 
 */
function validateForId(forId, alert){
    var result = true;
    var idForm;

    if(forId != null && forId !=''){
        idForm = forId;
    }else{
        alert('Error: forId vacio o nulo');
        return false;
    }
    if($('#'+idForm)){
        $('#'+idForm+' input[type="password"]:enabled, #'+idForm+' input[type="text"]:enabled, #'+idForm+' select:enabled, #'+idForm+' textarea:enabled').each(function(){
            var input = $(this);
            if (!checkForErrors(input)) {
                result = false;
            }
        });
    }else{
        alert('Error: No existe el Id Proporcionado');
        return false;
    }

    jQAlertError(result, alert, idForm);
    return result;
}

/**	
 * Funcion que checa todos los Inputs activos(enabled) de toda la pagina(visibles o invisibles) y regresa un false si es que hubo error en alguno.
 * @param alert Es un parametro booleando que indica si se quiere que lanze una alerta (true) o solo marcar los campos con error con la clase designada como cssErrorFieldName(false).
 * @returns {Boolean} si algun campo tiene un error retornara un falso.
 */
function validateAll(alert){
    var result = true;

    $('input[type="text"]:enabled,input[type="password"]:enabled, select:enabled, textarea:enabled').each(function(){
        var input = $(this);
        if (!checkForErrors(input)) {
            result = false;
        }
    });

    jQAlertError(result, alert, null);
    return result;
}

//
//Funciones Auxiliares en la Labor del Script jQValidator
//

/**
 * Esta funcion recibe un objeto Input y checa si este objeto tiene alguna de las clases del validator, 
 * si posee alguna checa que el contenido este de acuerdo con el regex que le corresponde.
 * Respondera con un False si ha encontrado un error en alguna comprobacion.
 * y regresara un True cuando no haya ningun error en el input entregado.
 * 
 */
 function checkForErrors(input){
    var valid = true;

    //-- Requeridos
    if(input.hasClass('jqv-required')){
        if(isEmpty(input.val())){
            valid = false;
            errorTemp = strError[0][1];
            errorLong.push(strError[0][2]);
        }
    }

    if(valid){ //si ya se ha hecho la comprobacion de requerido y arrojo error se evitan las demas comprobaciones.
        for (i = 0; i < strError.length; i++) {
            if (input.hasClass(strError[i][0])) {
                if (! input.val().match(strError[i][3])) {
                    valid = false;
                    errorTemp = strError[i][1];
                    errorLong.push(strError[i][2]);
                }
            }
        }
    }
    if (valid) {
        cleanError(input);
    } else {
        throwError(input);
    }

    return valid;
}

/**
 * Funcion cleanError
 * Esta funcion limpia el campo de error dado en el parametro
 * @param input recibe un objeto select, input o textarea.
 * @return null
 */
function cleanError(input){
    input.removeClass(cssErrorFieldName);
    input.removeAttr('title'); //este es el error pequeno que se muestra en el title del input.
}

/**
 * Funcion throwError
 * Esta funcion designa el input dado en el parametro como un campo con informacion erronea.
 * @param input recibe un objeto select, input o textarea.
 * @return null
 */
function throwError(input){
	input.addClass(cssErrorFieldName);
	input.attr('title', errorLong[errorLong.length - 1]);
	errorTemp='';
}
/**
 *
 * 
 */
function jQAlertError(resultado, alerta, idForm){
	var idCheck='';
	if (idForm != null){
		idCheck = '#'+idForm+' ';
	}
	if (!resultado && (alerta==true)) {
		var numErrs = $(idCheck+'.'+cssErrorFieldName).length
		alert('No es posible guardar la información capturada.\n\n Se encontraron ' + numErrs + ' campo(s) con errores.');
	}
}

//es mas sencillo y rapido checar sin RegEx para esta comprobacion.
function isEmpty(cadena){
    $trimmed = validatorTrimmer(cadena);
    return ($trimmed=="")?true:false;
}

function validatorTrimmer(cadena){
    $trim = cadena.replace(/^\s+/g,'').replace(/\s+$/g,'');
    return $trim;
}
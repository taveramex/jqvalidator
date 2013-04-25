/*==================================================================================================*/
/*   Helper de JavaScript para apoyar la validacion de los inputs y de las formas de la aplicacion. */
/*   Depende de la libreria del jQuery, fue probada con jQuery 1.6 							     	*/
/*	 Para que funcione adecuadamente asegurate de cargar el Script con la codificacion ISO-8859-1	*/	
/* 	<script type="text/javascript" src="<s:url value='/js/jQValidator.js'/>" charset="ISO-8859-1"></script>	*/
/*  @version:  	1.3.1Beta	
/*  @autor: taveramex@gmail.com																 		*/
/*==================================================================================================*/

/*
 * clases que necesitan estar en el CSS
 * .errorField para el formato de un campo de error en general, si no esta solo no se marcara rojo el campo que tiene error
 */

/* Este "objeto de validaciones" tiene todas las clases css que se checaran a los inputs, este es el orden:
 *		nombre de la clase
 *		mensaje de error pequeño que se situa al lado del campo input
 *		mensaje de error grande y mas descrpitivo que se situara en un acumulativo.
 *		la expresion regular que se comprobara, si la cadena evaulada hace match con esta expresion regular regresara true.
 *	Si necesitas declarar un nuenonvo criterio de validacion(clase css) para evaluar solo agregalo despues de los 3 primeros lugares del arreglo
 *	de la mimsa manera que los anteriores y hara la comprobacion correspondiente.
 */
jQuery.noConflict();

var strError= [
    //este metodo es de sistema Base, no modificar.
	['jqrequired',
		'campo Requerido',
		'Campo no puede estar vacío.',
		/^.*$/g
	],
	
	//desde aqui se pueden agregar metodos definidos por el usuario.
	['jqalphabetic',
		'sólo letras',
		'Unicamente son permitidos letras.',
		/^([a-z]+)?$/gi
	],
	['jqalphanumeric',
		'solo alfanumericos',
		'Sólo se aceptan letras y números.',
		/^([a-z0-9,]+)?$/gi
	],
	['jqalphaextra',
		'solo alfanumericos',
		'Sólo se aceptan letras, números y chars especiales.',
		/^([a-z\xE1\xE9\xED\xF3\xFA\xFC\xF1\s\d\.:;,]+)?$/gi
	],
	['jqnumeric',
		'solo números',
		'Sólo se aceptan números enteros.',
		/^(\d+)?$/g
	],
	['jqentero',
		'solo números',
		'Sólo se aceptan números enteros.',
		/^([,'\d]+)?$/g
	],
	['jqpercent',
		'formato porcentaje',
		'Formato del campo debe ser porcentaje.',
		/^((100(\.0{1,2})?)|(\d{1,2}(\.\d{1,2})?)\%?)?$/
	],
	['jqfloat',
		'solo flotantes',
		'Solo se aceptan números con/sin decimales.',
		/^((\d+)?((\.)(\d+))?)?$/g
	],
	['jqmoney',
		'solo dinero',
		'Formato del campo debe ser de tipo Moneda.',
		/^(-?\$(((\d{1,3},)+\d{3})|\d+)\.\d{2})?$/
	],
	['jqnonzero',
		'Valor incorrecto',
		'El valor no puede ser igual a 0.',
		/^([1-9]+[0-9]*)$/g
	],
	['jqemail',
		'solo e-mail',
		'Debe contener una dirección de correo electrónico estandar.',
		/^([\w\._]+@[\w\.]+\.[\w]{2,3})?$/gi
	],
	['jqphone',
		'Formato teléfono incorrecto',
		'Sólo se aceptan 7, 8 o 10 dígitos para télefonos fijos.',
		/^(\d{7}|\d{8}|\d{10}|)?$/
	],
	['jqcellphone',
		'formato teléfono incorrecto',
		'Télefono celular debe ser de 10 dígitos.',
		/^(\d{10})?$/
	],
	['jqcurp',
		'formato incorrecto',
		'CURP no tiene el formato correcto.',
		/^([A-Za-z]{4}\d{6}[HhMm][A-Za-z]{5}[A-Za-z0-9]{2})?$/
	],
	['jqrfc',
		'solo RFC',
		'Formato no corresponde a RFC para Personas Física ó Moral.',
		/^(([A-Za-z]{3,4})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jqrfcfisica',
		'solo RFC fisica',
		'Formato incorrecto para RFC de Persona Física.',
		/^(([A-Za-z]{4})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jqrfcmoral',
		'solo RFC moral',
		'Formato incorrecto para RFC de Persona Moral.',
		/^(([A-Za-z]{3})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jqdate-mx',
		'fecha incorrecta',
		'Debe indicar una fecha válida en formato dd/mm/aaaa',
		/^(\d{2}\/\d{2}\/\d{4})?$/gi
	],
	['jqmes',
		'Mes incorrecto',
		'Debes indicar un mes válido',
		/^(0[1-9]|1[01])?$/
	]
];

var errorTemp = ''; //variable para reportar errores
var listaErr = ''; // Lista de Errores Si se desea saber que campos contienen el error con un alert
var errorLong = new Array();


/*
 * Esta funcion espera a que la pagina se haya cargado en su totalidad, Ocupa de la libreria de Jquery para funcionar
 */
jQuery(document).ready(function($) {
		//TODO: Tomar valores desde el arreglo principal de errores.
		$(document).delegate('.jqrestrict','keypress',function(e){
			var input = $(this);
			if(input.hasClass('jqnumeric')){
				if(!onlyNumbers(input, e, false, false))
					e.preventDefault();
			}
			if(input.hasClass('jqentero')){
				if(!onlyNumbers(input, e, false, false,false,true))
					e.preventDefault();
			}
			if(input.hasClass('jqfloat')||input.hasClass('jqpercent')){
				if(!onlyNumbers(input, e, true, true))
					e.preventDefault();
			}
			if(input.hasClass('jqmoney')){
				if(!onlyNumbers(input, e, true, true,true))
					e.preventDefault();
			}
			if(input.hasClass('jqalphabetic')){
				if(!alfa(e, false, false, false))
					e.preventDefault();
			}
			if(input.hasClass('jqalphanumeric')){
				if(!alfa(e, true, false, false))
					e.preventDefault();
			}
			if(input.hasClass('jqalphaextra')){
				if(!alfa(e, true, true, false))
					e.preventDefault();
			}
			
		});
		
		//-- Handler para campos solo mayúsculas
		$('.jqup').live('blur', function (){
			$(this).val($(this).val().toUpperCase());
		});

		//-- Handler para campos solo minúsculas
		$('.jqlow').live('blur', function (){
			$(this).val($(this).val().toLowerCase());
		});
		
//		//-- Handler para caracteres maximos
//		$(document).delegate('input[class*="jQCharMax"]','keypress',function(e){
//			$(this).attr('class').match(/jQCharMax(\d+)/gi);
//			jQmax = RegExp.$1.match(/\d+/gi);
//			
//			if($(this).val().length+1>=jQmax)
//				e.preventDefault();
//		});

		//-- Handler para Formato Decimal
		$(document).delegate('input[class*="jqnumber"]','keypress',function(e){
			var input = $(this);
			if(!decimalFormat(input, e))
				e.preventDefault();
		});
		
		//-- Inicializa eventos para validacion de formatos en general
		$('input[type="text"]:enabled').live('change blur',function(){
			var input = $(this);
			input.val(validatorTrimmer(input.val()));
			(checkForErrors(input))?cleanError(input):throwError(input);
		});	

	}
);

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
	if (jQuery.browser.mozilla){
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
function onlyNumbers(element, event, decimal, minus, money, numStr){
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
	
        //comprobacion para chars de enteros con coma
	if(numStr && (",'").indexOf(character) > -1){
            resultado = true;
	}
        
        //comprobacion para dinero, no comprueba formato.
	if(money && ("$,'.").indexOf(character) > -1){
            resultado = true;
	}
	
	return resultado;
}

/* 
 * Esta funcion es exclusivamente para el formato de los numeros 
 * decimales y enteros. Para poder usarla debes usar la clase jqnumber99d99 
 * ej.- jqnumber4d2 para un numero de 4 enteros y 2 decimales 
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
            input.attr('class').match(/jqnumber(\d+)d(\d+)/gi);
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
	
	jQuery('form[id="'+idForm+'"] input[type="text"]:enabled, form[id="'+idForm+'"] select:enabled, form[id="'+idForm+'"] textarea:enabled').each(function () {
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
    if(jQuery('#'+idForm)){
        jQuery('#'+idForm+' input[type="text"]:enabled, #'+idForm+' select:enabled, #'+idForm+' textarea:enabled').each(function(){
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
 * @param alert Es un parametro booleando que indica si se quiere que lanze una alerta (true) o solo marcar los campos con error con la clase errorField(false).
 * @returns {Boolean} si algun campo tiene un error retornara un falso.
 */
function validateAll(alert){
	var result = true
	
	jQuery('input[type="text"]:enabled, select:enabled, textarea:enabled').each(function(){
		var input = jQuery(this);
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
	if(input.hasClass('jqrequired')){
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
	input.removeClass('errorField');
	input.removeAttr('title'); //este es el error pequeno que se muestra en el title del input.
}

/**
 * Funcion throwError
 * Esta funcion designa el input dado en el parametro como un campo con informacion erronea.
 * @param input recibe un objeto select, input o textarea.
 * @return null
 */
function throwError(input){
	input.addClass('errorField');
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
		var numErrs = jQuery(idCheck+'.errorField').length
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
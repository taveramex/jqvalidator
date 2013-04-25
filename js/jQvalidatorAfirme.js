/*==================================================================================================*/
/*   Helper de JavaScript para apoyar la validacion de los inputs y de las formas de la aplicacion. */
/*   Depende de la libreria del jQuery, fue probada con jQuery 1.6 							     	*/
/*	 Para que funcione adecuadamente asegurate de cargar el Script con la codificacion ISO-8859-1	*/	
/* 	<script type="text/javascript" src="<s:url value='/js/jQValidator.js'/>" charset="ISO-8859-1"></script>	*/
/*  @autor: ATavera@SoftNet.com.mx																	*/
/*  @version:  	1.1Beta												 					*/
/*==================================================================================================*/

/*
 * clases que necesitan estar en el CSS
 * .errorField para el formato de un campo de error en general
 */

/* Este "objeto de validaciones" tiene todas las clases css que se checaran a los inputs, este es el orden:
 *		nombre de la clase
 *		mensaje de error peque?o que se situa al lado del campo input
 *		mensaje de error grande y mas descrpitivo que se situara en un acumulativo.
 *		la expresion regular que se comprobara, si la cadena evaulada hace match con esta expresion regular regresara true.
 *	Si necesitas declarar un nuevo criterio de validacion(clase css) para evaluar solo agregalo despues de los 3 primeros lugares del arreglo
 *	de la mimsa manera que los anteriores y hara la comprobacion correspondiente.
 *
 * letras ecentuadas en unicode para los mensajes. 
 *#  \u00E1 (a acentuada) \u00E9 (e acentuada)    \u00ED (i acentuada)   \u00F3  (o acentuada)    \u00FA (u acentuada) \u00BF (abrir interrogacion) \u00A1 (abrir admiracion)
 */
var strError= [
    //este metodo es de sistema Base, no modificar.
	['jQrequired',
		'campo Requerido',
		'Campo no puede estar vac\u00EDo.',
		/^.*$/g
	],
	
	['jQsaltolineatxa',
		'campo Requerido',
		'Campo no puede estar vac\u00EDo.',
		
	],
	
	//desde aqui se pueden agregar metodos definidos por el usuario.
	['jQalphabetic',
		's\u00F3lo letras',
		'Unicamente son permitidos letras.',
		/^([a-z\xE1\xE9\xED\xF3\xFA\xF1]+)?$/gi
	],
	['jQalphanumeric',
		'solo alfanumericos',
		'S\u00F3lo se aceptan letras y n\u00FAmeros.',
		/^([A-Za-z0-9\xE1\xE9\xED\xF3\xFA\xF1\s]+)?$/gi
	],
	['jQalphaextra',
		'solo alfanumericos',
		'S\u00F3lo se aceptan letras, n\u00FAmeros y chars especiales.',
		/^([a-z\xE1\xE9\xED\xF3\xFA\xF1\s\d\.:;,#()-_-¡\'@%"&°]+)?$/gi
	],
	['jQnumeric',
		'solo n\u00FAmeros',
		'S\u00F3lo se aceptan n\u00FAmeros enteros.',
		/^(\d+)?$/g
	],
	['jQpercent',
		'formato porcentaje',
		'Formato del campo debe ser porcentaje.',
		/^((100(\.0{1,2})?)|(\d{1,2}(\.\d{1,2})?)\%?)?$/
	],
	['jQfloat',
		'solo flotantes',
		'Solo se aceptan n\u00FAmeros con/sin decimales.',
		/^((\d+)?((\.)(\d+))?)?$/g
	],
	['jQmoney',
		'solo dinero',
		'Formato del campo debe ser de tipo Moneda.',
		/^(-?\$(((\d{1,3},)+\d{3})|\d+)\.\d{2})?$/
	],
	['jQnonZero',
		'Valor incorrecto',
		'El valor no puede ser igual a 0.',
		/^([1-9]+[0-9]*)$/g
	],
	['jQemail',
		'solo e-mail',
		'Debe contener una direcci\u00F3n de correo electr\u00F3nico estandar.',
		/^([\w\.\xF1\-]+@[\w\.\xF1\-]+\.[\w]{2,3})?$/gi
	],
	['jQEmailList',
		'solo e-mail',
		'Debe contener almenos una direcci\u00F3n de correo electr\u00F3nico valida',
		/^(([\w\.\xF1\-]+@[\w\.\xF1\-]+\.[\w]{2,4}[;{0,1}|\s|\r\n]*)*)?$/gi
	],
	['jQphone',
		'Formato tel\u00E9fono incorrecto',
		'S\u00F3lo se aceptan 7, 8 o 10 d\u00EDgitos para t\u00E9lefonos fijos.',
		/^(\d{7}|\d{8}|\d{10}|)?$/
	],
	['jQsiglasRFCMoral',
		'Formato de siglas incorrecto',
		'S\u00F3lo se aceptan 3 caracteres (no se permite la letra \xF1 ).',
		/^([A-Za-z]{3})?$/
	],
	['jQsiglasRFCFisica',
		'Formato de siglas incorrecto',
		'S\u00F3lo se aceptan 4 caracteres (no se permite la letra \xF1 ).',
		/^([A-Za-z]{4})?$/
	],
	['jQfechaRFC',
		'Formato de fecha RFC incorrecto',
		'S\u00F3lo se aceptan 6 numeros.',
		/^(\d{6})?$/
	],
	['jQclaveRFC',
		'Formato de homoclave RFC incorrecto',
		'S\u00F3lo se aceptan 3 o 4 numeros.',
		/^(\w{3}|\w{4}|)?$/
	],
	['jQcell-phone',
		'formato t\u00E9lefono incorrecto',
		'T\u00E9lefono celular debe ser de 10 d\u00EDgitos.',
		/^(\d{10})?$/
//		/^(((\d{2} )?\d{4}-\d{4})|((\d{3} )?\d{3}-\d{4}))?$/gi
	],
	['jQCURP',
		'formato incorrecto',
		'CURP no tiene el formato correcto.',
		/^([A-Za-z]{4}\d{6}[HhMm][A-Za-z]{5}[A-Za-z0-9]{2})?$/
	],
	['jQRFC',
		'solo RFC',
		'Formato no corresponde a RFC para Personas F\u00EDsica \u00F3 Moral.',
		/^(([A-Za-z]{3,4})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jQRFCFisica',
		'solo RFC fisica',
		'Formato incorrecto para RFC de Persona F\u00EDsica.',
		/^(([A-Za-z]{4})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jQRFCMoral',
		'solo RFC moral',
		'Formato incorrecto para RFC de Persona Moral.',
		/^(([A-Za-z]{3})(\d{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])(\w{3}))?$/gi
	],
	['jQdate-mx',
		'fecha incorrecta',
		'Debe indicar una fecha v\u00E1lida en formato dd/mm/aaaa',
		/^(\d{2}\/\d{2}\/\d{4})?$/gi
	],
	['jQmes',
		'Mes incorrecto',
		'Debes indicar un mes v\u00E1lido',
		/^(0[1-9]|1[01])?$/
	],
	['jQtelefono',
		'Formato t\u00E9lefono incorrecto',
		'S\u00F3lo se aceptan de 7 a 12 d\u00EDgitos para t\u00E9lefonos.',
		/^(\d{7}|\d{8}|\d{9}|\d{10}|\d{11}|\d{12}|\d{13}|)?$/
	]
];

var errorTemp = ''; //variable para reportar errores
var listaErr = ''; // Lista de Errores Si se desea saber que campos contienen el error con un alert
var errorLong = new Array();


/*esta funcion espera a que la pagina se haya cargado en su totalidad, Ocupa de la libreria de Jquery para funcionar*/
jQuery(document).ready(function($) {
		//TODO: Tomar valores desde el arreglo principal de errores.
		$(document).delegate('.jQrestrict','keypress',function(e){
		//$('.restrict').live('keypress',function(e){
			var input = $(this);

			if(input.hasClass('jQnumeric')){
				if(!onlyNumbers(input, e, false, false))
					e.preventDefault();
			}
			if(input.hasClass('jQmoney')||input.hasClass('jQfloat')||input.hasClass('jQpercent')){
				if(!onlyNumbers(input, e, true, true))
					e.preventDefault();
			}
			if(input.hasClass('jQalphabetic')){
				if(!alfa(e, false, false, false))
					e.preventDefault();
			}
			if(input.hasClass('jQalphanumeric')){
				if(!alfa(e, true, false, false))
					e.preventDefault();
			}
			if(input.hasClass('jQalphaextra')){
				if(!alfa(e, true, true, false))
					e.preventDefault();
			}
			if(input.hasClass('jQphone') || input.hasClass('jQcell-phone')){
				if(!onlyNumbers(input, e, false, false))
					e.preventDefault();
			}

		});

		//-- Handler para campos solo may?sculas
		$('.jQtoUpper').live('blur', function (){
			$(this).val($(this).val().toUpperCase());
		});

		//-- Handler para campos solo min?sculas
		$('.jQtoLower').live('blur', function (){
			$(this).val($(this).val().toLowerCase());
		});
		
		//-- Handler para convertir a mayusculas todos los campos de captura en la forma 
		$('input[type="text"] ,textarea').live('blur', function (){
			$(this).val($(this).val().toUpperCase());
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
		$(document).delegate('input[class*="jQNumber"]','keypress',function(e){
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
	var character = character.toLowerCase(); 
	
	
	
	if (("abcdefghijklmn\u00F1opqrstuvwxyz").indexOf(character) > -1)
		resultado = true; //comprobacion RegEx que solo admite letras en el input
	
	if (numeric && ("012345679").indexOf(character) > -1) //comprobacion que solo admite numeros en el input cuando se le dice que debe tener numeros
		resultado = true; 
	
	if (extra && ("áéíúóñü .:;,'").indexOf(character) > -1) 
		resultado = true;
	return resultado;
}

/* 
 * Esta funcion es para que el input solo admita Numericos, decimales y numeros negativos (de manera configurable) (Solo para evento onKeyPress).
 * @param event Este booleano indica si se convertira en mayusculas todos los char introducidos por el usuario.
 * @param numeric Este booleano indica si se incluiran numeros en los chars permitidos.
 * @param extra Es un Booleano que representa si quieres caracteres adicionales como enies y letras con acentos.
 * @param ctrlAllow Este booleano indica si se peritira el uso de la tecla Ctrl, al no permitirla no puedes usar la combinacion ctrl+v o ctrl+c.
*/
function onlyNumbers(element, event, decimal, minus){
	var resultado = false;
	var code; //key code
	
	if (!event) var event = window.event;
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
	var texto = element.val()+character;
	
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
		input.attr('class').match(/jQNumber(\d+)D(\d+)/gi);
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
	var idForm = inputActual.closest('form').attr('id');
	
	jQuery('form[id="'+idForm+'"] input[type="text"]:enabled, form[id="'+idForm+'"] select:enabled, form[id="'+idForm+'"] textarea:enabled').each(function () {
		var input = jQuery(this);
		if (!checkForErrors(input)) {
			result = false;
		}
	});
	
	jQAlertError(result, alert, idForm);
	return result;
}

/**	
 *
 * @param idForm Es el String del id de la Forma que se quiere Checar.
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
			var input = jQuery(this);
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
 * @param quiet Es un parametro booleando que indica si se quiere que lanze una alerta(false) o solo marcar los campos con error con la clase errorField(true).
 * @returns {Boolean} si algun campo tiene un error retornara un falso.
 */
function validateAll(alert,typeMessage){
	var result = true
	
	jQuery('input[type="text"]:enabled, select:enabled, textarea:enabled').each(function(){
		var input = jQuery(this);

		if (!checkForErrors(input)) {
			result = false;
		}
	});
	
	jQAlertError(result, alert, null,(typeMessage == null)?null:typeMessage);
	return result;
}

//Funciones Auxiliares en la Labor del Script jQValidator
//es mas sencillo y rapido checar sin RegEx para esta comprobacion.

/**
 * Esta funcion recibe un objeto Input y checa si este objeto tiene alguna de las clases del validator, 
 * si posee alguna checa que el contenido este de acuerdo con el regex que le corresponde.
 * Respondera con un False si ha encontrado un error en alguna comprobacion.
 * y regresara un True cuando no haya ningun error en el input entregado.
 * 
 */
 function checkForErrors(input){
	var valid = true;
	
//	if(input.hasClass('jQsaltolineatxa')){
//		if(isEmpty(input.val())){
//			valid = false;
//			errorTemp = strError[0][1];
//			errorLong.push(strError[0][2]);
//		}
//	}
	
	//-- Requeridos
	if(input.hasClass('jQrequired')){
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

function jQAlertError(resultado, alerta, idForm,typeMessage){
	var idCheck='';
	if (idForm != null){
		idCheck = '#'+idForm+' ';
	}
	if (!resultado && (alerta==true)) {
		var numErrs = jQuery(idCheck+'.errorField').length
		
		switch(typeMessage){
		case 'search':
			parent.mostrarMensajeInformativo('No es posible ejecutar la busqueda. Con la informaci\u00F3n capturada.\n\n Se encontraron ' + numErrs + ' campo(s) con errores.',"10");
			break;
		case 'save':
			parent.mostrarMensajeInformativo('No es posible guardar la informaci\u00F3n capturada.\n\n Se encontraron ' + numErrs + ' campo(s) con errores.',"10");
			break;
		default:
			parent.mostrarMensajeInformativo('Se encontraron ' + numErrs + ' campo(s) con errores.',"10");
		}
	}
}

function isEmpty(cadena){
	$trimmed = validatorTrimmer(cadena);
	return ($trimmed=="")?true:false;
}

function validatorTrimmer(cadena){
	$trim = cadena.replace(/^\s+/g,'').replace(/\s+$/g,'');
	return $trim;
}

function esMayorEdad(){	
	var fecha = jQuery("#fecha").val();
	if(isEmpty(fecha)){
		return true;
	}
	var f=new Date();	
		
	var array_fecha = fecha.split("/"); 
  	
   	var year = parseInt(array_fecha[2]); 

   	var mes = parseInt(array_fecha[1]); 

   	var dia = parseInt(array_fecha[0]);	
	   
	if((f.getFullYear() - year) > 18)	
	return true;	
	else if((f.getFullYear() - year) < 18){
		alert('Fecha de nacimiento invalida, debe ser mayor de edad');
		return false;	
	}
	else {	
		if (f.getMonth() + 1 - mes > 0){ 
			 return true; 
		}
		else if ((f.getMonth() + 1 - mes) < 0){ 
			alert('Fecha de nacimiento invalida, debe ser mayor de edad');
			 return false; 
		}
		else{
			if ((f.getDate() - dia) >= 0){ 
				 return true; 
			}
			else if ((f.getDate() - dia) < 0) {
				alert('Fecha de nacimiento invalida, debe ser mayor de edad');
				return false;
			}
		}	 
	}	
}

function jQIsRequired(){
	
		jQuery(".jQIsRequired").each(function(){
			var texto =	jQuery(this).text();
			jQuery(this).text(texto + " *");			
		});
}

function esMayorEdadServidor(){	
	var fecha = jQuery("#fecha").val();
	if(isEmpty(fecha)){
		return true;
	}
	var f=jQuery("#txtFechaActual").val();	
		
	var array_fecha = fecha.split("/"); 
  	
   	var year = parseInt(array_fecha[2]); 

   	var mes = parseInt(array_fecha[1]); 

   	var dia = parseInt(array_fecha[0]);	
	
   	var array_fechaServer=f.split("/");
   	var yearServer = parseInt(array_fechaServer[2]);
   	var mesServer =parseInt(array_fechaServer[1]);
   	var diaServer =parseInt(array_fechaServer[0]);
	if((yearServer - year) > 18)	
	return true;	
	else if((yearServer - year) < 18){
		alert('Fecha de nacimiento invalida, debe ser mayor de edad');
		return false;	
	}
	else {	
		if (mesServer - mes > 0){ 
			 return true; 
		}
		else if ((mesServer - mes) < 0){ 
			alert('Fecha de nacimiento invalida, debe ser mayor de edad');
			 return false; 
		}
		else{
			if ((diaServer - dia) >= 0){ 
				 return true; 
			}
			else if ((diaServer - dia) < 0) {
				alert('Fecha de nacimiento invalida, debe ser mayor de edad');
				return false;
			}
		}	 
	}	
}

//funcion que remueve la clase de todos los elementos de un formulario
function jQRemoveClass(clase){
	jQuery('input').each(function(item){
		jQuery(this).removeClass(clase);
	});
}

//function validarListEmail(obj) {
//	var valor = jQuery(obj).val();
//		if (valor!="" && /^([\w\.\xF1\-]+@[\w\.\xF1\-]+\.[\w]{2,4}[;{0,1}|\s|\r\n]*)*$/.test(valor)){
//			jQuery(obj).removeClass('errorField');
//			jQuery(obj).removeClass('jQrequired');
//			return true; 
////			alert("La dirección de email " + valor + " es correcta.");
//		} else {
//			jQuery(obj).addClass('errorField');
//			jQuery(obj).addClass('jQrequired');
////			alert("La dirección de email es incorrecta.");
//			return false; 
//		}
//}
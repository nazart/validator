/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var validator = function (nombreFormulario, elementos) {
    this.elementos = {};
    this.formulario = document.forms[nombreFormulario];
    this.mensajes = {};
    this.errores = new Array();
    this.arrayNombreElementos = new Array();
    for (var i = 0, elementoCount = elementos.length; i < elementoCount; i++) {
        var elemento = elementos[i];
        console.log(elemento.nombre);
        this.agregarElemento(elemento.nombre, elemento.validadores);
        this.arrayNombreElementos.push(elemento.nombre);
    }
    var onsubmit = this.formulario.onsubmit;
    this.formulario.onsubmit = (function (that) {
        return function (evt) {
            return that.validar(evt);
        };
    })(this);
}
validator.prototype.validar = function (evt) {
    this.errores = [];
    for (var i = 0, elementoCount = this.arrayNombreElementos.length; i < elementoCount; i++) {
        var elemento = this.elementos[this.arrayNombreElementos[i]];
        for (var j = 0, validadorCount = elemento.validadores.length; j < validadorCount; j++) {
            if (typeof elemento.validadores[j] === "string") {
                var $function = elemento.validadores[j];
                var $params = '';
            } else {
                var $function = elemento.validadores[j][0];
                var $params = elemento.validadores[j][1];
            }
            if (typeof this.setValidaciones[$function] === "function") {
                this.setValidaciones[$function].apply(this, [elemento.objectElemento, $params]);
            }
        }
    }
    evt.preventDefault();
    console.log(this.errores);
};
validator.prototype.setValidaciones = {
    requerido: function (objecElemento) {
        var valor = objecElemento.value;
        var result = (valor !== null && valor !== '');
        if (!result) {
            var mensaje = 'el valor del elemento ' + objecElemento.name + ' es requerido';
            this.setMensajeError(mensaje, objecElemento.name);
        }
        return result;
    },
    mailValido: function (objecElemento) {
        var valor = objecElemento.value;
        var regex = /^(([A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9!#$%&'*+\/=?^_`{|}~\.-]{0,63})|(\"[^(\\|\")]{0,62}\"))$/
        var result = regex.test(valor);
        if (!result) {
            var mensaje = 'el valor del elemento ' + objecElemento.name + ' no es un correo';
            this.setMensajeError(mensaje, objecElemento.name);
        }
        return result;
    },
    tamanoMaximo: function (objecElemento, length) {
        var result = (objecElemento.value.length <= parseInt(length));
        if (!result) {
            var mensaje = 'el tamaño valor del elemento ' + objecElemento.name + ' debe ser menor que ' + length;
            this.setMensajeError(mensaje, objecElemento.name);
        }
        return result;
    },
    valorEntre: function (objecElemento, valores) {
        var min = valores[0];
        var max = valores[1];
        var result = (parseInt(objecElemento.value) <= parseInt(max) && parseInt(objecElemento.value) >= parseInt(min));
        if (!result) {
            var mensaje = 'el valor del elemento ' + objecElemento.name + ' debe estar entre los valores ' + min + ' y ' + max;
            this.setMensajeError(mensaje, objecElemento.name);
        }
        return result;
    },
    soloEnteros: function (objecElemento, parametros) {
        var valor = objecElemento.value;
        var regex = /^\-?[0-9]+$/
        var result = regex.test(valor);
        if (!result) {
            var mensaje = 'el valor del elemento ' + objecElemento.name + ' debe ser un entero';
            this.setMensajeError(mensaje, objecElemento.name);
        }
        return result;
    },
    soloFecha:function (objecElemento, parametros){
        var valor = objecElemento.value;
        var regex =/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
        var result = regex.test(valor);
        if (!result) {
            var mensaje = 'el valor del elemento ' + objecElemento.name + ' debe ser una Fecha con el formato DD/MM/YYYY';
            this.setMensajeError(mensaje, objecElemento.name);
        }
        return result;
    }
}
validator.prototype.is_int = function (mixed_var) {
    return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
}
validator.prototype.setMensajeError = function (mensaje, nombreElemento) {
    this.errores.push({
        mensaje: mensaje,
        elemento: nombreElemento,
    });
}
validator.prototype.agregarElemento = function (nombre, validadores) {
    this.elementos[nombre] = {
        objectElemento: this.formulario[nombre],
        validadores: validadores,
        parametros: new Array(),
    };
}
    
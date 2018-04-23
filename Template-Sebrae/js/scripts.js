//Adiciona mascara ao CPF
function MascaraCPF(cpf){
    if(!event)
        event = window.event;
    if(mascaraInteiro(cpf) == false){
        event.returnValue = false;
    }
    return formataCampo(cpf, '000.000.000-00', event);
}

//Valida numero inteiro com mascara
function mascaraInteiro (){
    if(!event)
        event = window.event;
    if (event.keyCode < 48 || event.keyCode > 57){
        event.returnValue = false;
        return false;
    }
    return true;
}

//formata de forma generica os campos
function formataCampo(campo, Mascara, evento) {
    var boleanoMascara;

    var Digitato = evento.keyCode;
    var exp = /\-|\.|\/|\(|\)| /g
    var campoSoNumeros = campo.value.toString().replace(exp, "");

    var posicaoCampo = 0;
    var NovoValorCampo = "";
    var TamanhoMascara = campoSoNumeros.length;
    ;

    if (Digitato != 8) { // backspace 
        for (i = 0; i <= TamanhoMascara; i++) {
            boleanoMascara = ((Mascara.charAt(i) == "-") || (Mascara.charAt(i) == ".")
                    || (Mascara.charAt(i) == "/"))
            boleanoMascara = boleanoMascara || ((Mascara.charAt(i) == "(")
                    || (Mascara.charAt(i) == ")") || (Mascara.charAt(i) == " "))
            if (boleanoMascara) {
                NovoValorCampo += Mascara.charAt(i);
                TamanhoMascara++;
            } else {
                NovoValorCampo += campoSoNumeros.charAt(posicaoCampo);
                posicaoCampo++;
            }
        }
        campo.value = NovoValorCampo;
        return true;
    } else {
        return true;
    }
}

//Valida o CPF e faz a busca no DB
function validarCPF(cpf) {
    var valor = cpf;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') {
        document.getElementById('resultado').innerHTML = "<div class='alert alert-danger' role='alert'>CPF Invalido</div>";
        document.cadastrar_informacao.cpf.value = "";
        document.cadastrar_informacao.cpf.focus();
        return false;
    }

    if (cpf.length != 11 ||
            cpf == "00000000000" ||
            cpf == "11111111111" ||
            cpf == "22222222222" ||
            cpf == "33333333333" ||
            cpf == "44444444444" ||
            cpf == "55555555555" ||
            cpf == "66666666666" ||
            cpf == "77777777777" ||
            cpf == "88888888888" ||
            cpf == "99999999999") {
        document.getElementById('resultado').innerHTML = "<div class='alert alert-danger' role='alert'>CPF Invalido</div>";
        document.cadastrar_informacao.cpf.value = "";
        document.cadastrar_informacao.cpf.focus();
        return false;
    }
    // Valida 1º digito 
    var add = 0;
    for (i = 0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9))) {
        document.getElementById('resultado').innerHTML = "<div class='alert alert-danger' role='alert'>CPF Invalido</div>";
        document.cadastrar_informacao.cpf.value = "";
        document.cadastrar_informacao.cpf.focus();
        return false;
    }
    // Valida 2º digito 
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10))) {
        document.getElementById('resultado').innerHTML = "<div class='alert alert-danger' role='alert'>CPF Invalido</div>";
        document.cadastrar_informacao.cpf.value = "";
        document.cadastrar_informacao.cpf.focus();
    } else {
        var req;
        if (window.XMLHttpRequest) {
            req = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var url = "busca.php?cpf=" + valor;
        req.open("Get", url, true);
        req.onreadystatechange = function () {
            if (req.readyState == 1) {
                document.getElementById('resultado').innerHTML = "<div class='alert alert-warnin' role='alert'>Buscando CPF...</div>";
            }
            if (req.readyState == 4 && req.status == 200) {
                var resposta = req.responseText;
                document.getElementById('resultado').innerHTML = resposta;
            }
        }
        document.cadastrar_informacao.cpf.value = "";
        document.cadastrar_informacao.cpf.focus();
        req.send(null);
    }
}
document.getElementById("comenzar").addEventListener("click", comenzar);
document.getElementById("datos").addEventListener("click", datos);


var filaXcolumna = 7;
var bombas = 7;

function datos() {
    filaXcolumna = Number(window.document.formulario.tamano.value);
    bombas = Number(window.document.formulario.bombas.value);
    comenzar();
}

var tablero;

function crearTabla(num) {
    var x, y;
    tablero = new Array(num)
    for (i = 0; i < num; i++)
        tablero[i] = new Array(num);
    for (i = 0; i < num; i++)
        for (j = 0; j < num; j++)
            tablero[i][j] = 0;
}

var casillas_totales = filaXcolumna * filaXcolumna;

function comenzar() {
    var x, y;
    delete(tablero);

    crearTabla(filaXcolumna);
    casillas_totales = filaXcolumna * filaXcolumna;
    var estructurando = "<form action='' name='formulario2'><table id='over'>";
    for (i = 0; i < filaXcolumna; i++) {
        estructurando = estructurando + "<tr>";
        for (j = 0; j < filaXcolumna; j++)
            estructurando = estructurando + "<td><input type='button' class='botoncitos' id='boton_" +
            i.toString() + "_" + j.toString() + "' onclick='calificar(" + i.toString() +
            "," + j.toString() + ");'></td>";
        estructurando = estructurando + "</tr>"
    }
    estructurando = estructurando + "</table></form>";
    window.document.getElementById("tabla").innerHTML = estructurando;
    numeroBombas(bombas);
}

function guia(x, y) {
    if (x >= 0 && x <= filaXcolumna - 1 && y >= 0 && y <= filaXcolumna - 1)
        if (tablero[x][y] >= 0)
            tablero[x][y]++;
}

function numeroBombas(bom) {
    var x, y;
    var bombitas = bom;
    while (bombitas > 0) {
        i = Math.floor(filaXcolumna * Math.random());
        j = Math.floor(filaXcolumna * Math.random());
        if (tablero[i][j] == 0) {
            tablero[i][j] = -1;
            bombitas--;
        }
    }
    for (i = 0; i < filaXcolumna; i++)
        for (j = 0; j < filaXcolumna; j++)
            if (tablero[i][j] < 0) {
                guia(i - 1, j - 1);
                guia(i - 1, j);
                guia(i, j + 1);
                guia(i + 1, j - 1);
                guia(i + 1, j);
                guia(i + 1, j + 1);
                guia(i - 1, j + 1);
                guia(i, j - 1);
            }
}

function descubrir(x, y) {
    if (x >= 0 && x <= (filaXcolumna - 1) && y >= 0 && y <= (filaXcolumna - 1))
        if (tablero[x][y] >= 0 && (window.document.formulario2.elements[y + filaXcolumna * x].value.length == 0)) {
            window.document.formulario2.elements[y + filaXcolumna * x].value = tablero[x][y];
            casillas_totales--;
            if (tablero[x][y] == 0) {
                descubrir(x - 1, y - 1);
                descubrir(x - 1, y + 1);
                descubrir(x, y + 1);
                descubrir(x, y - 1);
                descubrir(x + 1, y - 1);
                descubrir(x - 1, y);
                descubrir(x + 1, y);
                descubrir(x + 1, y + 1);
            }
        }
}

function calificar(x, y) {
    if (tablero[x][y] >= 0)
        descubrir(x, y);
    else {
        for (i = 0; i < filaXcolumna; i++)
            for (j = 0; j < filaXcolumna; j++)
                if (tablero[i][j] >= 0)
                    window.document.formulario2.elements[j + filaXcolumna * i].value = tablero[i][j];
                else
                    window.document.formulario2.elements[j + filaXcolumna * i].style.backgroundImage = "url(assets/img/bomba.png)";
        swal({
            title: "FATAL!",
            text: "Esto ha explotado :(",
            timer: 2000,
            showConfirmButton: false,
            imageUrl: "assets/img/pow.png"
        });

        casillas_totales = 0;
    }
    if (casillas_totales == bombas) {
        for (i = 0; i < filaXcolumna; i++)
            for (j = 0; j < filaXcolumna; j++)
                if (tablero[i][j] < 0)
                    window.document.formulario2.elements[j + filaXcolumna * i].background = "salmon";
        swal({
            title: "EXCELENTE!",
            text: "Te has salvado de las bombas! :)",
            timer: 2000,
            showConfirmButton: false,
            imageUrl: "assets/img/132.png"
        });

        document.getElementById("over").removeEventListener("click", comenzar);
    }
}

$(document).mouseup(function(e) {
    var container = $("table");
    var input = $("input");

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        if (!input.is(e.target) && input.has(e.target).length === 0) {
            swal({
                title: "Sigue jugando",
                text: "¿Estas perdido?",
                imageUrl: 'assets/img/oh.png'
            });
        }
    }

});
// ==========================================
// CHRONO X
// Cronômetro com centésimos de segundo
// ==========================================


// ==========================================
// VARIÁVEIS
// ==========================================

let tempoInicial = 0;
let tempoDecorrido = 0;

let rodando = false;
let intervalo = null;

let numeroVolta = 0;


// ==========================================
// ELEMENTOS HTML
// ==========================================

const tempo = document.getElementById("tempo");

const botaoPrincipal =
    document.getElementById("botaoPrincipal");

const resetar =
    document.getElementById("resetar");

const volta =
    document.getElementById("volta");

const listaVoltas =
    document.getElementById("listaVoltas");


// ==========================================
// SISTEMA DE ÁUDIO
// ==========================================

const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

const audioContext = new AudioContext();


function tocarSom(
    frequencia,
    duracao,
    tipo = "sine"
) {

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscilador =
        audioContext.createOscillator();

    const ganho =
        audioContext.createGain();


    oscilador.type = tipo;

    oscilador.frequency.value =
        frequencia;


    ganho.gain.setValueAtTime(
        0.15,
        audioContext.currentTime
    );

    ganho.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duracao
    );


    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );


    oscilador.start();

    oscilador.stop(
        audioContext.currentTime + duracao
    );
}


// Som de início
function somIniciar() {

    tocarSom(
        800,
        0.12,
        "sine"
    );
}


// Som de pausa
function somParar() {

    tocarSom(
        400,
        0.18,
        "sine"
    );
}


// ==========================================
// ATUALIZAÇÃO DO DISPLAY
// ==========================================

function atualizarTela() {

    const totalMilissegundos =
        tempoDecorrido;


    // Horas
    const horas =
        Math.floor(
            totalMilissegundos / 3600000
        );


    // Minutos
    const minutos =
        Math.floor(
            (totalMilissegundos % 3600000)
            / 60000
        );


    // Segundos
    const segundos =
        Math.floor(
            (totalMilissegundos % 60000)
            / 1000
        );


    // Centésimos
    const centesimos =
        Math.floor(
            (totalMilissegundos % 1000)
            / 10
        );


    const h =
        String(horas).padStart(2, "0");

    const m =
        String(minutos).padStart(2, "0");

    const s =
        String(segundos).padStart(2, "0");

    const cs =
        String(centesimos).padStart(2, "0");


    tempo.innerHTML =
        `${h}:${m}:${s}<span>.${cs}</span>`;
}


// ==========================================
// CONTAGEM DO CRONÔMETRO
// ==========================================

function atualizarCronometro() {

    tempoDecorrido =
        Date.now() - tempoInicial;

    atualizarTela();
}


// ==========================================
// BOTÃO PRINCIPAL
// ==========================================

botaoPrincipal.addEventListener(
    "click",
    () => {

        // ==============================
        // INICIAR / CONTINUAR
        // ==============================

        if (!rodando) {

            somIniciar();


            tempoInicial =
                Date.now() - tempoDecorrido;


            intervalo =
                setInterval(
                    atualizarCronometro,
                    10
                );


            rodando = true;


            botaoPrincipal.textContent =
                "PAUSAR";


            botaoPrincipal.classList.add(
                "pausado"
            );


            botaoPrincipal.setAttribute(
                "aria-label",
                "Pausar cronômetro"
            );

        }

        // ==============================
        // PAUSAR
        // ==============================

        else {

            somParar();


            clearInterval(intervalo);


            tempoDecorrido =
                Date.now() - tempoInicial;


            rodando = false;


            botaoPrincipal.textContent =
                "CONTINUAR";


            botaoPrincipal.classList.remove(
                "pausado"
            );


            botaoPrincipal.setAttribute(
                "aria-label",
                "Continuar cronômetro"
            );


            atualizarTela();
        }
    }
);


// ==========================================
// RESETAR
// ==========================================

resetar.addEventListener(
    "click",
    () => {

        clearInterval(intervalo);


        tempoInicial = 0;

        tempoDecorrido = 0;

        rodando = false;

        numeroVolta = 0;


        botaoPrincipal.textContent =
            "INICIAR";


        botaoPrincipal.classList.remove(
            "pausado"
        );


        botaoPrincipal.setAttribute(
            "aria-label",
            "Iniciar cronômetro"
        );


        listaVoltas.innerHTML = "";


        atualizarTela();
    }
);


// ==========================================
// MARCAR VOLTA
// ==========================================

volta.addEventListener(
    "click",
    () => {

        // Não permite marcar volta
        // com o cronômetro parado

        if (!rodando) {
            return;
        }


        numeroVolta++;


        const item =
            document.createElement("li");


        item.textContent =
            `Volta ${numeroVolta} — ` +
            formatarTempo(tempoDecorrido);


        listaVoltas.prepend(item);
    }
);


// ==========================================
// FORMATAR TEMPO DAS VOLTAS
// ==========================================

function formatarTempo(
    msTotal
) {

    const horas =
        Math.floor(
            msTotal / 3600000
        );


    const minutos =
        Math.floor(
            (msTotal % 3600000)
            / 60000
        );


    const segundos =
        Math.floor(
            (msTotal % 60000)
            / 1000
        );


    const centesimos =
        Math.floor(
            (msTotal % 1000)
            / 10
        );


    return (
        `${String(horas).padStart(2, "0")}:` +
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundos).padStart(2, "0")}.` +
        `${String(centesimos).padStart(2, "0")}`
    );
}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarTela();
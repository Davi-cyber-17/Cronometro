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

const tempo =
    document.getElementById("tempo");

const botaoPrincipal =
    document.getElementById(
        "botaoPrincipal"
    );

const resetar =
    document.getElementById("resetar");

const volta =
    document.getElementById("volta");

const listaVoltas =
    document.getElementById(
        "listaVoltas"
    );


// ==========================================
// SISTEMA DE ÁUDIO
// ==========================================

const AudioContext =
    window.AudioContext ||
    window.webkitAudioContext;

const audioContext =
    new AudioContext();


// ==========================================
// SOM DE INÍCIO
// ==========================================

function tocarSomInicio() {

    if (
        audioContext.state ===
        "suspended"
    ) {
        audioContext.resume();
    }


    const agora =
        audioContext.currentTime;


    const oscilador =
        audioContext.createOscillator();


    const ganho =
        audioContext.createGain();


    oscilador.type = "sine";


    // Frequência inicial
    oscilador.frequency.setValueAtTime(
        650,
        agora
    );


    // Sobe rapidamente
    oscilador.frequency
        .exponentialRampToValueAtTime(
            1100,
            agora + 0.08
        );


    // Volume
    ganho.gain.setValueAtTime(
        0.18,
        agora
    );


    ganho.gain
        .exponentialRampToValueAtTime(
            0.001,
            agora + 0.12
        );


    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );


    oscilador.start(agora);

    oscilador.stop(
        agora + 0.12
    );
}


// ==========================================
// SOM DE PARADA
// ==========================================

function tocarSomParada() {

    if (
        audioContext.state ===
        "suspended"
    ) {
        audioContext.resume();
    }


    const agora =
        audioContext.currentTime;


    const oscilador =
        audioContext.createOscillator();


    const ganho =
        audioContext.createGain();


    oscilador.type = "sine";


    // Frequência inicial
    oscilador.frequency.setValueAtTime(
        700,
        agora
    );


    // Desce rapidamente
    oscilador.frequency
        .exponentialRampToValueAtTime(
            300,
            agora + 0.12
        );


    // Volume
    ganho.gain.setValueAtTime(
        0.18,
        agora
    );


    ganho.gain
        .exponentialRampToValueAtTime(
            0.001,
            agora + 0.16
        );


    oscilador.connect(ganho);

    ganho.connect(
        audioContext.destination
    );


    oscilador.start(agora);

    oscilador.stop(
        agora + 0.16
    );
}


// ==========================================
// ATUALIZAÇÃO DO DISPLAY
// ==========================================

function atualizarTela() {

    const totalMilissegundos =
        tempoDecorrido;


    const horas =
        Math.floor(
            totalMilissegundos /
            3600000
        );


    const minutos =
        Math.floor(
            (
                totalMilissegundos %
                3600000
            ) / 60000
        );


    const segundos =
        Math.floor(
            (
                totalMilissegundos %
                60000
            ) / 1000
        );


    const centesimos =
        Math.floor(
            (
                totalMilissegundos %
                1000
            ) / 10
        );


    const h =
        String(horas)
            .padStart(2, "0");


    const m =
        String(minutos)
            .padStart(2, "0");


    const s =
        String(segundos)
            .padStart(2, "0");


    const cs =
        String(centesimos)
            .padStart(2, "0");


    tempo.innerHTML =
        `${h}:${m}:${s}<span>.${cs}</span>`;
}


// ==========================================
// ATUALIZAÇÃO DO CRONÔMETRO
// ==========================================

function atualizarCronometro() {

    tempoDecorrido =
        Date.now() -
        tempoInicial;


    atualizarTela();
}


// ==========================================
// BOTÃO PRINCIPAL
// ==========================================

botaoPrincipal.addEventListener(
    "click",
    () => {

        // ==================================
        // INICIAR / CONTINUAR
        // ==================================

        if (!rodando) {

            // Atualiza o estado primeiro
            rodando = true;


            // Mantém o tempo anterior
            tempoInicial =
                Date.now() -
                tempoDecorrido;


            // Atualiza botão
            botaoPrincipal.textContent =
                "PAUSAR";


            botaoPrincipal.classList.add(
                "pausado"
            );


            botaoPrincipal.setAttribute(
                "aria-label",
                "Pausar cronômetro"
            );


            // Esconde o número
            tempo.style.visibility =
                "hidden";


            // Começa a contagem
            intervalo =
                setInterval(
                    atualizarCronometro,
                    10
                );


            // Som sincronizado
            tocarSomInicio();

        }


        // ==================================
        // PAUSAR
        // ==================================

        else {

            // Para imediatamente
            clearInterval(intervalo);


            // Salva o tempo exato
            tempoDecorrido =
                Date.now() -
                tempoInicial;


            // Atualiza estado
            rodando = false;


            // Atualiza o último valor
            atualizarTela();


            // Mostra o número
            tempo.style.visibility =
                "visible";


            // Atualiza botão
            botaoPrincipal.textContent =
                "CONTINUAR";


            botaoPrincipal.classList.remove(
                "pausado"
            );


            botaoPrincipal.setAttribute(
                "aria-label",
                "Continuar cronômetro"
            );


            // Som sincronizado
            tocarSomParada();
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


        // Mostra o número novamente
        tempo.style.visibility =
            "visible";


        atualizarTela();
    }
);


// ==========================================
// MARCAR VOLTA
// ==========================================

volta.addEventListener(
    "click",
    () => {

        // Só funciona enquanto estiver rodando
        if (!rodando) {
            return;
        }


        numeroVolta++;


        const item =
            document.createElement("li");


        item.textContent =
            `Volta ${numeroVolta} — ` +
            formatarTempo(
                tempoDecorrido
            );


        listaVoltas.prepend(item);
    }
);


// ==========================================
// FORMATAR TEMPO
// ==========================================

function formatarTempo(msTotal) {

    const horas =
        Math.floor(
            msTotal /
            3600000
        );


    const minutos =
        Math.floor(
            (
                msTotal %
                3600000
            ) / 60000
        );


    const segundos =
        Math.floor(
            (
                msTotal %
                60000
            ) / 1000
        );


    const centesimos =
        Math.floor(
            (
                msTotal %
                1000
            ) / 10
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
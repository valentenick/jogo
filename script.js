const perguntas = [
  {
    categoria: "📝 Substantivos",
    pergunta: "Qual palavra é um substantivo próprio?",
    opcoes: ["Cidade", "Mariana", "Escola", "Cachorro"],
    correta: 1,
    dica: "Nomes de pessoas, lugares específicos e instituições podem ser próprios.",
    explicacao: "Mariana é um nome próprio e começa com letra maiúscula."
  },
  {
    categoria: "🎨 Adjetivos",
    pergunta: "Na frase 'O jardim florido é bonito', qual palavra é um adjetivo?",
    opcoes: ["Jardim", "É", "Florido", "O"],
    correta: 2,
    dica: "Procure a palavra que caracteriza o jardim.",
    explicacao: "Florido caracteriza o jardim. Por isso, é um adjetivo."
  },
  {
    categoria: "🏃 Verbos",
    pergunta: "Qual palavra indica uma ação?",
    opcoes: ["Alegre", "Caderno", "Correr", "Azul"],
    correta: 2,
    dica: "Pense no que uma pessoa pode fazer.",
    explicacao: "Correr é um verbo que indica uma ação."
  },
  {
    categoria: "❓ Pontuação",
    pergunta: "Qual sinal usamos normalmente no final de uma pergunta direta?",
    opcoes: ["Ponto-final (.)", "Vírgula (,)", "Interrogação (?)", "Dois-pontos (:)"],
    correta: 2,
    dica: "Esse sinal aparece no final de frases interrogativas.",
    explicacao: "O ponto de interrogação indica uma pergunta direta."
  },
  {
    categoria: "🔎 Interpretação",
    pergunta: "Lia levou um guarda-chuva porque o céu estava escuro. Por quê?",
    opcoes: [
      "Ia brincar.",
      "O céu estava escuro.",
      "Estava calor.",
      "Perdeu a mochila."
    ],
    correta: 1,
    dica: "A resposta está na própria frase!",
    explicacao: "O texto informa que Lia levou o guarda-chuva porque o céu estava escuro."
  },
  {
    categoria: "💬 Sinônimos",
    pergunta: "Qual palavra tem sentido semelhante a 'feliz'?",
    opcoes: ["Contente", "Cansado", "Distante", "Nervoso"],
    correta: 0,
    dica: "Qual palavra também expressa alegria?",
    explicacao: "Feliz e contente têm sentidos semelhantes."
  },
  {
    categoria: "↔️ Antônimos",
    pergunta: "Qual é o antônimo de 'generoso'?",
    opcoes: ["Bondoso", "Solidário", "Egoísta", "Amigável"],
    correta: 2,
    dica: "Procure uma palavra com sentido contrário.",
    explicacao: "Egoísta expressa uma ideia oposta à de generoso."
  },
  {
    categoria: "🧩 Pronomes",
    pergunta: "Pedro estudou. Ele fez a tarefa. A palavra 'ele' substitui quem?",
    opcoes: ["A tarefa", "Pedro", "O estudo", "A escola"],
    correta: 1,
    dica: "Quem realizou as duas ações?",
    explicacao: "O pronome ele retoma o nome Pedro."
  },
  {
    categoria: "🎉 Tipos de frase",
    pergunta: "Qual alternativa apresenta uma frase exclamativa?",
    opcoes: [
      "Onde está meu livro?",
      "Feche a porta.",
      "Hoje é segunda-feira.",
      "Que dia maravilhoso!"
    ],
    correta: 3,
    dica: "Essa frase expressa emoção ou admiração.",
    explicacao: "A frase expressa emoção e termina com ponto de exclamação."
  },
  {
    categoria: "🌱 Compreensão",
    pergunta: "Ravi regou as plantas todos os dias. Uma semana depois, surgiram flores. O que ajudou as plantas?",
    opcoes: [
      "O cuidado e a rega.",
      "A falta de água.",
      "O frio da noite.",
      "A retirada das folhas."
    ],
    correta: 0,
    dica: "Pense no que Ravi fez para cuidar das plantas.",
    explicacao: "O cuidado e a rega são apresentados como parte do processo de crescimento."
  }
];

const $ = (id) => document.getElementById(id);

const telas = {
  inicio: $("tela-inicial"),
  jogo: $("tela-jogo"),
  final: $("tela-final")
};

let indice = 0;
let pontos = 0;
let acertos = 0;
let combo = 0;
let melhorCombo = 0;
let moedas = 0;
let respondeu = false;
let somLigado = true;
let audioContext = null;
let temporizadorEfeito = null;

function mostrarTela(nome) {
  Object.values(telas).forEach((tela) => {
    tela.classList.add("hidden");
  });

  telas[nome].classList.remove("hidden");
}

function atualizarPlacar() {
  $("pontos").textContent = pontos;
  $("combo").textContent = combo;
  $("moedas").textContent = moedas;
}

function atualizarMascote(titulo, mensagem, emoji) {
  $("mascote-titulo").textContent = titulo;
  $("mascote-texto").textContent = mensagem;

  if (emoji) {
    $("mascote").textContent = emoji;
  }
}

function tocarSom(tipo) {
  if (!somLigado) return;

  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;

    if (!audioContext) audioContext = new Audio();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const notas = {
      acerto: [523.25, 659.25, 783.99],
      erro: [240, 190],
      moeda: [880, 1174.66],
      final: [523.25, 659.25, 783.99, 1046.5],
      clique: [420]
    };

    const frequencias = notas[tipo] || notas.clique;

    frequencias.forEach((frequencia, i) => {
      const oscilador = audioContext.createOscillator();
      const volume = audioContext.createGain();
      const inicio = audioContext.currentTime + i * 0.11;

      oscilador.type = tipo === "erro" ? "triangle" : "sine";
      oscilador.frequency.setValueAtTime(frequencia, inicio);

      volume.gain.setValueAtTime(0.0001, inicio);
      volume.gain.exponentialRampToValueAtTime(0.12, inicio + 0.02);
      volume.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.16);

      oscilador.connect(volume);
      volume.connect(audioContext.destination);

      oscilador.start(inicio);
      oscilador.stop(inicio + 0.18);
    });
  } catch (erro) {
    // O jogo continua funcionando mesmo se o áudio não estiver disponível.
  }
}

function criarParticulas(elemento, quantidade = 18) {
  const simbolos = ["⭐", "✨", "💜", "🌈", "🎉", "💎"];

  for (let i = 0; i < quantidade; i++) {
    const particula = document.createElement("span");

    particula.className = "particle";
    particula.textContent =
      simbolos[Math.floor(Math.random() * simbolos.length)];

    particula.style.setProperty("--x", `${Math.random() * 95}%`);
    particula.style.setProperty("--size", `${16 + Math.random() * 18}px`);
    particula.style.setProperty("--duration", `${1 + Math.random()}s`);

    elemento.appendChild(particula);

    particula.addEventListener("animationend", () => {
      particula.remove();
    });
  }
}

function explosao() {
  const camada = $("efeitos");
  camada.replaceChildren();
  criarParticulas(camada, 24);

  clearTimeout(temporizadorEfeito);
  temporizadorEfeito = setTimeout(() => camada.replaceChildren(), 2400);
}

function iniciarJogo() {
  indice = 0;
  pontos = 0;
  acertos = 0;
  combo = 0;
  melhorCombo = 0;
  moedas = 0;
  respondeu = false;

  atualizarPlacar();
  mostrarTela("jogo");
  mostrarPergunta();
  tocarSom("clique");
}

function mostrarPergunta() {
  respondeu = false;

  const atual = perguntas[indice];

  $("fase").textContent = indice + 1;
  $("categoria").textContent = atual.categoria;
  $("pergunta").textContent = atual.pergunta;
  $("feedback").className = "feedback";
  $("feedback").textContent = "";

  $("botao-proxima").classList.add("hidden");
  $("botao-proxima").textContent =
    indice === perguntas.length - 1
      ? "CONQUISTAR MEU PRÊMIO 🏆"
      : "PRÓXIMA FASE ➜";

  const percentual = (indice / perguntas.length) * 100;
  $("barra").style.width = `${percentual}%`;
  $("progresso").setAttribute("aria-valuenow", indice);

  const lista = $("alternativas");
  lista.replaceChildren();

  atual.opcoes.forEach((opcao, posicao) => {
    const botao = document.createElement("button");
    const letra = document.createElement("span");
    const texto = document.createElement("span");

    botao.type = "button";
    botao.className = "answer";

    letra.className = "answer-letter";
    letra.textContent = String.fromCharCode(65 + posicao);

    texto.textContent = opcao;

    botao.append(letra, texto);
    botao.addEventListener("click", () => verificarResposta(posicao));

    lista.appendChild(botao);
  });

  atualizarMascote(
    "Nova missão! 🐸",
    "Leia com atenção e escolha sua resposta. Você consegue!",
    "🐸"
  );

  $("pergunta").focus();
}

function mostrarFeedback(tipo, mensagem) {
  const elemento = $("feedback");
  elemento.textContent = mensagem;
  elemento.className = `feedback visible ${tipo}`;
}

function verificarResposta(escolhida) {
  if (respondeu) return;

  respondeu = true;

  const atual = perguntas[indice];
  const botoes = $("alternativas").querySelectorAll(".answer");
  const acertou = escolhida === atual.correta;

  botoes.forEach((botao, posicao) => {
    botao.disabled = true;

    if (posicao === atual.correta) {
      botao.classList.add("correct");
    } else if (posicao === escolhida) {
      botao.classList.add("wrong");
    }
  });

  if (acertou) {
    combo++;
    melhorCombo = Math.max(melhorCombo, combo);
    acertos++;

    // Cada acerto vale 10 pontos.
    // A partir do terceiro acerto seguido, há bônus.
    const bonus = combo >= 3 ? 5 : 0;
    const ganho = 10 + bonus;

    pontos += ganho;
    moedas += 2 + (combo >= 3 ? 1 : 0);

    tocarSom("acerto");
    if (combo >= 3) tocarSom("moeda");

    mostrarFeedback(
      "success",
      `🎉 ACERTOU! +${ganho} pontos! ${atual.explicacao}` +
      (bonus ? " 🔥 Bônus de combo!" : "")
    );

    atualizarMascote(
      combo >= 3 ? `Combo de ${combo}! 🔥` : "Muito bem! 🌟",
      combo >= 3
        ? "Você está arrasando! Continue sua sequência!"
        : "Resposta correta! Vamos conquistar mais estrelas!",
      combo >= 3 ? "🤩" : "🐸"
    );

    criarParticulas($("efeitos"), combo >= 3 ? 24 : 13);
    explosao();
  } else {
    combo = 0;

    tocarSom("erro");

    mostrarFeedback(
      "mistake",
      `💡 Quase! ${atual.explicacao} Continue tentando!`
    );

    atualizarMascote(
      "Não desista! 💜",
      `Aqui vai uma dica: ${atual.dica}`,
      "🧐"
    );
  }

  atualizarPlacar();

  const percentual = ((indice + 1) / perguntas.length) * 100;
  $("barra").style.width = `${percentual}%`;
  $("progresso").setAttribute("aria-valuenow", indice + 1);

  $("botao-proxima").classList.remove("hidden");
  $("botao-proxima").focus();
}

function proximaPergunta() {
  if (!respondeu) return;

  indice++;

  if (indice < perguntas.length) {
    mostrarPergunta();
  } else {
    finalizarJogo();
  }
}

function finalizarJogo() {
  mostrarTela("final");

  $("resultado-pontos").textContent = pontos;
  $("resultado-acertos").textContent = `${acertos}/${perguntas.length}`;
  $("resultado-moedas").textContent = moedas;

  const nome = $("nome-jogador").value.trim();
  const saudacao = nome ? `${nome}, ` : "";

  let titulo;
  let mensagem;
  let emoji;
  let classificacao;

  if (acertos === 10) {
    titulo = `${saudacao}missão perfeita!`;
    mensagem = "Você acertou todas! Sua dedicação merece uma grande comemoração!";
    emoji = "👑";
    classificacao = "🏆 Lenda da Língua Portuguesa";
  } else if (acertos >= 8) {
    titulo = `${saudacao}você brilhou!`;
    mensagem = "Que aventura incrível! Você mostrou que conhece muito bem as palavras.";
    emoji = "🏆";
    classificacao = "🌟 Mestre das Palavras";
  } else if (acertos >= 5) {
    titulo = `${saudacao}parabéns!`;
    mensagem = "Você avançou bastante! Continue praticando para desbloquear novos conhecimentos.";
    emoji = "🥇";
    classificacao = "🚀 Explorador do Saber";
  } else {
    titulo = `${saudacao}continue explorando!`;
    mensagem = "Cada erro ensina alguma coisa. Reveja as dicas e tente novamente!";
    emoji = "🌈";
    classificacao = "💜 Aprendiz Corajoso";
  }

  $("titulo-final").textContent = titulo;
  $("mensagem-final").textContent = mensagem;
  $("emoji-final").textContent = emoji;
  $("classificacao").textContent = classificacao;

  $("chuva-final").replaceChildren();
  criarParticulas($("chuva-final"), 30);

  tocarSom("final");
}

function voltarInicio() {
  mostrarTela("inicio");
  $("nome-jogador").focus();
}

$("botao-iniciar").addEventListener("click", iniciarJogo);
$("botao-proxima").addEventListener("click", proximaPergunta);
$("botao-reiniciar").addEventListener("click", iniciarJogo);
$("botao-sair").addEventListener("click", voltarInicio);
$("botao-inicio-final").addEventListener("click", voltarInicio);

$("som-toggle").addEventListener("click", () => {
  somLigado = !somLigado;

  const botao = $("som-toggle");
  botao.textContent = somLigado ? "🔊 Som ligado" : "🔇 Som desligado";
  botao.setAttribute("aria-pressed", String(somLigado));
  botao.setAttribute(
    "aria-label",
    somLigado ? "Desligar sons" : "Ligar sons"
  );

  if (somLigado) tocarSom("clique");
});
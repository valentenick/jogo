const perguntas = [
  {
    categoria: "Substantivos",
    pergunta: "Qual palavra é um substantivo próprio?",
    alternativas: ["cidade", "Mariana", "escola", "cachorro"],
    correta: 1,
    explicacao: "Mariana é um nome próprio e começa com letra maiúscula."
  },
  {
    categoria: "Adjetivos",
    pergunta: "Na frase 'O jardim florido é bonito', qual palavra é um adjetivo?",
    alternativas: ["jardim", "é", "florido", "o"],
    correta: 2,
    explicacao: "Florido caracteriza o jardim, por isso é um adjetivo."
  },
  {
    categoria: "Verbos",
    pergunta: "Qual palavra indica uma ação?",
    alternativas: ["alegre", "caderno", "correr", "azul"],
    correta: 2,
    explicacao: "Correr é um verbo que indica uma ação."
  },
  {
    categoria: "Pontuação",
    pergunta: "Qual sinal devemos usar no final de uma pergunta?",
    alternativas: [". Ponto-final", "! Exclamação", "? Interrogação", ", Vírgula"],
    correta: 2,
    explicacao: "O ponto de interrogação indica uma pergunta."
  },
  {
    categoria: "Interpretação",
    pergunta: "Leia: 'Lia levou um guarda-chuva porque o céu estava escuro.' Por que Lia levou o guarda-chuva?",
    alternativas: [
      "Porque ia brincar.",
      "Porque o céu estava escuro.",
      "Porque estava calor.",
      "Porque perdeu a mochila."
    ],
    correta: 1,
    explicacao: "O texto informa que Lia levou o guarda-chuva porque o céu estava escuro."
  },
  {
    categoria: "Sinônimos",
    pergunta: "Qual palavra tem sentido semelhante a 'feliz'?",
    alternativas: ["contente", "cansado", "distante", "nervoso"],
    correta: 0,
    explicacao: "Feliz e contente são palavras de sentidos semelhantes."
  },
  {
    categoria: "Antônimos",
    pergunta: "Qual é o antônimo de 'generoso'?",
    alternativas: ["bondoso", "solidário", "egoísta", "amigável"],
    correta: 2,
    explicacao: "Egoísta expressa uma ideia oposta à de generoso."
  },
  {
    categoria: "Pronomes",
    pergunta: "Na frase 'Pedro estudou. Ele fez a tarefa.', a palavra 'ele' substitui:",
    alternativas: ["a tarefa", "Pedro", "o estudo", "a escola"],
    correta: 1,
    explicacao: "O pronome ele retoma o nome Pedro."
  },
  {
    categoria: "Tipos de frase",
    pergunta: "Qual alternativa apresenta uma frase exclamativa?",
    alternativas: [
      "Onde está meu livro?",
      "Feche a porta.",
      "Hoje é segunda-feira.",
      "Que dia maravilhoso!"
    ],
    correta: 3,
    explicacao: "A frase expressa emoção e termina com ponto de exclamação."
  },
  {
    categoria: "Compreensão de texto",
    pergunta: "Leia: 'Ravi regou as plantas todos os dias. Uma semana depois, surgiram novas flores.' O que ajudou as plantas a crescer?",
    alternativas: [
      "O cuidado e a rega.",
      "A falta de água.",
      "O frio da noite.",
      "A retirada das folhas."
    ],
    correta: 0,
    explicacao: "O texto relaciona o cuidado e a rega ao crescimento das plantas."
  }
];

const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const telaFinal = document.getElementById("tela-final");

const botaoIniciar = document.getElementById("botao-iniciar");
const botaoProxima = document.getElementById("botao-proxima");
const botaoReiniciar = document.getElementById("botao-reiniciar");

const contador = document.getElementById("contador");
const pontosTexto = document.getElementById("pontos");
const categoria = document.getElementById("categoria");
const textoPergunta = document.getElementById("texto-pergunta");
const alternativas = document.getElementById("alternativas");
const feedback = document.getElementById("feedback");
const barra = document.getElementById("barra");
const progresso = document.getElementById("progresso");

let indiceAtual = 0;
let pontos = 0;
let acertos = 0;
let respondeu = false;

function mostrarTela(tela) {
  [telaInicial, telaJogo, telaFinal].forEach((elemento) => {
    elemento.classList.add("escondido");
  });

  tela.classList.remove("escondido");
}

function iniciarJogo() {
  indiceAtual = 0;
  pontos = 0;
  acertos = 0;
  respondeu = false;

  pontosTexto.textContent = pontos;
  mostrarTela(telaJogo);
  mostrarPergunta();
}

function mostrarPergunta() {
  respondeu = false;

  const atual = perguntas[indiceAtual];

  contador.textContent =
    `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;

  categoria.textContent = atual.categoria.toUpperCase();
  textoPergunta.textContent = atual.pergunta;
  pontosTexto.textContent = pontos;

  feedback.textContent = "";
  feedback.className = "feedback";
  botaoProxima.classList.add("escondido");
  alternativas.replaceChildren();

  const percentual = (indiceAtual / perguntas.length) * 100;
  barra.style.width = `${percentual}%`;
  progresso.setAttribute("aria-valuenow", indiceAtual);

  atual.alternativas.forEach((opcao, indice) => {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "alternativa";
    botao.textContent = `${String.fromCharCode(65 + indice)}) ${opcao}`;

    botao.addEventListener("click", () => verificarResposta(indice));

    alternativas.appendChild(botao);
  });

  textoPergunta.focus();
}

function verificarResposta(indiceEscolhido) {
  if (respondeu) return;

  respondeu = true;

  const atual = perguntas[indiceAtual];
  const botoes = alternativas.querySelectorAll(".alternativa");
  const acertou = indiceEscolhido === atual.correta;

  botoes.forEach((botao, indice) => {
    botao.disabled = true;

    if (indice === atual.correta) {
      botao.classList.add("correta");
    } else if (indice === indiceEscolhido) {
      botao.classList.add("errada");
    }
  });

  if (acertou) {
    pontos += 10;
    acertos += 1;
    feedback.textContent = `Muito bem! 🎉 ${atual.explicacao}`;
    feedback.classList.add("acerto");
  } else {
    feedback.textContent = `Quase! 💪 ${atual.explicacao}`;
    feedback.classList.add("erro");
  }

  pontosTexto.textContent = pontos;

  const progressoAtual = ((indiceAtual + 1) / perguntas.length) * 100;
  barra.style.width = `${progressoAtual}%`;
  progresso.setAttribute("aria-valuenow", indiceAtual + 1);

  botaoProxima.textContent =
    indiceAtual === perguntas.length - 1
      ? "Ver resultado 🏆"
      : "Próxima pergunta ➜";

  botaoProxima.classList.remove("escondido");
  botaoProxima.focus();
}

function proximaPergunta() {
  if (!respondeu) return;

  indiceAtual += 1;

  if (indiceAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    finalizarJogo();
  }
}

function finalizarJogo() {
  mostrarTela(telaFinal);

  document.getElementById("resultado-pontos").textContent =
    `${pontos}/100`;

  document.getElementById("resultado-acertos").textContent =
    `${acertos} acerto(s) de ${perguntas.length} perguntas`;

  const tituloFinal = document.getElementById("titulo-final");
  const mensagemFinal = document.getElementById("mensagem-final");
  const emojiFinal = document.getElementById("emoji-final");

  if (acertos >= 9) {
    tituloFinal.textContent = "Você é incrível!";
    mensagemFinal.textContent =
      "Excelente trabalho! Você demonstrou muito conhecimento em Língua Portuguesa.";
    emojiFinal.textContent = "🏆";
  } else if (acertos >= 6) {
    tituloFinal.textContent = "Muito bem!";
    mensagemFinal.textContent =
      "Você está no caminho certo! Continue praticando para aprender ainda mais.";
    emojiFinal.textContent = "🌟";
  } else {
    tituloFinal.textContent = "Continue tentando!";
    mensagemFinal.textContent =
      "Cada tentativa é uma oportunidade de aprender. Jogue novamente e descubra coisas novas!";
    emojiFinal.textContent = "🚀";
  }

  document.getElementById("barra").style.width = "100%";
}

botaoIniciar.addEventListener("click", iniciarJogo);
botaoProxima.addEventListener("click", proximaPergunta);
botaoReiniciar.addEventListener("click", iniciarJogo);

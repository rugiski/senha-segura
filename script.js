const campoSenha = document.getElementById('campo-senha');
const tamanhoSpan = document.getElementById('tamanho');
const botaoDiminuir = document.getElementById('diminuir');
const botaoAumentar = document.getElementById('aumentar');
const botaoGerar = document.getElementById('botao-gerar');
const botaoCopiar = document.getElementById('botao-copiar');

const checkMaiusculas = document.getElementById('maiusculas');
const checkMinusculas = document.getElementById('minusculas');
const checkNumeros = document.getElementById('numeros');
const checkSimbolos = document.getElementById('simbolos');

const combinacoesEl = document.getElementById('combinacoes');
const entropiaEl = document.getElementById('entropia');
const forcaTexto = document.getElementById('forca-texto');

let tamanho = 12;

// Conjuntos de caracteres
const MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz';
const NUMEROS = '0123456789';
const SIMBOLOS = '!@#$%&*()_+-=[]{}|;:,.<>?';

botaoDiminuir.addEventListener('click', () => {
  if (tamanho > 4) {
    tamanho--;
    tamanhoSpan.textContent = tamanho;
  }
});

botaoAumentar.addEventListener('click', () => {
  if (tamanho < 64) {
    tamanho++;
    tamanhoSpan.textContent = tamanho;
  }
});

botaoGerar.addEventListener('click', gerarSenha);
botaoCopiar.addEventListener('click', copiarSenha);

function gerarSenha() {
  let caracteres = '';
  let tamanhoConjunto = 0;

  if (checkMaiusculas.checked) {
    caracteres += MAIUSCULAS;
    tamanhoConjunto += 26;
  }
  if (checkMinusculas.checked) {
    caracteres += MINUSCULAS;
    tamanhoConjunto += 26;
  }
  if (checkNumeros.checked) {
    caracteres += NUMEROS;
    tamanhoConjunto += 10;
  }
  if (checkSimbolos.checked) {
    caracteres += SIMBOLOS;
    tamanhoConjunto += SIMBOLOS.length;
  }

  if (caracteres.length === 0) {
    alert('Selecione pelo menos um tipo de caractere!');
    return;
  }

  // Geração usando crypto para maior segurança (melhor que Math.random)
  let senha = '';
  const array = new Uint32Array(tamanho);
  crypto.getRandomValues(array);

  for (let i = 0; i < tamanho; i++) {
    senha += caracteres[array[i] % caracteres.length];
  }

  campoSenha.value = senha;

  // Matemática da segurança
  const combinacoes = Math.pow(tamanhoConjunto, tamanho);
  const entropia = Math.log2(combinacoes);

  combinacoesEl.textContent = combinacoes.toExponential(2);
  entropiaEl.textContent = entropia.toFixed(1);

  // Classificação de força
  let forca = '';
  let cor = '';
  if (entropia < 40) {
    forca = 'Fraca';
    cor = '#ef4444';
  } else if (entropia < 60) {
    forca = 'Média';
    cor = '#f59e0b';
  } else if (entropia < 80) {
    forca = 'Forte';
    cor = '#22c55e';
  } else {
    forca = 'Muito forte';
    cor = '#10b981';
  }

  forcaTexto.textContent = `Força: ${forca}`;
  forcaTexto.style.color = cor;
}

function copiarSenha() {
  if (!campoSenha.value || campoSenha.value === 'Clique em Gerar') return;

  navigator.clipboard.writeText(campoSenha.value).then(() => {
    botaoCopiar.textContent = '✓';
    setTimeout(() => {
      botaoCopiar.textContent = '📋';
    }, 1500);
  });
}

// Gera uma senha inicial
gerarSenha();

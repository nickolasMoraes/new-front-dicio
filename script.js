document.addEventListener("DOMContentLoaded", function() {
  const wordOfTheDayElement = document.getElementById("wordOfTheDay");
  const speakButton = document.getElementById("speakButton");

  fetchWordOfTheDay();

  speakButton.addEventListener("click", speakFirstWord);

  function fetchWordOfTheDay() {
    fetch('http://localhost:3000/dia')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar a palavra do dia.');
        }
        return response.text();
      })
      .then(data => {
        const startIndex = data.indexOf('Palavra do Dia') + 'Palavra do Dia'.length;

        // Captura a palavra do dia completa, removendo espaços em branco extras
        const wordOfTheDay = data.substring(startIndex).trim();

        // Encontrar a posição do primeiro espaço na palavra
        const firstSpaceIndex = wordOfTheDay.indexOf(' ');

        // Extrair a primeira palavra (até o primeiro espaço)
        const firstWord = wordOfTheDay.substring(0, firstSpaceIndex);

        // Extrair o restante do texto após a primeira palavra
        const remainingText = wordOfTheDay.substring(firstSpaceIndex + 1);

        // Adicionar a primeira palavra em negrito e com quebra de linha após ela
        const formattedText = `<strong>${firstWord}</strong><br>${remainingText}`;

        // Inserir o texto formatado na tag de parágrafo com o id 'wordOfTheDay'
        document.getElementById('wordOfTheDay').innerHTML = formattedText;

        // Atualiza o conteúdo do elemento no HTML com a palavra do dia
        //wordOfTheDayElement.textContent = wordOfTheDay;

        // Se o conteúdo não estiver vazio, captura a primeira palavra
        if (wordOfTheDay) {
          const firstWord = wordOfTheDay.split(' ')[0];

          // Verifica se a primeira palavra foi capturada corretamente
          console.log('Primeira palavra capturada:', firstWord);
        }
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  function speakFirstWord() {
    const wordOfTheDay = wordOfTheDayElement.textContent.trim();
    if (!wordOfTheDay) {
      alert('A palavra do dia está vazia.');
      return;
    }

    const firstWord = wordOfTheDay.split(' ')[0];
    const utterance = new SpeechSynthesisUtterance(firstWord);

    speechSynthesis.speak(utterance);
  }
});

// Função para obter e exibir as pesquisas recentes
async function displayRecentSearches() {
  try {
    // Faz a solicitação HTTP para obter as pesquisas recentes
    const response = await fetch('http://localhost:3000/recent-searches');
    
    // Verifica se a resposta da solicitação é bem-sucedida
    if (!response.ok) {
      throw new Error('Erro ao obter as últimas pesquisas.');
    }
    
    // Converte a resposta para JSON
    const data = await response.json();
    
    // Obtém a referência para o elemento onde as pesquisas recentes serão exibidas
    const recentSearchesElement = document.getElementById('recentSearches');
    
    // Limpa qualquer conteúdo anterior
    recentSearchesElement.innerHTML = '';
    
    // Itera sobre as pesquisas recentes e as adiciona ao elemento HTML
    data.recentSearches.forEach(search => {
      const searchItem = document.createElement('p');
      searchItem.textContent = search;
      searchItem.style.display = 'inline-block'; // Adiciona estilo para exibir lado a lado
      searchItem.style.marginRight = '10px'; // Adiciona margem para espaçamento entre os itens
      searchItem.style.border = '1px solid #ccc'; // Adiciona borda cinza
      searchItem.style.padding = '5px'; // Adiciona preenchimento interno para separar o texto da borda
      searchItem.style.borderRadius = '5px'; // Arredonda as bordas
      searchItem.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.1)'; // Adiciona sombra leve
      recentSearchesElement.appendChild(searchItem);
    });
  } catch (error) {
    console.error('Erro ao exibir as pesquisas recentes:', error.message);
  }
  
}




// Chama a função para exibir as pesquisas recentes quando a página é carregada
window.addEventListener('load', displayRecentSearches);

async function searchWord() { //funcao para busca da palavra
  const wordInput = document.getElementById('word');
  const word = wordInput.value;

  if (!word) { //verifica se o campo esta vazio
      alert('Por favor, digite uma palavra.');
      return;
  }

  try { //faz a busca da palavra na api
      const encodedWord = encodeURIComponent(word);
      const response = await fetch(`http://localhost:3000/search/${encodedWord}`);
      const data = await response.json(); //recebe resposta em json
      displayResult(data); //chama a funcao
  } catch (error) {
      console.error(error);
      alert('Erro ao buscar informações da palavra.');
  }
}

function displayResult(data) { //exibe os resultados na interface
  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = `Palavra: ${data.word}`;
  resultContainer.appendChild(heading);

  const meaningContainer = createPropertyContainer('Significado', data.meaning);
  const additionalInfoContainer = createPropertyContainer('Informações Adicionais', data.additionalInfo);
  const phrasesContainer = createPropertyContainer('Frases', data.phrases);

  resultContainer.appendChild(meaningContainer);
  resultContainer.appendChild(additionalInfoContainer);
  resultContainer.appendChild(phrasesContainer);
}

function createPropertyContainer(label, value) {
  const container = document.createElement('div');
  container.classList.add('property');

  const labelElement = document.createElement('strong');
  labelElement.textContent = `${label}: `;
  container.appendChild(labelElement);

  const valueElement = document.createElement('span');
  valueElement.textContent = value;
  container.appendChild(valueElement);

  return container;
}

// Funcao para falar a palavra
function speakWord() {
  const wordInput = document.getElementById('word');
  const word = wordInput.value;

  if (!word) {
      alert('Por favor, digite uma palavra.');
      return;
  }

  // Usa a API Web Speech para falar a palavra
  const speechSynthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(word);

  speechSynthesis.speak(utterance);
}

async function carregarVocabulario() {
  const response = await fetch('http://localhost:3000/vocabulario');
  const vocabulario = await response.text();
  document.getElementById('vocabular').innerText = vocabulario;
}

// Função para substituir o conteúdo pelo resultado de /sortear
async function sortearPalavra() {
  const response = await fetch('http://localhost:3000/sortear');
  const palavraSorteada = await response.text();
  document.getElementById('vocabular').innerText = palavraSorteada;
}

// Função para falar a palavra contida na div
function falarPalavra() {
  const palavra = document.getElementById('vocabular').innerText;
  // Verifica se o navegador suporta a síntese de voz
  if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(palavra);
      window.speechSynthesis.speak(utterance);
  } else {
      alert('Seu navegador não suporta a síntese de voz.');
  }
}

// Carregar o vocabulário ao carregar a página
window.onload = carregarVocabulario;

// Adicionar evento de clique ao botão de sortear
document.getElementById('sortearBtn').addEventListener('click', sortearPalavra);

// Adicionar evento de clique ao botão de falar
document.getElementById('falarBtn').addEventListener('click', falarPalavra);




// Injeta a função de selecionar o texto
function insertScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    try {
      await chrome.scripting.insertCSS({
        target: { tabId: tabs[0].id },
        files: ["styles/tooltip.css"],
      });

      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: [ 'libs/jquery-3.7.1.min.js' ],
      });

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: loadExtension,
      });
    } catch (err) {
      console.error(`failed to bootstrap: ${err}`);
    }
  });

  // Fecha a janela da extensão ao carrega-la
  setTimeout(() => window.close(), 100);
}

// Executa a função para selecionar texto
function loadExtension() {
  /**
   * Personaliza o cursor do mouse
   */
  function setCursor() {
    const cursorPath = 'imgs/cursor.png';
    const cursorUrl = chrome.runtime.getURL(cursorPath);

    [...document.body.getElementsByTagName('*')].forEach(
      (elem) => (elem.style.cursor = `url(${cursorUrl}), default`)
    );
  }

  /**
   * Remove o cursor do mouse
   */
  function removeCursor() {
    [...document.body.getElementsByTagName('*')].forEach((elem) =>
      elem.style.removeProperty('cursor')
    );
  }

  /**
   * Exibe o tooltip com o texto copiado
   * @param {number} posX Posição X do evento de clique
   * @param {number} posY Posição Y do evento de clique
   * @param {string} text Texto obtido do evento de clique
   */
  function displayTooltip(posX, posY, text) {
    const fadeDelay = 1000;
    const fadeDuration = 3000;

    const div = $('<div class="tooltip-wrapper">')
      .css({
        left: `${posX}px`,
        top: `${posY}px`,
      })
      .append($(`<span class="tooltip">Copiado: ${text}</span>`))
      .appendTo(document.body);

    setTimeout(() => {
      div.addClass('fade-out');
      setTimeout(() => div.remove(), fadeDuration);
    }, fadeDelay);
  }

  /**
   * Registra os listeners
   */
  function registerListeners() {
    /**
     * @param {MouseEvent} event
     */
    function clickListener(event) {
      event.preventDefault();
      const target = event.target;
      const text = target.innerText || target.textContent;

      navigator.clipboard.writeText(text);

      displayTooltip(event.pageX, event.pageY, text);
    }

    /**
     * @param {KeyboardEvent} event
     */
    function keyListener(event) {
      if (event.key === 'Escape') {
        removeCursor();
        document.removeEventListener('click', clickListener, false);
        document.removeEventListener('keydown', keyListener, false);
      }
    }

    document.addEventListener('click', clickListener, false);
    document.addEventListener('keydown', keyListener);
  }

  setCursor();
  registerListeners();
}

// Adiciona evento de clique ao botão para selecionar texto
document.getElementById('selectText').addEventListener('click', insertScript);
insertScript();

// Adiciona evento de clique ao botão para selecionar texto
document.getElementById('selectText').addEventListener('click', insertScript);

// Injeta a função de selecionar o texto
function insertScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: loadExtension,
    });
  });

  // Fecha a janela da extensão ao carrega-la
  setTimeout(() => {
    window.close();
  }, 100);
}

insertScript();

// Executa a função para selecionar texto
function loadExtension() {
  /**
   * Personaliza o cursor do mouse
   */
  function setCursor() {
    const cursorPath = 'img/cursor.png';
    const cursorUrl = chrome.runtime.getURL(cursorPath);

    const elems = document.body.getElementsByTagName('*');

    for (const i of elems) {
      i.style.cursor = 'url(' + cursorUrl + '), default';
    }
  }

  /**
   * Remove o cursor do mouse
   */
  function removeCursor() {
    const elems = document.body.getElementsByTagName('*');

    for (const i of elems) {
      i.style.removeProperty('cursor');
    }
  }

  /**
   * Exibe o tooltip com o texto copiado
   * @param {number} posX Posição X do evento de clique
   * @param {number} posY Posição Y do evento de clique
   * @param {string} text Texto obtido do evento de clique
   */
  function displayTooltip(posX, posY, text) {
    var fadeDelay = 1000;
    var fadeDuration = 3000;

    var div = $('<div class="image-wrapper">')
      .css({
        left: posX + 'px',
        top: posY + 'px',
      })
      .append($(`<span class="tooltip">Copiado: ${text}</span>`))
      .appendTo(document.body);

    setTimeout(function () {
      div.addClass('fade-out');
      setTimeout(function () {
        div.remove();
      }, fadeDuration);
    }, fadeDelay);
  }

  /**
   * Registra os listeners
   */
  function registerListeners() {
    /**
     * @param {Event} e
     */
    function clickListener(e) {
      e = e || window.event;
      e.preventDefault();
      const target = e.target || e.srcElement;
      const text = target.textContent || target.innerText;

      console.log(target);
      console.log(text);

      navigator.clipboard.writeText(text);

      displayTooltip(e.pageX, e.pageY, text);
    }

    /**
     *
     * @param {MouseEvent} event
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

// Adiciona evento de clique ao botão para selecionar texto
document.getElementById("selectText").addEventListener("click", insertScript);

// Injeta a função de selecionar o texto
function insertScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: selectText,
    });
  });

  setTimeout(() => {
    window.close();
  }, 500);
}

insertScript();

// Executa a função para selecionar texto
function selectText() {


  // const contentScriptLinks = ['libs/jquery-1.8.3.min.js'];

  // contentScriptLinks.forEach(src => {
  //   let el = document.createElement('script');
  //   el.src = chrome.runtime.getURL(src);
  //   document.body.appendChild(el);
  // });





  const cursorPath = 'img/cursor.png';
  const cursorUrl = chrome.runtime.getURL(cursorPath);

  const elems = document.body.getElementsByTagName("*");

  for(const i of elems){
    i.style.cursor = "url(" + cursorUrl + "), default";
  }

  /**
   * 
   * @param {Event} e 
   */
  function listener(e) {
    e = e || window.event;
    e.preventDefault();
    const target = e.target || e.srcElement;
    const text = target.textContent || target.innerText;

    console.log(target);
    console.log(text);


    var fadeDelay = 1000;
    var fadeDuration = 1000;

    var div = $('<div class="image-wrapper">')
      .css({
        "left": e.pageX + 'px',
        "top": e.pageY + 'px'
      })
      .append($('<span>AAAA</span>'))
      .append($('<img src="" alt="myimage" />'))
      .appendTo(document.body);
        
    setTimeout(function() {
      div.addClass('fade-out');			
      setTimeout(function() { div.remove(); }, fadeDuration);
    }, fadeDelay);
      

  }

  document.addEventListener("click",listener,false);

  document.addEventListener('keydown', function(event){
    if(event.key === "Escape"){
      document.removeEventListener('click', listener, false);

      const elems = document.body.getElementsByTagName("*");

      for(const i of elems){
        i.style.removeProperty('cursor');
      }
    }
  });
}

// // This function selects a random topic from an array and
// function selectText() {
//   // This is an array to store our search terms
//   const searchTerms = [
//     "PC and Mobile",
//     "Lifestyle",
//     "Hardware",
//     "Windows",
//     "Mac",
//     "Linux",
//     "Android",
//     "Apple",
//     "Internet",
//     "Security",
//     "Programming",
//     "Entertainment",
//     "Productivity",
//     "Career",
//     "Creative",
//     "Gaming",
//     "Social Media",
//     "Smart Home",
//     "DIY",
//     "Review",
//   ];

//   // This generates a random number between 0 and 19
//   let selectorNumber = Math.floor(Math.random() * 20);

//   // This uses the random number to select an entry from the array
//   let selection = searchTerms[selectorNumber];

//   console.log(`sdasd`);

//   // // This simulates a click on the MUO website search icon
//   // document.getElementById("js-search").click();
//   //
//   // // This sets the MUO website search bar as a variable
//   // var searchBar = document.getElementById("js-search-input");
//   //
//   // // This inserts our random search term into the search bar
//   // searchBar.value = searchBar.value + selection;
//   //
//   // // This finishes the process by activating the website form
//   // document.getElementById("searchform2").submit();
// }

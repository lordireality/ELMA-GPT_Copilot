sendLog(4);
(() => {
const waitForMonacoModel = () => new Promise(resolve => {
  const interval = setInterval(() => {
    sendLog(5);
    const models = window.monaco?.editor?.getModels?.();
    const model = models?.[0];

    if (model) {
        sendLog(6);
        clearInterval(interval);
        resolve(model);
        sendLog(7);
        const buttons = document.querySelectorAll('button span');
        let buttonWrapper = null;
    
        for (const span of buttons) {
          if (span.textContent.trim() === "Закрыть") {
            buttonWrapper = span.closest('.form-element-wrap--ButtonViewItem');
            break;
          }
        }
    
        const row = buttonWrapper.parentElement;
        if (row) {
          const wrapper = document.createElement('div');
          wrapper.className = 'viewitem-content form-element-wrap--ButtonViewItem';
    
          const button = document.createElement('button');
          button.id = "showGPTPannel";
          button.type = 'button';
          button.className = 'ant-btn btn btn--shape-shape btn--type-fill btn--size-default btn--style-success';
          button.innerHTML = '<span>Спросить у GPT</span>';
          button.onclick = () => {
            document.getElementById("gpt-panel").hidden = !document.getElementById("gpt-panel").hidden;

          }
          wrapper.appendChild(button);
          row.appendChild(wrapper);
        } else {
    
        }
    }

  }, 1000);
});

(async () => {
  const model = await waitForMonacoModel();
  if (!model) return;
  window.__ELMA_GPT_MONACOMODEL = model;
  window.postMessage({ type: "GPT_MODEL_READY" }, "*");
})();


})();

function sendLog(index) {
  window.postMessage({
    type: "ELMA_GPT_LOGGER",
    index: index
  }, "*");
}

// Слушаем запросы на получение кода
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data.type === "GET_CURRENT_CODE") {
    const code = window.__ELMA_GPT_MONACOMODEL?.getValue?.();
    if (!code) return;

    window.postMessage({
      type: "GPT_CODE_RESPONSE",
      content: code
    }, "*");
  }
});

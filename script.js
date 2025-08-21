// Alterna abas (se houver)
function showTab(index) {
  const tabs = document.querySelectorAll('.tab-content');
  const buttons = document.querySelectorAll('.tab-btn');

  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  buttons.forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

// Abrir formulário e preencher serviço automaticamente
function abrirFormulario(servico) {
  document.getElementById('servico-selecionado').value = servico;
  document.getElementById('form-modal').style.display = 'flex';
}

function fecharFormulario() {
  document.getElementById('form-modal').style.display = 'none';
}

// Ativa o modal ao clicar em um serviço
document.querySelectorAll('.service-box').forEach(box => {
  box.addEventListener('click', () => {
    const servico = box.querySelector('.service-title').textContent;
    abrirFormulario(servico);
  });
});

// Envia os dados para o Google Sheets via Apps Script
document.getElementById('formulario-negocio').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  fetch("https://script.google.com/macros/s/AKfycbyXhCZNUzO3y1MWwqs-MACCsDbyiA7bp-DXHhJAZXimwCA3h47U2SeVP0EBKExqAP9rXw/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  

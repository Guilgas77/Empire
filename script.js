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
document.querySelectorAll('.service-box').forEach(box => {
  box.addEventListener('click', () => {
    const servico = box.querySelector('.service-title').textContent;
    document.getElementById('servico-selecionado').value = servico;
    abrirFormulario();
  });
});


function abrirFormulario() {
  document.getElementById('form-modal').style.display = 'flex';
}

function fecharFormulario() {
  document.getElementById('form-modal').style.display = 'none';
}

// Envio do formulário
document.getElementById('formulario-negocio').addEventListener('submit', function(e) {
  e.preventDefault();
  alert("Formulário enviado com sucesso!");
  fecharFormulario();
  this.reset();
});

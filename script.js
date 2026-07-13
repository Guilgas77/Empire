(() => {
  "use strict";

  const CONFIG = Object.freeze({
    endpoint: "https://script.google.com/macros/s/AKfycbyk1Patqx4jmQUvbCcUouM-Qt37-DDvvPbNhPlzrlZEie1aeWTSc5SGTXINTuWt4EjNMA/exec",
    phoneLength: 11,
    metragem: { min: 20, max: 1000 },
  });

  const BAIRROS = [
    "18 do Forte Empresarial","Alphaville Centro Industrial e Empresarial",
    "Alphaville Conde I","Alphaville Conde II","Alphaville Empresarial",
    "Alphaville Residencial Dois","Alphaville Residencial Plus",
    "Alphaville Residencial Um","Alphaville Residencial Zero",
    "Aldeia","Aldeinha","Altos","Belval","Boa Vista","Califórnia",
    "Centro","Centro Comercial Alphaville","Centro Comercial Jubran",
    "Conde I","Conde II","Cruz Preta","Empresarial 18 do Forte",
    "Engenho Novo","Fazenda Militar","Green Valley Alphaville",
    "Jardim Barueri","Jardim Belval","Jardim Boa Vista","Jardim Califórnia",
    "Jardim Esperança","Jardim Flórida","Jardim Graziela","Jardim Iracema",
    "Jardim Itaquiti","Jardim Júlio","Jardim Maria Cristina","Jardim Maria Helena",
    "Jardim Paraíso","Jardim Paulista","Jardim Reginalice","Jardim San Diego",
    "Jardim Santa Cecília","Jardim Santa Mônica","Jardim Santo Antônio",
    "Jardim São José","Jardim São Pedro","Jardim São Vicente de Paula",
    "Jardim Silveira","Jardim Tatiana","Jardim Tupan","Jardim Tupanci",
    "Jubran","Melville Empresarial I e II","Morada das Estrelas",
    "Morada dos Lagos","Morada dos Pássaros","Mutinga","Nova Aldeinha",
    "Parque dos Camargos","Parque Imperial","Parque Santa Luzia","Parque Viana",
    "Plus Residencial Alphaville","Residencial e Comercial Morada dos Lagos",
    "Residencial Nova Vida","Residencial Parque das Nações","Residencial Tamboré",
    "Residencial Vale do Sol","Silveira","Tamboré I","Tamboré II","Tamboré III",
    "Tamboré IV","Tamboré V","Tamboré VI","Villa Solaia","Votupoca",
  ];

  const $  = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

  const modal = $("#form-modal");
  const form = $("#formulario-negocio");
  const statusEl = $("#form-status");
  const inputs = {
    servico:  $("#servico-selecionado"),
    telefone: $("#telefone"),
    metragem: $("#metragem"),
    bairro:   $("#bairro"),
  };
  let lastFocused = null;

  const populateBairros = () => {
    const dl = $("#bairros");
    if (!dl) return;
    const frag = document.createDocumentFragment();
    for (const nome of BAIRROS) {
      const opt = document.createElement("option");
      opt.value = nome;
      frag.appendChild(opt);
    }
    dl.appendChild(frag);
  };

  const setStatus = (msg, kind) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove("form__status--ok","form__status--error");
    if (kind) statusEl.classList.add(`form__status--${kind}`);
  };

  const openModal = (servico) => {
    if (!modal) return;
    inputs.servico.value = servico;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    form?.querySelector("input:not([readonly]), textarea")?.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    setStatus("", null);
    lastFocused?.focus?.();
  };

  const validate = () => {
    const tel = inputs.telefone.value.trim();
    const met = Number(inputs.metragem.value);
    const bairro = inputs.bairro.value.trim();

    if (!new RegExp(`^\\d{${CONFIG.phoneLength}}$`).test(tel))
      return `O telefone deve conter exatamente ${CONFIG.phoneLength} dígitos.`;
    if (!Number.isFinite(met) || met < CONFIG.metragem.min || met > CONFIG.metragem.max)
      return `A metragem deve estar entre ${CONFIG.metragem.min} e ${CONFIG.metragem.max} m².`;
    if (!BAIRROS.includes(bairro))
      return "Selecione um bairro válido a partir da lista.";
    return null;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const error = validate();
    if (error) { setStatus(error, "error"); return; }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    setStatus("Enviando…", null);

    try {
      await fetch(CONFIG.endpoint, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form),
      });
      setStatus("Solicitação enviada com sucesso! Em breve entraremos em contato.", "ok");
      form.reset();
      setTimeout(closeModal, 1800);
    } catch (err) {
      console.error("[Empire] falha no envio:", err);
      setStatus("Não foi possível enviar. Tente novamente ou chame no WhatsApp.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  };

  const bindEvents = () => {
    $$(".service-card").forEach((card) => {
      card.addEventListener("click", () => {
        const servico = card.dataset.service
          || card.querySelector(".service-card__title")?.textContent?.trim()
          || "";
        openModal(servico);
      });
    });

    modal?.addEventListener("click", (e) => {
      if (e.target === modal || e.target.matches("[data-close-modal]")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });

    inputs.telefone?.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, CONFIG.phoneLength);
    });
    inputs.metragem?.addEventListener("input", (e) => {
      const v = Number(e.target.value);
      if (!Number.isFinite(v)) return;
      if (v < CONFIG.metragem.min) e.target.value = CONFIG.metragem.min;
      if (v > CONFIG.metragem.max) e.target.value = CONFIG.metragem.max;
    });

    form?.addEventListener("submit", submitForm);
  };

  const init = () => {
    populateBairros();
    bindEvents();
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/* =========================================================
   Contact — Lead form (Figma 102:1408: Default / Error / Sending / Failed)
   Форма ничего не отправляет:
   submit → проверка → Error  или  Sending 1,5 с → thank-you.html.
   Демо «не отправлено»: #fail в адресе → Form alert + «Try again».
   ========================================================= */

const leadForm = document.querySelector('[data-lead-form]');

if (leadForm) {
  const submitBtn = leadForm.querySelector('[data-lead-submit]');
  const submitLabel = leadForm.querySelector('[data-lead-label]');
  const alertBox = leadForm.querySelector('[data-form-alert]');
  const consent = leadForm.querySelector('[data-consent]');
  const consentInput = consent.querySelector('input');
  const companyInput = leadForm.elements.company;
  const emailInput = leadForm.elements.email;

  const SENDING_TIME = 1500;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, hasError) {
    const field = input.closest('[data-field]');
    const error = field.querySelector('.field__error');
    field.classList.toggle('is-error', hasError);
    error.hidden = !hasError;
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function setConsentError(hasError) {
    consent.classList.toggle('is-error', hasError);
    consentInput.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function validate() {
    const companyError = companyInput.value.trim() === '';
    const emailError = !emailPattern.test(emailInput.value.trim());
    const consentError = !consentInput.checked;

    setFieldError(companyInput, companyError);
    setFieldError(emailInput, emailError);
    setConsentError(consentError);

    // Фокус на первое поле с ошибкой
    const firstInvalid = [
      companyError && companyInput,
      emailError && emailInput,
      consentError && consentInput,
    ].find(Boolean);

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function setSending(isSending) {
    submitBtn.classList.toggle('is-loading', isSending);
    submitBtn.setAttribute('aria-busy', isSending ? 'true' : 'false');
  }

  function showFailed() {
    alertBox.hidden = false;
    submitLabel.textContent = 'Try again';
  }

  leadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (submitBtn.classList.contains('is-loading')) return;

    alertBox.hidden = true;
    if (!validate()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      if (window.location.hash === '#fail') {
        showFailed();
      } else {
        window.location.href = leadForm.getAttribute('action');
      }
    }, SENDING_TIME);
  });

  // Ошибка снимается, как только поле исправлено
  companyInput.addEventListener('input', () => {
    if (companyInput.value.trim() !== '') setFieldError(companyInput, false);
  });

  emailInput.addEventListener('input', () => {
    if (emailPattern.test(emailInput.value.trim())) setFieldError(emailInput, false);
  });

  consentInput.addEventListener('change', () => {
    if (consentInput.checked) setConsentError(false);
  });
}

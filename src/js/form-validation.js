const form = document.querySelectorAll('form');

for (var i = 0; i <form.length; i++) {
  form[i].setAttribute('novalidate', true);
};

const hasError = function (field) {
  if (field.type === 'submit') return;

  const validity = field.validity;

  if (validity.valid) return;
  if (validity.valueMissing) return 'Please fill out this field.';
  if (validity.typeMismatch) return 'Please enter an email address.';
  if (validity.patternMismatch) {
    if (field.hasAttribute('title')) return field.getAttribute('title');

    return 'Please match the requested format.';
};
  return 'The value you entered for this field is invalid.';
};

const showError = function (field, error) {
  field.classList.add('error');

  const id = field.id || field.name;
  if (!id) return;

  var message = field.form.querySelector('.error-message#error-for-' + id );
  if (!message) {
      message = document.createElement('div');
      message.className = 'error-message';
      message.id = 'error-for-' + id;
      field.parentNode.insertBefore( message, field.nextSibling );
  }
  
  field.setAttribute('aria-describedby', 'error-for-' + id);

  message.innerHTML = error;

  message.style.display = 'block';
  message.style.visibility = 'visible';
};

const removeError = function (field) {
  field.classList.remove('error');

  field.removeAttribute('aria-describedby');

  const id = field.id || field.name;
  if (!id) return;

  const message = field.form.querySelector('.error-message#error-for-' + id + '');
  if (!message) return;

  message.innerHTML = '';
  message.style.display = 'none';
  message.style.visibility = 'hidden';
};

document.addEventListener('blur', function (event) {
  if (!event.target.form) return;

  const error = hasError(event.target);

  if (error) {
    showError(event.target, error);
    return;
  }

  removeError(event.target);

}, true);

document.addEventListener('submit', function (event) {
  if (!event.target.classList.contains('validate')) return;

  var fields = event.target.elements;

  var error, hasErrors;
  for (var i = 0; i < fields.length; i++) {
      error = hasError(fields[i]);
      if (error) {
          showError(fields[i], error);
          if (!hasErrors) {
              hasErrors = fields[i];
          }
      }
  }

  if (hasErrors) {
      event.preventDefault();
      hasErrors.focus();
  }

}, false);
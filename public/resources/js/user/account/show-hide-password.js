const passwordCheckbox = document.getElementById('show-password');
const passwordField = document.getElementById('password');
passwordCheckbox.addEventListener('click', () => {
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    passwordCheckbox.checked = true;
  } else {
    passwordField.type = 'password';
    passwordCheckbox.checked = false;
  }
});

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const formData = new FormData(registerForm);
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const dto = {
    username: username,
    email: email,
    password: password,
  };
  fetch('/api/users/register', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  })
    .then(async (response) => {
      if (!response.ok) {
        const data = await response.json();
        window.alert(
          `Ошибка: ${Array.isArray(data.message) ? data.message.join('\n') : data.message}`,
        );
      } else {
        window.location.href = `/login`;
      }
    })
    .catch((error) => {
      window.alert(`Ошибка: ${error.message}`);
    });
});

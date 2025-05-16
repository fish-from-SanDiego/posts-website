const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const formData = new FormData(loginForm);
  const emailOrUsername = formData.get('username');
  const password = formData.get('password');
  const dto = {
    emailOrUsername: emailOrUsername,
    password: password,
  };
  fetch('/api/users/login', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        window.alert(
          `Ошибка: ${Array.isArray(data.message) ? data.message.join('\n') : data.message}`,
        );
      } else {
        window.location.href = `/users/${data.id}`;
      }
    })
    .catch((error) => {
      window.alert(`Ошибка: ${error.message}`);
    });
});

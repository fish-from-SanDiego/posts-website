function formatDateTime(value) {
  const date = new Date(value);
  const pad = (n) => n.toString().padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export function createCommentElement(comment) {
  const commentElement = document.createElement('div');
  commentElement.classList.add('comments__column');
  const hrElement = document.createElement('hr');
  hrElement.classList.add('comments__hr');

  const profilePic = document.createElement('div');
  profilePic.classList.add('comment__avatar');
  profilePic.style.backgroundImage = comment.author?.pictureUrl
    ? `url(${comment.author.pictureUrl})`
    : '';
  if (!comment.author?.pictureUrl)
    profilePic.style.backgroundColor = 'darkgray';
  profilePic.style.width = '60px';
  profilePic.style.height = '60px';
  profilePic.style.borderRadius = '50%';
  profilePic.style.backgroundSize = 'contain';


  const username = document.createElement('a');
  username.classList.add('comments_comment-author');
  if (comment.author) {
    username.href = `/users/${comment.author.id}`;
    username.textContent = comment.author.username;
  } else {
    username.textContent = '[удалён]';
    username.style.color = 'gray';
  }
  const createdAt = document.createElement('span');
  createdAt.classList.add('comment__dates');
  createdAt.textContent = formatDateTime(comment.createdAt);

  const text = document.createElement('pre');
  text.classList.add('comments_comment-body');
  text.textContent = comment.content;

  const userInfo = document.createElement('div');
  userInfo.classList.add('comments__row');
  userInfo.appendChild(profilePic);
  userInfo.appendChild(username);
  userInfo.appendChild(createdAt);

  commentElement.appendChild(userInfo);
  commentElement.appendChild(text);
  // commentElement.appendChild(createdAt);
  const rolesSet = window.modelData.rolesSet ?? new Set();
  if (
    (comment.author != null &&
      comment.author.id === window.modelData.currentUser?.id) ||
    rolesSet.has('admin') ||
    rolesSet.has('moderator')
  ) {
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.classList.add('comments__delete_button');
    delBtn.onclick = async () => {
      await fetch(`/comments/${comment.id}`, { method: 'DELETE' });
    };
    commentElement.appendChild(delBtn);
  }
  commentElement.appendChild(hrElement);

  return commentElement;
}

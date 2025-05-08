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
  profilePic.style.width = '50px';
  profilePic.style.height = '50px';
  profilePic.style.borderRadius = '50%';

  const username = document.createElement('a');
  username.classList.add('comments_comment-author');
  if (comment.author) {
    username.href = `/users/${comment.author.id}`;
    username.textContent = comment.author.username;
  } else {
    username.textContent = '[удалён]';
    username.style.color = 'gray';
  }

  const text = document.createElement('p');
  text.classList.add('comments_comment-body');
  text.textContent = comment.content;

  const userInfo = document.createElement('div');
  userInfo.classList.add('comments__row');
  userInfo.appendChild(profilePic);
  userInfo.appendChild(username);

  commentElement.appendChild(userInfo);
  commentElement.appendChild(text);

  if (comment.author != null && comment.author.id === loggedId) {
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

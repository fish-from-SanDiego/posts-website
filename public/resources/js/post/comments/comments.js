import { createCommentElement } from './create_comment.js';

const postId = Number(window.modelData.post.id);
const commentMap = new Map();
const commentStack = [];
let latestId = null;

const loader = document.getElementById('post-comments-loader');
const container = document.getElementById('comments-list');
const warning = document.getElementById('post-comments-warning');
const moreBtn = document.getElementById('load-more-comments');

function addComments(comments) {
  for (const c of comments) {
    if (!commentMap.has(c.id)) {
      const el = createCommentElement(c);
      container.appendChild(el);
      commentMap.set(c.id, el);
      commentStack.push(c.id);
      if (!latestId || c.id > latestId) latestId = c.id;
    }
  }
}

async function fetchInitialComments() {
  const res = await fetch(`/posts/${postId}/comments`);
  const json = await res.json();
  if (json.cursorValid) {
    if (json.data.length === 0) {
      moreBtn.classList.add('hidden');
    }
    loader.classList.add('hidden');
    document.getElementById('comments-form')?.classList.remove('hidden');
    if (json.data.length !== 0) {
      addComments(json.data);
      container.classList.remove('hidden');
      moreBtn.classList.remove('hidden');
    }
  } else {
    loader.classList.add('hidden');
    warning.classList.remove('hidden');
    moreBtn.classList.add('hidden');
  }
}

async function fetchMoreComments() {
  try {
    while (commentStack.length > 0) {
      const id = commentStack[commentStack.length - 1];
      const res = await fetch(`/posts/${postId}/comments?cursorId=${id}`);
      const json = await res.json();
      if (!json.cursorValid) {
        commentStack.pop();
        continue;
      }
      if (json.data.length === 0) {
        moreBtn.classList.add('hidden');
      } else {
        addComments(json.data);
        container.classList.remove('hidden');
        loader.classList.add('hidden');
      }
      if (json.pageSize > json.data.length) moreBtn.classList.add('hidden');
      break;
    }
  } catch (e) {
    document.getElementById('comments-warning').classList.remove('hidden');
    document.getElementById('load-more-comments').classList.add('hidden');
  }
  // if (commentStack.length === 0) moreBtn.style.display = 'none';
}

function setupSSE() {
  const newEvt = new EventSource(`/posts/${postId}/comments/sse/new`);
  newEvt.onmessage = ({ event, data }) => {
    const eData = JSON.parse(data);
    const c = eData.comment;
    if (!commentMap.has(c.id) && (!latestId || c.id > latestId)) {
      const el = createCommentElement(c);
      container.insertBefore(el, container.firstChild);
      commentMap.set(c.id, el);
      container.classList.remove('hidden');
      if (!latestId || c.id > latestId) latestId = c.id;
    }
  };

  const delEvt = new EventSource(`/posts/${postId}/comments/sse/deleted`);
  delEvt.onmessage = ({ event, data }) => {
    const eData = JSON.parse(data);
    const el = commentMap.get(eData.commentId);
    if (el) el.remove();
    commentMap.delete(eData.commentId);
  };
  window.addEventListener('beforeunload', () => {
    newEvt.close();
    delEvt.close();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchInitialComments();
  setupSSE();
  moreBtn.onclick = fetchMoreComments;
});

document
  .getElementById('comments-form')
  ?.addEventListener('submit', async function (event) {
    event.preventDefault();

    const authorId = loggedId;
    const content = document.getElementById('comment-content').value;

    const data = {
      content: content.trim(),
      authorId: authorId,
      postId: postId,
    };

    try {
      const response = await fetch(`/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        document.getElementById('comments-form').reset();
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      console.log('Error:', error);
      console.log('Error occurred');
    }
  });

document.addEventListener('DOMContentLoaded', function () {
  const textarea = document.getElementById('comment-content');
  const button = document.getElementById('submit-comment');

  const toggleButtonState = () => {
    button.disabled = textarea.value.trim() === '';
  };

  toggleButtonState();

  textarea.addEventListener('input', toggleButtonState);
  document
    .getElementById('submit-comment')
    ?.addEventListener('click', toggleButtonState);
});

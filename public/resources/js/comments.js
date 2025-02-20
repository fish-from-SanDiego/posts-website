import {getRandomRange} from "./random_utilities.js";
import {fetchJsonData} from "./fetch_utilities.js";

window.addEventListener('load', () => {
    const commentsUrl = "https://jsonplaceholder.typicode.com/comments";
    fetchJsonData(commentsUrl)
        .then((jsonData) => {
            renderComments(jsonData, getRandomRange(1, 501));
        })
        .catch(_ => {
            showWarning();
        });
});


function renderComments(jsonData, range) {
    const loaderElement = document.getElementById('post-comments-loader');
    const commentsElement = document.getElementById('post-comments');
    commentsElement.innerHTML = `<h2 class="comments__title">Комментарии (с ${range.lower} по ${range.upper - 1})</h2>`;
    jsonData.filter(comment => comment.id != null && comment.id >= range.lower && comment.id < range.upper)
        .forEach(comment => {
            if (comment.body == null || comment.name == null)
                return;
            const hrElement = document.createElement('hr');
            hrElement.classList.add('comments__hr');
            const commentElement = document.createElement('div');
            commentElement.classList.add('comments__comment');
            commentElement.innerHTML =
                `<p class="comments_comment-author">${comment.name}</p>
                 <p class="comments_comment-email">${comment.email ?? 'нет почты'}</p>
                 <p class="comments_comment-body">${comment.body}</p>`;
            commentsElement.appendChild(hrElement);
            commentsElement.appendChild(commentElement);
        });
    loaderElement.classList.add('vertical-container__item--hidden');
    commentsElement.classList.remove('vertical-container__item--hidden');
}

function showWarning() {
    const loaderElement = document.getElementById('post-comments-loader');
    const warningElement = document.getElementById('post-comments-warning');
    loaderElement.classList.add('vertical-container__item--hidden');
    warningElement.classList.remove('vertical-container__item--hidden');

}
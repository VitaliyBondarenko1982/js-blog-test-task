'use strict';

// eslint-disable-next-line max-len
const API_KEY = `?&show-fields=all&api-key=b41e2e26-a0d2-488d-8155-855ade5f1227`;
const HOST = `https://content.guardianapis.com/`;
const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');
const API_URL = `${HOST}${articleId}${API_KEY}`;

const getData = async(url) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const articlePage = document.querySelector('#article');

const showArticle = async() => {
  const result = await getData(API_URL);
  const article = result.response.content;

  const articleContent = document.createElement('div');
  const articleImage = document.createElement('img');
  const articleSection = document.createElement('span');
  const articleTitle = document.createElement('h2');
  const articleWrapper = document.createElement('div');
  const articleAuthor = document.createElement('p');
  const articleDate = document.createElement('p');
  const articleBody = document.createElement('p');

  createBox(articleContent, 'article__content', articlePage);
  createBox(articleImage, 'article__image', articleContent);
  createBox(articleSection, 'article__section', articleContent);
  createBox(articleTitle, 'article__title', articleContent);
  createBox(articleWrapper, 'article__wrapper', articleContent);
  createBox(articleAuthor, 'article__author', articleWrapper);
  createBox(articleDate, 'article__date', articleWrapper);
  createBox(articleBody, 'article__body', articleContent);
  articleImage.setAttribute('src', article.fields.thumbnail);
  articleSection.innerHTML = article.sectionName;
  articleTitle.innerHTML = article.fields.headline;
  articleAuthor.innerHTML = article.fields.byline;
  articleDate.innerHTML = article.webPublicationDate.slice(0, 10);
  articleBody.innerHTML = article.fields.bodyText;
};

function createBox(newElement, className, parentElement) {
  if (!parentElement) {
    return;
  }

  newElement.classList.add(className);
  parentElement.appendChild(newElement);
}

showArticle();

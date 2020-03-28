
'use strict';

/* eslint-disable max-len */
const NEWS_URL = `http://content.guardianapis.com/search?from-date=2020-03-27&to-date=2020-03-28&order-by=newest&show-fields=all&page-size=90&api-key=b41e2e26-a0d2-488d-8155-855ade5f1227`;

const getNews = () => {
  const news = fetch(NEWS_URL)
    .then(response => response.json());

  return news;
};

const newsList = document.querySelector('#news');
const pagination = document.querySelector('#pagination');
const mainTitle = document.querySelector('.title');
const articlePage = document.querySelector('#article');

const showNews = async() => {
  const result = await getNews();
  const news = result.response.results;

  const notesOnPage = 9;
  const countOfItems = Math.ceil(news.length / notesOnPage);

  const showPage = (function() {
    let active;

    return function(item) {
      if (active) {
        active.classList.remove('pagination__item--active');
      }

      active = item;

      item.classList.add('pagination__item--active');

      const pageNum = +item.innerHTML;
      const start = (pageNum - 1) * notesOnPage;
      const end = start + notesOnPage;
      const articles = news.slice(start, end);

      newsList.innerHTML = '';

      for (const article of articles) {
        const newsItem = document.createElement('li');
        const fullNewsLink = document.createElement('a');
        const image = document.createElement('img');
        const sectionName = document.createElement('span');
        const title = document.createElement('a');
        const text = document.createElement('p');
        const author = document.createElement('p');

        createBox(newsItem, 'news__item', newsList);
        createBox(fullNewsLink, 'news__link-article', newsItem);
        createBox(image, 'news__image', fullNewsLink);
        createBox(sectionName, 'news__section-name', newsItem);
        createBox(title, 'news__link', newsItem);
        createBox(text, 'news__text', newsItem);
        createBox(author, 'news__author', newsItem);

        sectionName.innerHTML = article.sectionName;
        text.innerHTML = article.fields.trailText;
        title.innerHTML = article.fields.headline;
        author.innerHTML = article.fields.byline;
        fullNewsLink.setAttribute('href', '/article.html');
        image.setAttribute('alt', article.apiUrl);
        title.setAttribute('href', article.webUrl);
        image.setAttribute('src', article.fields.thumbnail);
      }
    };
  }());

  const paginationItems = [];

  for (let i = 1; i <= countOfItems; i++) {
    if (!pagination) {
      return;
    };

    const li = document.createElement('li');

    li.classList.add('pagination__item');
    li.innerHTML = i;
    pagination.appendChild(li);
    paginationItems.push(li);
  }

  showPage(paginationItems[0]);

  for (const paginationItem of paginationItems) {
    paginationItem.addEventListener('click', function() {
      showPage(this);
    });
  }

  newsList.addEventListener('click', function(evt) {
    evt.preventDefault();

    history.pushState({ index: 'article' }, 'Title', '/article.html');

    const { alt } = evt.target;

    newsList.innerHTML = '';
    pagination.innerHTML = '';
    mainTitle.innerHTML = '';

    const article = news.find(item => item.apiUrl === alt);

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
  });
};

function createBox(newElement, className, parentElement) {
  if (!parentElement) {
    return;
  }

  newElement.classList.add(className);
  parentElement.appendChild(newElement);
}

showNews();

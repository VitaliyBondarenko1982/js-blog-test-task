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
        fullNewsLink.setAttribute('href', `article.html/id=${article.id}`);
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

  newsList.addEventListener('click', async function(evt) {
    evt.preventDefault();

    const { alt } = evt.target;

    const article = news.find(item => item.apiUrl === alt);

    location.assign(`${window.location}article.html?id=${article.id}`);
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

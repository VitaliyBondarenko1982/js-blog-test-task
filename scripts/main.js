'use strict';

// eslint-disable-next-line max-len
const NEWS_URL = `http://content.guardianapis.com/search?from-date=2020-03-28&to-date=2020-03-28&order-by=newest&show-fields=all&page-size=90&api-key=b41e2e26-a0d2-488d-8155-855ade5f1227`;

const getNews = async(url) => {
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const newsList = document.querySelector('#news');
const pagination = document.querySelector('#pagination');

const showNews = async() => {
  const result = await getNews(NEWS_URL);
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
        const title = document.createElement('p');
        const text = document.createElement('p');
        const author = document.createElement('p');

        createBox(newsItem, 'news__item', newsList);
        createBox(fullNewsLink, 'news__link', newsItem);
        createBox(image, 'news__image', fullNewsLink);
        createBox(sectionName, 'news__section-name', fullNewsLink);
        createBox(title, 'news__title', fullNewsLink);
        createBox(text, 'news__text', fullNewsLink);
        createBox(author, 'news__author', fullNewsLink);

        sectionName.innerHTML = article.sectionName;
        text.innerHTML = article.fields.trailText;
        title.innerHTML = article.fields.headline;
        author.innerHTML = article.fields.byline;

        fullNewsLink.setAttribute('href', article.webUrl);
        image.setAttribute('alt', article.apiUrl);
        image.setAttribute('src', article.fields.thumbnail);
      }
    };
  }());

  const prevButton = document.createElement('button');
  const nextButton = document.createElement('button');
  const paginationList = document.createElement('ul');

  createBox(prevButton, 'button', pagination);
  createBox(paginationList, 'pagination__list', pagination);
  prevButton.textContent = 'prev';
  prevButton.setAttribute('type', 'button');

  const paginationItems = [];

  for (let i = 1; i <= countOfItems; i++) {
    if (!pagination) {
      return;
    };

    const li = document.createElement('li');

    createBox(li, 'pagination__item', paginationList);
    li.innerHTML = i;
    paginationItems.push(li);
  }

  createBox(nextButton, 'button', pagination);
  nextButton.setAttribute('type', 'button');
  nextButton.textContent = 'next';

  let currentPage = 1;

  showPage(paginationItems[currentPage - 1]);

  paginationList.addEventListener('click', function(evt) {
    if (evt.target.tagName !== 'LI') {
      return;
    }

    const { textContent } = evt.target;

    currentPage = textContent;

    if (currentPage === 1) {
      setButtonDisable(prevButton);
    }

    if (currentPage === paginationItems.length) {
      setButtonDisable(nextButton);
    };

    if (currentPage > 1) {
      setButtonActive(prevButton);
    }

    if (currentPage < paginationItems.length) {
      setButtonActive(nextButton);
    }

    showPage(paginationItems[currentPage - 1]);
  });

  if (currentPage === 1) {
    prevButton.setAttribute('disabled', 'disabled');
    prevButton.classList.add('button--disabled');
  }

  prevButton.addEventListener('click', () => {
    if (currentPage === 1) {
      return;
    }

    currentPage--;

    if (currentPage === 1) {
      setButtonDisable(prevButton);
    }

    if (currentPage < paginationItems.length) {
      setButtonActive(nextButton);
    }

    showPage(paginationItems[currentPage - 1]);
  });

  nextButton.addEventListener('click', () => {
    if (currentPage === paginationItems.length) {
      return;
    }

    currentPage++;

    if (currentPage === paginationItems.length) {
      setButtonDisable(nextButton);
    };

    if (currentPage > 1) {
      setButtonActive(prevButton);
    }

    showPage(paginationItems[currentPage - 1]);
  });

  newsList.addEventListener('click', function(evt) {
    evt.preventDefault();

    if (evt.target.tagName === 'UL') {
      return;
    }

    const targetItem = evt.target.closest('.news__link');
    const href = targetItem.getAttribute('href');
    const article = news.find(item => item.webUrl === href);

    location.assign(`${window.location}article.html?id=${article.id}`);
  });
};

function setButtonDisable(button) {
  button.setAttribute('disabled', 'disabled');
  button.classList.add('button--disabled');
};

function setButtonActive(button) {
  button.removeAttribute('disabled');
  button.classList.remove('button--disabled');
};

function createBox(newElement, className, parentElement) {
  if (!parentElement) {
    return;
  }

  newElement.classList.add(className);
  parentElement.appendChild(newElement);
}

showNews();

(function () {
  'use strict';

  /*
   * Функціонал сторінки:
   * 1. Зберігаємо початкові налаштування, масив постів та знаходимо потрібні HTML-елементи.
   * 2. Перетворюємо дати з полів і масиву постів у формат, зручний для порівняння.
   * 3. Фільтруємо пости за вибраними датами та обмежуємо їх кількість для кнопки Load more.
   * 4. Формуємо HTML карток. Для плитки використовуємо велике зображення, для списку - smallImage.
   * 5. Перемальовуємо список після зміни дат, перемикання вигляду або натискання Load more.
   * 6. Підключаємо flatpickr, обробники відкриття календаря та очищення полів.
   * 7. Після завантаження файлу ініціалізуємо календарі й виконуємо перше відображення постів.
   */

  const POSTS_STEP = 8;
  let currentView = 'grid';
  let visibleCount = POSTS_STEP;
  let filterFrom = null;
  let filterTo = null;

  const posts = [
    {
      id: 1,
      image: './assets/images/monblan_project__post_img1.png',
      smallImage: './assets/images/monblan_project__post_img1small.png',
      alt: 'Dramatic sunset clouds',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 2,
      image: './assets/images/monblan_project__post_img2.png',
      smallImage: './assets/images/monblan_project__post_img2small.png',
      alt: 'Boats on turquoise water',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 3,
      image: './assets/images/monblan_project__post_img3.png',
      smallImage: './assets/images/monblan_project__post_img3small.png',
      alt: 'Soft pastel sea horizon',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 4,
      image: './assets/images/monblan_project__post_img1.png',
      smallImage: './assets/images/monblan_project__post_img4small.png',
      alt: 'Dark portrait in shadow',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 5,
      image: './assets/images/monblan_project__post_img5.png',
      smallImage: './assets/images/monblan_project__post_img5small.png',
      alt: 'Modern building facade',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 6,
      image: './assets/images/monblan_project__post_img6.png',
      smallImage: './assets/images/monblan_project__post_img6small.png',
      alt: 'Warm interior with fireplace',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 7,
      image: './assets/images/monblan_project__post_img7.png',
      smallImage: './assets/images/monblan_project__post_img7small.png',
      alt: 'Woman standing outdoors',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 8,
      image: './assets/images/monblan_project__post_img8.png',
      smallImage: './assets/images/monblan_project__post_img8small.png',
      alt: 'Forest bride photo',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
    {
      id: 9,
      image: './assets/images/monblan_project__post_img1.png',
      smallImage: './assets/images/monblan_project__post_img9small.png',
      alt: 'Dramatic sunset clouds',
      postDate: '2016-08-09',
      todayLikes: 128,
      todayComments: 31,
      totalLikes: 67,
      totalComments: 22,
      uploadDate: '2016-04-11'
    },
  ];

  const postsList = document.querySelector('#postsList');
  const loadMoreButton = document.querySelector('#loadMore');
  const dateFilter = document.querySelector('.monblan__date-filter');
  const viewButtons = document.querySelectorAll('[data-view]');
  const dateInputs = document.querySelectorAll('.monblan__datepicker');
  const dateFromInput = document.querySelector('#dateFrom');
  const dateToInput = document.querySelector('#dateTo');
  const openDatepickerButtons = document.querySelectorAll('[data-open]');
  const clearDatepickerButtons = document.querySelectorAll('[data-clear]');

  const icons = {
    heart:
      '<svg class="monblan__post-card-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    comment:
      '<svg class="monblan__post-card-icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M21 6.5C21 4.57 19.43 3 17.5 3h-11C4.57 3 3 4.57 3 6.5v7C3 15.43 4.57 17 6.5 17H15l5 4v-4.35c.62-.43 1-1.15 1-1.92V6.5z"/></svg>'
  };

  // Перетворює дату з поля календаря з формату DD_MM_YYYY на об'єкт Date.
  function parseDate(value) {
    if (!value) return null;

    const normalized = value.replace(/_/g, '-');
    const parts = normalized.split('-');

    if (parts.length !== 3) return null;

    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);

    if (!day || month < 0 || !year) return null;

    return new Date(year, month, day);
  }

  // Перетворює дату поста з формату YYYY-MM-DD на об'єкт Date.
  function parseISODate(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Форматує дату поста для відображення у картці у вигляді D-MM-YYYY.
  function formatDate(value) {
    const [year, month, day] = value.split('-');
    return `${Number(day)}-${month}-${year}`;
  }

  // Повертає лише ті пости, дата яких відповідає вибраним значенням фільтра.
  function getFilteredPosts() {
    return posts.filter((post) => {
      const postDate = parseISODate(post.postDate);

      return (!filterFrom || postDate >= filterFrom) && (!filterTo || postDate >= filterTo);
    });
  }

  // Створює HTML для однієї метрики: іконки та кількості лайків або коментарів.
  function metricTemplate(icon, value) {
    return `<span class="monblan__post-card-metric">${icon}${value}</span>`;
  }

  // Створює HTML картки поста та вибирає потрібний розмір зображення для поточного вигляду.
  function postTemplate(post) {
    const isListView = currentView === 'list';
    const image = isListView ? post.smallImage : post.image;
    const imageSize = isListView ? 86 : 203;

    return `
      <article class="monblan__post-card">
        <img class="monblan__post-card-image" src="${image}" alt="${post.alt}" loading="lazy" width="${imageSize}" height="${imageSize}">

        <div class="monblan__post-card-content">
          <div class="monblan__post-card-stats">
            <strong class="monblan__post-card-title">Today</strong>
            <div class="monblan__post-card-metrics">
              ${metricTemplate(icons.heart, post.todayLikes)}
              ${metricTemplate(icons.comment, post.todayComments)}
            </div>
          </div>

          <div class="monblan__post-card-stats">
            <strong class="monblan__post-card-title">${formatDate(post.postDate)}</strong>
            <div class="monblan__post-card-metrics">
              ${metricTemplate(icons.heart, post.totalLikes)}
              ${metricTemplate(icons.comment, post.totalComments)}
            </div>
          </div>

          <div class="monblan__post-card-upload">
            <strong class="monblan__post-card-upload-title">Image upload</strong>
            <span class="monblan__post-card-upload-date">${formatDate(post.uploadDate)}</span>
          </div>
        </div>
      </article>
    `;
  }

  // Відображає пости, повідомлення про порожній результат і стан кнопки Load more.
  function renderPosts() {
    const filteredPosts = getFilteredPosts();
    const visiblePosts = filteredPosts.slice(0, visibleCount);

    postsList.className = `monblan__posts-list monblan__posts-list--${currentView}`;

    postsList.innerHTML = visiblePosts.length
      ? visiblePosts.map(postTemplate).join('')
      : '<p class="monblan__empty-state">Posts not found</p>';

    loadMoreButton.classList.toggle('monblan__is-hidden', visibleCount >= filteredPosts.length);
  }

  // Оновлює значення фільтрів із полів, скидає пагінацію та перемальовує список.
  function updateFilters() {
    filterFrom = parseDate(dateFromInput.value);
    filterTo = parseDate(dateToInput.value);
    visibleCount = POSTS_STEP;
    renderPosts();
  }

  // Перемикає вигляд між плиткою і списком та оновлює активну кнопку.
  function updateView(view) {
    currentView = view;

    viewButtons.forEach((button) => {
      const isActive = button.dataset.view === view;
      button.classList.toggle('monblan__is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    renderPosts();
  }

  // Підключає календарі flatpickr і обробники кнопок відкриття та очищення полів.
  function initDatepickers() {
    if (typeof flatpickr !== 'function') return;

    const instances = {};

    dateInputs.forEach((input) => {
      instances[input.id] = flatpickr(input, {
        dateFormat: 'd_m_Y',
        allowInput: true,
        disableMobile: true,
        onChange: updateFilters
      });
    });

    openDatepickerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const inputId = button.dataset.open;
        instances[inputId]?.open();
      });
    });

    clearDatepickerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const inputId = button.dataset.clear;
        instances[inputId]?.clear(false);

        updateFilters();
      });
    });
  }

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => updateView(button.dataset.view));
  });

  dateFilter.addEventListener('submit', (event) => {
    event.preventDefault();
    updateFilters();
  });

  loadMoreButton.addEventListener('click', () => {
    visibleCount += POSTS_STEP;
    renderPosts();
  });

  initDatepickers();
  updateFilters();
})();

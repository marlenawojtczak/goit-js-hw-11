import { getData } from './getData';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const submitBtn = document.querySelector('.button-submit');
const searchInput = document.querySelector('[name=searchQuery]');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.button-load');

let currentPage = 1;
let currentSearchValue = '';

const showGallery = async () => {
  gallery.innerHTML = '';
  const searchValue = searchInput.value;
  currentSearchValue = searchValue;
  const data = await getData(searchValue);

  gallery.innerHTML = data.hits
    .map(
      result => `
    <div class="gallery__card">
      <a href="${result.largeImageURL}">
        <img class="gallery__image" src="${result.webformatURL}" alt="${result.tags}" loading="lazy" />
      </a>
      <div class="gallery__info">
        <p class="gallery__info-item">
          <b>Likes</b>
          ${result.likes}
        </p>
        <p class="gallery__info-item">
          <b>Views</b>
          ${result.views}
        </p>
        <p class="gallery__info-item">
          <b>Comments</b>
          ${result.comments}
        </p>
        <p class="gallery__info-item">
          <b>Downloads</b>
          ${result.downloads}
        </p>
      </div>
    </div>`
    )
    .join('');

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  lightbox.refresh();

  if (data.totalHits > 0) {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (data.totalHits > 40) {
    loadBtn.classList.remove('is-hidden');
  }
};

const showNextPage = async () => {
  currentPage++;

  const data = await getData(currentSearchValue, currentPage);

  gallery.insertAdjacentHTML(
    'beforeend',
    data.hits
      .map(
        result => `
    <div class="gallery__card">
      <a href="${result.largeImageURL}">
        <img class="gallery__image" src="${result.webformatURL}" alt="${result.tags}" loading="lazy" />
      </a>
      <div class="gallery__info">
        <p class="gallery__info-item">
          <b>Likes</b>
          ${result.likes}
        </p>
        <p class="gallery__info-item">
          <b>Views</b>
          ${result.views}
        </p>
        <p class="gallery__info-item">
          <b>Comments</b>
          ${result.comments}
        </p>
        <p class="gallery__info-item">
          <b>Downloads</b>
          ${result.downloads}
        </p>
      </div>
    </div>`
      )
      .join('')
  );

  if (data.totalHits > currentPage * 40) {
    loadBtn.classList.remove('is-hidden');
  } else {
    loadBtn.classList.add('is-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  lightbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

submitBtn.addEventListener('click', async e => {
  e.preventDefault();
  await showGallery();
  searchInput.value = '';
});

loadBtn.addEventListener('click', async e => {
  e.preventDefault();
  await showNextPage();
});

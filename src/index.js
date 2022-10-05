import { getPictures } from './pictures.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/style.css';
const ref = {
  form: document.querySelector('#search-form'),
  moreBtn: document.querySelector('.load-more'),
  divContainer: document.querySelector('.gallery'),
};
const { form, moreBtn, divContainer } = ref;

form.addEventListener('submit', onFormSubmit);
moreBtn.addEventListener('click', appPage);

let page = 1;
let searchQuery = '';
let pageLength = 0;

function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.target.elements.searchQuery.value.toLowerCase();
  if (!searchQuery) {
    return Notify.failure("Sorry, you haven't entered anything");
  }
  clearCard();
  pageLength = 0;
  getPictures(searchQuery, page).then(makeMarkup);
}

function makeMarkup(data) {
  const arrImages = data.hits;
  const imgHits = data.totalHits;

  const markup = arrImages
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item--current">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  divContainer.insertAdjacentHTML('beforeend', markup);
  moreBtn.classList.remove('is-hidden');
  new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  if (arrImages.length === 0) {
    moreBtn.classList.add('is-hidden');
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pageLength += arrImages.length;
  if (imgHits <= pageLength) {
    moreBtn.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  if (page === 1) {
    return Notify.info(`Hooray! We found ${imgHits} images.`);
  }
}

function clearCard() {
  page = 1;
  divContainer.innerHTML = '';
  moreBtn.classList.add('is-hidden');
}

function appPage() {
  page += 1;
  getPictures(searchQuery, page).then(makeMarkup);
}

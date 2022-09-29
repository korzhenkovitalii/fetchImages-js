import { fetchImage } from './fetchImage';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

function renderGallery(array) {
  const markup = array
    .map(
      item =>
        `<div class="photo-card"><a href="${item.largeImageURL}"><img src="${item.webformatURL}" class="card" alt="${item.tags}" loading="lazy"/></a><div class="info"><div><p>Likes: </p><p>${item.likes}</p></div><div><p>Views: </p><p>${item.views}</p></div><div><p>Comments: </p><p>${item.comments}</p></div><div><p>Downloads: </p> <p>${item.downloads}</p></div></div></div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let page;
let per_page = 40;
let searchQuery = '';

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', clickLoadMoreBtn);

async function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value;
  page = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImage(searchQuery, page);
  console.log(response);

  //Условия появления кнопки 'Показать еще'
  refs.loadMoreBtn.classList.add('hidden');
  if (response.total > per_page) {
    refs.loadMoreBtn.classList.remove('hidden');
  }

  if (response.total > 0) {
    Notiflix.Notify.success(`Hooray! We found ${response.total} images.`);

    refs.gallery.innerHTML = '';
    renderGallery(response.hits);
    lightbox.refresh();
  } else {
    refs.gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function clickLoadMoreBtn() {
  page += 1;
  const response = await fetchImage(searchQuery, page);
  renderGallery(response.hits);
  lightbox.refresh();
  console.log(response.hits.length);
  if (response.hits.length < per_page) {
    refs.loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

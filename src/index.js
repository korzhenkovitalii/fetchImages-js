import { fetchImage } from './fetchImage';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

function renderGallery(array) {
  const markup = array
    .map(
      item => `<div class="photo-card">
        <img src="${item.webformatURL}" alt="item.tags" loading="lazy" />
        <div class="info">
          <p>
            <b>Likes: </b>${item.likes}
          </p>
          <p>
            <b>Views: </b>${item.views}
          </p>
          <p>
            <b>Comments: </b>${item.comments}
          </p>
          <p>
            <b>Downloads: </b>${item.downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let page = 1;
let searchQuery = '';
let hits = 0;

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', clickLoadMoreBtn);

async function onFormSubmit(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImage(searchQuery, page);
  console.log(response);
  if (response.total > 0) {
    refs.loadMoreBtn.classList.remove('hidden');
    Notiflix.Notify.success(`Hooray! We found ${response.total} images.`);

    refs.gallery.innerHTML = '';
    renderGallery(response.hits);
    lightbox.refresh();
  } else {
    refs.gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadMoreBtn.classList.add('hidden');
  }
}

async function clickLoadMoreBtn() {
  page += 1;
  const response = await fetchImage(searchQuery, page);
  renderGallery(response.hits);
  lightbox.refresh();
  hits += response.total;
  if (hits === response.total) {
    refs.loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

import axios from 'axios';

const URL = 'https://pixabay.com/api/';
async function fetchImage(searchQuery, page) {
  return await axios
    .get(
      `${URL}?key=30192145-bc6bde8f91b5db4561ffa14da&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(response => response.data);
}

export { fetchImage };
import axios from 'axios';

export async function getPictures(searchQuery, page) {
  const KEY = '30385441-4dc71e17a68e39215af6d5e3c';
  try {
    return await axios
      .get(
        `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
      )
      .then(response => {
        return response.data;
      });
  } catch (error) {
    console.error(error);
  }
}

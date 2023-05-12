import axios from 'axios';

export const getData = async (searchValue, page) => {
  const API_KEY = '35795176-8901e7fc6175cd339787320de';
  const API_URL = `https://pixabay.com/api/`;

  try {
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

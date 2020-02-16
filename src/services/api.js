import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `bearer ${'b24b9b8efc697b22b0d17c8baf2af8453cdb4534'}`,
  },
});

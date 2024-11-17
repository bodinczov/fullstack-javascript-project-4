import axios from 'axios';
import axiosDebug from 'axios-debug-log';

axiosDebug({
  request: (debug, config) => {
    debug(`Request with ${config.method.toUpperCase()} to ${config.url}`);
    return config;
  },
  response: (debug, response) => {
    debug(`Response from ${response.config.url} with status ${response.status}`);
    return response;
  },
  error: (debug, error) => {
    debug(`Error in request: ${error.message}`);
    return Promise.reject(error);
  },
});

export default axios;


export default class Request {
  static APIEndpointPrefix = '/api';

  static getCSRFToken = () => {
    const csrfToken = document.querySelector('body>input').value;
    if (csrfToken == null) {
      console.warn("Could not find CSRF token. Make sure the backend is providing this correctly.");
    }
    return csrfToken;
  }

  /**
   * Fetch get request wrapped in some logic that will include a CSRF token as authentication.
   * 
   * @param {string} endpoint The api endpoint to get
   * @param {string} endpointPrefix Defaults to '/api'. The prefix of the api endpoints
   * @param {boolean} useCSRFToken Whether or not to use CSRF tokens. This is turned on by default
   * @returns A response, if successful
   * @throws A response, if not successful
   */
  static get = async (endpoint, endpointPrefix = this.APIEndpointPrefix, useCSRFToken = true) => {
    const url = (endpointPrefix != null ? endpointPrefix : '') + endpoint;
    const response = await fetch(
      url,
      {
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(useCSRFToken && {'X-CSRFToken': Request.getCSRFToken()})
        }
      }
    );

    if (!response.ok) throw response;
    const body = response.json();
    return body;
  }

  /**
   * Fetch get request wrapped in some logic that will include a CSRF token as authentication.
   * 
   * @param {string} endpoint The api endpoint to get
   * @param {any} data The data to post. This will be JSON stringified before sending.
   * @param {string} endpointPrefix Defaults to '/api'. The prefix of the api endpoints
   * @param {boolean} useCSRFToken Whether or not to use CSRF tokens. This is turned on by default
   * @returns A response, if successful
   * @throws A response, if not successful
   */
  static post = async (endpoint, data, endpointPrefix = this.APIEndpointPrefix, useCSRFToken = true) => {
    const url = (endpointPrefix != null ? endpointPrefix : '') + endpoint;
    const response = await fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(useCSRFToken && {'X-CSRFToken': Request.getCSRFToken()})
        }
      }
    );

    if (!response.ok) throw response;
    const body = response.json();
    return body;
  }
}
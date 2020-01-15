/*
  Override the puppeteer Page object with a custom Proxy object
  with relevant custom methods
*/
const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

/**
 * CustomPage is a Proxy-d override of Page from puppeteer 
 *  API
 *    build - setup puppeteer page wrapped in this Proxy
 *    login - mock auth'd user session cookies
 *    getContentsOf - helper to extract innerHTML of param selector
 *    get - helper to GET data from API directly
 *    post - helper to POST data to API directly
 * 
 *    TODO:
 *    close - clean up - delete the test User
 */
class CustomPage {
  // static method allows to exec before instance available
  // this allows us to wrap the constructor and return Proxy
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    // ci workaround
    page.setBypassCSP = true
    const customPage = new CustomPage(page);

    // here we check each level of the Proxy for a given prop
    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  // stash ref to puppeteer page instance
  constructor(page) {
    this.page = page;
  }

  /*
    create a new User
    build session data
    add cookie data
    wait for sentinel to indicate logged in status
  */
  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  // helper wrapper to get innerHTML
  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  /* 
    GET data from API
      evaluate method must pass fetch as a function && 
      provide param(s) as args to in order they are in scope 
      after serialized & passed to puppeteer
  */
  get(path) {
    return this.page.evaluate(_path => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json());
    }, path);
  }

  /* 
    POST data to API
      evaluate method must pass fetch as a function && 
      provide param(s) as args to in order they are in scope 
      after serialized & passed to puppeteer
  */
  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(_data)
        }).then(res => res.json());
      },
      path,
      data
    );
  }

  // batch process requests using this.methods
  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
# @conjoon/extjs-app-localmailaccount - Tests - Read Me

This package uses [Siesta](http://bryntum.com) for Unit-/UI-testing.

### Configuration

tl;dr
```
npx create-siesta@latest
npm run test:siesta
```

Explanation:

Run
```
npx create-siesta
```
will install Siesta and the Sencha Ext JS Sources required for running the tests.

Please make a backup of your `./test` folder in case you accidentally let `create-siesta` override it.

Boilerplate-html files will be copied to the project (targets: `./tests.redirect.html` and `./tests/index.extjs-browser.html`).

After this was done, run
```
npm run test:siesta
```
which will start a lightweight local webserver on **127.0.0.1**/**localhost**. This will also try
automatically open your system's default web-browser and load the test main-page.

### Injecting test configuration with URL-params

#### Toolkit specific tests
* To run the tests with the classic toolkit, append the query string `toolkit=classic` (default)
* To run the tests with the modern toolkit, append the query string `toolkit=modern`

*Example-URL _(toolkit=modern)*
`http://127.0.0.1:8000/tests/index.html?toolkit=modern`


#### Timeouts of tests
When running a test project with simultaneous calls to DOM-operations and XmlHttpRequests, it is sometimes
necessary to extend the duration of tests and test-setups.
* To extend the TIMEOUT of ```waitForMs```-calls, use the url-parameter ```timeout```: `timeout=750`

  *Example-URL _(toolkit=classic with a timeout of 1000ms)*
  `http://127.0.0.1:8000/tests/index.html?toolkit=classic&timeout=1000`

# @conjoon/extjs-app-localmailaccount Documentation

**extjs-app-localmailaccount** is a **coon.js** package and is tagged as such in the
`package.json`:

```json
{
    "coon-js": {
        "package": {
            "autoLoad": {
                "registerController":  true
            },
            "config": "${package.resourcePath}/extjs-app-localmailaccount.conf.json"
        }
    }
}
```

By default, this package's configuration can be found in this package's `resources` folder
in a file named `extjs-app-localmailaccount.conf.json`.


## What goes into a `extjs-app-localmailaccount` configuration?

The package utilizes the Local Storage API for saving email account information locally. The following configuration
is required for this package:


```json
{
  "title": "Local Email Accounts",
  "interceptUri": "\\/MailAccounts\\/?[^\\/]*$",
  "ioc": {
    "bindings": {
      "conjoon.dev.cn_mailsim": {
        "conjoon.dev.cn_mailsim.data.SimletAdapter": "conjoon.localmailaccount.dev.BasicAuthSimletAdapter"
      },
      "conjoon.cn_mail": {
        "coon.core.data.request.Configurator": {
          "xclass": "conjoon.localmailaccount.data.request.Configurator",
          "singleton": true
        }
      }
    }
  }
}
```

- `title` - The title of the package. This is used for assembling navigation entries, or changing the
`document.title` of the browser instance the application runs in. This package notifies interested 
observers with this title whenever view of the package gets activated and gains the focus.

- `interceptUri` - The URI the package should intercept when reading/writing MailAccounts so commands are redirected to
this package's LocalStorage-API

- `ioc` - Bindings for the Inversion of Control-Container used with **extjs-app-localmailaccount**. 
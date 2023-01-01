/**
 * conjoon
 * extjs-app-localmailaccount
 * Copyright (C) 2022 Thorsten Suckow-Homberg https://github.com/conjoon/extjs-app-localmailaccount
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * PackageController to install simlet that intercepts requests to MailAccounts and redirects to
 * LocalStorage instead.
 */
Ext.define("conjoon.localmailaccount.app.PackageController", {

    extend: "coon.core.app.PackageController",

    requires: [
        // @define
        "l8",
        "conjoon.localmailaccount.data.MailAccountToLocalStorageSim",
        "Ext.ux.ajax.SimManager"
    ],


    init (app) {
        const
            me = this,
            config = app.getPackageConfig(me);

        Ext.ux.ajax.SimManager.register(
            Ext.create("conjoon.localmailaccount.data.MailAccountToLocalStorageSim", {
                url: new RegExp(config.interceptUri, "im"),
                delay: 1
            })
        );
    },


    preLaunchHook (app) {
        const me = this;
        let title = app.getPackageConfig(me, "title");
        title && Ext.fireEvent("conjoon.application.TitleAvailable", me, title);
        return true;
    }
});

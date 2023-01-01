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


Ext.define("conjoon.localmailaccount.data.MailAccountToLocalStorageSim", {

    extend: "Ext.ux.ajax.JsonSimlet",

    requires: [
        "conjoon.localmailaccount.data.MailAccountRepository"
    ],

    statics: {
        required: {
            mailAccountRepository: "conjoon.localmailaccount.data.MailAccountRepository"
        }
    },


    doGet (ctx) {
        const
            me = this,
            accounts = me.mailAccountRepository.queryAll(),
            ret = {};

        ret.status = 200;
        ret.responseText = JSON.stringify({
            data: accounts
        });

        Ext.Array.forEach(me.responseProps, function (prop) {
            if (prop in me) {
                ret[prop] = me[prop];
            }
        });

        return ret;
    },


    doPost (ctx) {

        const
            me = this,
            data = JSON.parse(ctx.xhr.body),
            created = me.mailAccountRepository.insert(data),
            ret = {};

        ret.status = 200;
        ret.responseText = JSON.stringify({
            data: {id: created.id}
        });
        return ret;
    },


    doPatch (ctx) {

        const
            me = this,
            data = JSON.parse(ctx.xhr.body),
            id = ctx.xhr.url.split("/").pop().split("?").shift(),
            updated = me.mailAccountRepository.update(id, data),
            ret = {};

        ret.status = updated ? 200 : 400;
        if (updated) {
            ret.responseText = JSON.stringify({data: updated});
        }

        return ret;
    }

});

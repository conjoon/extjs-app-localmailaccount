/**
 * conjoon
 * extjs-app-localmailuser
 * Copyright (C) 2022 Thorsten Suckow-Homberg https://github.com/conjoon/extjs-app-localmailuser
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
 *
 *
 */
Ext.define("conjoon.localmailuser.dev.BasicAuthSimletAdapter", {

    extend: "conjoon.dev.cn_mailsim.data.SimletAdapter",


    validateMailAccountId (mailAccountId) {
        return true;
    },


    validateRequest (xhr) {

        const
            me = this,
            headers = xhr.requestHeaders,
            authorization = headers ? headers.Authorization : null,
            mailData = headers ? headers["X-CNMAIL-DATA"] : null;

        if (!authorization) {
            return me.make401(xhr);
        }

        const method = authorization.split(" ");

        if (method[0] !== "Basic" || !method[1]) {
            return me.make401(xhr);
        }

        if (!mailData) {
            return me.make400(xhr);
        }

        return null;
    },


    make400 (xhr) {
        /* eslint-disable-next-line no-console*/
        console.log(" --- Bad Request ", 400, xhr);
        return {status: 400, success: false};
    },


    make401 (xhr) {
        /* eslint-disable-next-line no-console*/
        console.log(" --- Auth failed ", 401, xhr);
        return {status: 401, success: false};
    },


    make403 (xhr) {
        /* eslint-disable-next-line no-console*/
        console.log(" --- Auth failed ", 403, xhr);
        return {status: 401, success: false};
    }


});

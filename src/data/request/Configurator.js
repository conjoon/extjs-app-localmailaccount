/**
 * conjoon
 * extjs-app-localmailaccount
 * Copyright (C) 2022-2023 Thorsten Suckow-Homberg https://github.com/conjoon/extjs-app-localmailaccount
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
 * @inheritdoc
 */
Ext.define("conjoon.localmailaccount.data.request.Configurator", {

    extend: "coon.core.data.request.Configurator",

    requires: [

        // @define "l8"
        "l8",
        "Ext.data.Request",
        "conjoon.cn_mail.data.mail.service.MailFolderHelper"
    ],


    /**
     * Configures a request with additional header information if the request is not targeting
     * the MailAccounts served from LocalStorage.
     *
     * @param request
     * @returns {Object|Ext.data.Request}
     */
    configure (request) {

        const
            me = this,
            isDataRequest = request instanceof Ext.data.Request,
            url = isDataRequest ? request.getUrl() : request.url;

        if (!me.needsAuth(url)) {
            return request;
        }

        const mailAccount = me.getAccountForUrl(url);

        if (!mailAccount) {
            throw new Error(`no MailAccount found for url ${url}`);
        }

        const
            isInboxRequest = me.isInboxRequest(request),
            authStr = mailAccount.getInboxAuth(),
            serverInfo = isInboxRequest
                ? Object.assign(mailAccount.getInboxInfo(), mailAccount.getGeneralInfo())
                : Object.assign(
                    mailAccount.getOutboxInfo(true),
                    mailAccount.getInboxInfo(),
                    mailAccount.getGeneralInfo()
                ),
            headers = (isDataRequest ? request.getHeaders() : request.headers) || {},
            newHeaders = Object.assign(headers, {
                Authorization: "Basic " + me.encode(authStr.join(":")),
                "X-CNMAIL-DATA": me.encode(serverInfo)
            });

        if (isDataRequest) {
            request.setHeaders(newHeaders);
        } else {
            request.headers = newHeaders;
        }

        return request;
    },


    /**
     * @param url
     * @returns {conjoon.cn_mail.model.mail.folder.MailFolder|undefined}
     * @private
     */
    getAccountForUrl (url) {

        const me = this;

        let mailAccountId = me.parse(url);

        if (!mailAccountId) {
            throw new Error(`Could not determine mailAccountId for url ${url}`);
        }

        const helper = me.getMailFolderHelper();

        const mailAccount = helper.getAccountNode(mailAccountId);

        return mailAccount ?? undefined;
    },


    /**
     * @returns {conjoon.cn_mail.data.mail.service.MailFolderHelper}
     */
    getMailFolderHelper () {
        return conjoon.cn_mail.data.mail.service.MailFolderHelper.getInstance();
    },


    /**
     * @param {String} url
     * @returns {boolean}
     */
    needsAuth (url) {
        const me = this;
        return !!me.parse(url);
    },


    /**
     * @param {String} url
     * @returns {string}
     */
    parse (url) {
        const
            regex = /MailAccounts\/(?<mailAccountId>.*)\/MailFolders/im,
            res = regex.exec(url);

        let mailAccountId;

        if (res && res.groups.mailAccountId) {
            mailAccountId = decodeURIComponent(res.groups.mailAccountId);
        }

        return mailAccountId;
    },


    /**
     * Returns true if the request operates on inbox server informarmation, otherwise false,
     * indicating that the request operates on outbox server configuration, e.g. sending an email
     * via SMTP.
     *
     * @param request
     * @returns {boolean}
     */
    isInboxRequest (request) {

        const isDataRequest = request instanceof Ext.data.Request;
        const method = isDataRequest ? request.getMethod() : request.method;
        const url = isDataRequest ? request.getUrl() : request.url;

        const
            regex = /MailAccounts\/(.*)\/MailFolders\/(.*)\/MessageItems\/(.*)/im,
            res = regex.exec(url);

        if (res && method.toLowerCase() === "post") {
            return false;
        }

        return true;
    },


    /**
     * @private
     * @param {Object} str
     * @returns {string}
     */
    encode (str) {
        return l8.isString(str) ? btoa(str) : btoa(JSON.stringify(str));
    }
});

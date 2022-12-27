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
 */
export default {

    name: "extjs-app-localmailuser",

    timeout: 750,


    loaderPath: {

        "conjoon.localmailuser.overrides.conjoon.cn_mail.app.PackageController": "../overrides/conjoon.cn_mail.app.PackageController.js",

        "conjoon.localmailuser": "../src",

        /**
         * Universal
         */
        "conjoon.cn_mail": "../../node_modules/@conjoon/extjs-app-webmail/src",
        "conjoon.cn_mail.view.mail.account.MailAccountViewModel": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/account/MailAccountViewModel.js",
        "conjoon.cn_mail.view.mail.account.MailAccountViewController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/account/MailAccountViewController.js",
        "conjoon.cn_mail.view.mail.inbox.InboxViewModel": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/inbox/InboxViewModel.js",
        "conjoon.cn_mail.view.mail.inbox.InboxViewController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/inbox/InboxViewController.js",
        "conjoon.cn_mail.view.mail.message.reader.MessageViewModel": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/reader/MessageViewModel.js",
        "conjoon.cn_mail.view.mail.message.reader.MessageViewController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/reader/MessageViewController.js",
        "conjoon.cn_mail.view.mail.message.editor.MessageEditorViewModel": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/editor/MessageEditorViewModel.js",
        "conjoon.cn_mail.view.mail.message.AbstractAttachmentListController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/AbstractAttachmentListController.js",
        "conjoon.cn_mail.view.mail.message.reader.AttachmentListController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/reader/AttachmentListController.js",
        "conjoon.cn_mail.view.mail.message.editor.AttachmentListController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/editor/AttachmentListController.js",
        "conjoon.cn_mail.view.mail.MailDesktopViewController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/MailDesktopViewController.js",
        "conjoon.cn_mail.view.mail.MailDesktopViewModel": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/MailDesktopViewModel.js",
        "conjoon.cn_mail.view.mail.message.editor.MessageEditorViewController": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/editor/MessageEditorViewController.js",
        "conjoon.cn_mail.view.mail.message.editor.MessageEditorDragDropListener": "../../node_modules/@conjoon/extjs-app-webmail/src/view/mail/message/editor/MessageEditorDragDropListener.js",

        "coon.comp.window": "../../node_modules/@coon-js/extjs-lib-comp/src/window",
        "coon.comp.toolbar": "../../node_modules/@coon-js/extjs-lib-comp/src/toolbar",
        "coon.comp": "../../node_modules/@coon-js/extjs-lib-comp/classic/src",

        "coon.core": "../../node_modules/@coon-js/extjs-lib-core/src/",


        /**
         * Classic
         */
        "conjoon.cn_mail.view": "../../node_modules/@conjoon/extjs-app-webmail/classic/src/view",

        "coon.comp.window.Toast": "../../node_modules/@coon-js/extjs-lib-comp/classic/src/window/Toast.js"


    },

    preload: {
        js: [
            "../node_modules/@l8js/l8/dist/l8.runtime.umd.js"
        ]
    }
};


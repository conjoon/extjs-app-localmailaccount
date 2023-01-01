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

StartTest(t => {

    let conf;

    const PARENT_CLASS = "coon.core.data.request.Configurator";
    const CLASS_NAME = "conjoon.localmailaccount.data.request.Configurator";

    const create = () => Ext.create(CLASS_NAME);

    const makeRequest = (data, toInst) => {
        return toInst ? Ext.create("Ext.data.Request", data) : data; 
    };

    const MAIL_ACCOUNT = {
        name: "conjoon developer",
        inbox_type: "IMAP",
        inbox_address: "sfsffs.ffssf.sffs",
        inbox_port: 993,
        inbox_user: "inboxuser",
        inbox_password: "inboxpassword",
        inbox_ssl: true,
        outbox_address: "sfsffs.ffssf.sffs",
        outbox_port: 993,
        outbox_user: "outboxuser",
        outbox_password: "outboxpassword",
        outbox_secure: "tls"
    };

    const createMailAccount = () => {
        return Ext.create("conjoon.cn_mail.model.mail.account.MailAccount", MAIL_ACCOUNT);
    };

    t.afterEach(() => {
        if (conf) {
            conf.destroy();
            conf = null;
        }
    });

    
    t.it("class", t => {
        conf = create();
        t.isInstanceOf(conf, PARENT_CLASS);
    });
    

    t.it("isInboxRequest()", t => {
        conf = create();
        
        const inboxRequest = {
            url: "https://localhost/MailAccounts/1/MailFolders/2"
        };
        const outboxRequest = {
            url: "https://localhost/MailAccounts/1/MailFolders/2/MessageItems/4",
            method: "POST"
        };
        const noOutboxRequest = {
            url: "https://localhost/MailAccounts/1/MailFolders/2/MessageItems/4",
            method: "PATCH"
        };
        
        t.expect(conf.isInboxRequest(makeRequest(inboxRequest))).toBe(true);
        t.expect(conf.isInboxRequest(makeRequest(inboxRequest, true))).toBe(true);

        t.expect(conf.isInboxRequest(makeRequest(outboxRequest))).toBe(false);
        t.expect(conf.isInboxRequest(makeRequest(outboxRequest, true))).toBe(false);

        t.expect(conf.isInboxRequest(makeRequest(noOutboxRequest))).toBe(true);
        t.expect(conf.isInboxRequest(makeRequest(noOutboxRequest, true))).toBe(true);
    });


    t.it("parse()", t => {
        conf = create();

        const tests = [{
            url: "https://localhost/MailAccounts/1/MailFolders/2",
            expected: "1"
        }, {
            url: "https://localhost/MailAccounts/1",
            expected: undefined
        }];

        tests.map(({url, expected}) => {
            t.expect(conf.parse(url)).toBe(expected);
        });

    });


    t.it("needsAuth()", t => {
        conf = create();

        const tests = [{
            url: "https://localhost/MailAccounts/1/MailFolders/2",
            expected: true
        }, {
            url: "https://localhost/MailAccounts/1",
            expected: false
        }];

        tests.map(({url, expected}) => {
            t.expect(conf.needsAuth(url)).toBe(expected);
        });

    });


    t.it("getMailFolderHelper()", t => {
        conf = create();

        t.expect(conf.getMailFolderHelper()).toBe(
            conjoon.cn_mail.data.mail.service.MailFolderHelper.getInstance()
        );
    });


    t.it("getAccountForUrl()", t => {
        conf = create();

        const FAKE_ACCOUNT = {};
        const FAKE_MAILFOLDERHELPER = {
            getAccountNode (id) {return id === "1" ? FAKE_ACCOUNT : null;}
        };

        const parseSpy = t.spyOn(conf, "parse").and.callThrough();
        const mailFolderHelperSpy = t.spyOn(conf, "getMailFolderHelper").and.callFake(() => FAKE_MAILFOLDERHELPER);
        const getAccountNodeSpy = t.spyOn(FAKE_MAILFOLDERHELPER, "getAccountNode").and.callThrough();

        try {
            conf.getAccountForUrl("https://localhost/MailAccounts");
            t.fail();
        } catch (e) {
            t.expect(e.message).toContain("Could not determine mailAccountId");
        }

        t.expect(conf.getAccountForUrl("https://localhost/MailAccounts/2/MailFolders")).toBeUndefined();
        t.expect(conf.getAccountForUrl("https://localhost/MailAccounts/1/MailFolders")).toBe(FAKE_ACCOUNT);


        [parseSpy, getAccountNodeSpy, mailFolderHelperSpy].map(spy => spy.remove());
    });


    t.it("encode()", t => {
        conf = create();

        const d = {"str": "value"};

        t.expect(conf.encode(d)).toBe(btoa(JSON.stringify(d)));

        t.expect(conf.encode("str")).toBe(btoa("str"));
    });


    t.it("configure() - no auth needed", t => {
        conf = create();

        const inboxRequest = {
            url: "https://localhost/MailAccounts"
        };

        let request = conf.configure(makeRequest(inboxRequest));
        t.expect(request.headers).toBeUndefined();

        request = conf.configure(makeRequest(inboxRequest, true));
        t.expect(request.getHeaders()).toEqual({});
    });


    t.it("configure() - no MailAccount", t => {
        conf = create();

        const accountSpy = t.spyOn(conf, "getAccountForUrl").and.callFake(() => undefined);

        const inboxRequest = {
            url: "https://localhost/MailAccounts/1/MailFolders"
        };

        try {
            conf.configure(makeRequest(inboxRequest));
            t.fail();
        } catch (e) {
            t.expect(e.message).toContain("no MailAccount found");
        }

        [accountSpy].map(spy => spy.remove());
    });


    t.it("configure() - inbox operation", t => {
        conf = create();

        const inboxRequest = {
            url: "https://localhost/MailAccounts/1/MailFolders"
        };

        const mailAccount = createMailAccount();
        const accountSpy = t.spyOn(conf, "getAccountForUrl").and.callFake(() => mailAccount);

        const inboxResultHeaders = {
            Authorization: "Basic " + conf.encode(mailAccount.getInboxAuth().join(":")),
            "X-CNMAIL-DATA": conf.encode(mailAccount.getInboxInfo())
        };

        let request = conf.configure(makeRequest(inboxRequest));
        t.expect(request.headers).toEqual(inboxResultHeaders);
        request = conf.configure(makeRequest(inboxRequest, true));
        t.expect(request.getHeaders()).toEqual(inboxResultHeaders);

        [accountSpy].map(spy => spy.remove());
    });


    t.it("configure() - outbox operation", t => {
        conf = create();

        const outboxRequest = {
            url: "https://localhost/MailAccounts/1/MailFolders/2/MessageItems/3?dc=cachebuster",
            method: "POST"
        };

        const mailAccount = createMailAccount();
        const accountSpy = t.spyOn(conf, "getAccountForUrl").and.callFake(() => mailAccount);

        const outboxResultHeaders = {
            Authorization: "Basic " + conf.encode(mailAccount.getInboxAuth().join(":")),
            "X-CNMAIL-DATA": conf.encode(
                Object.assign(mailAccount.getOutboxInfo(true), mailAccount.getInboxInfo())
            )
        };

        let request = conf.configure(makeRequest(outboxRequest));
        t.expect(request.headers).toEqual(outboxResultHeaders);
        request = conf.configure(makeRequest(outboxRequest, true));
        t.expect(request.getHeaders()).toEqual(outboxResultHeaders);

        [accountSpy].map(spy => spy.remove());
    });

});
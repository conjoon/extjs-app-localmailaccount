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

    let sim;

    const CLASS_NAME = "conjoon.localmailuser.data.MailAccountToLocalStorageSim";
    const PARENT_CLASS = "Ext.ux.ajax.JsonSimlet";

    const create = () => Ext.create(CLASS_NAME);

    const FAKE_REPOSITORY = {
        queryAll () {return [{account: 1}, {account: 2}];},
        insert () {return {id: "newId"};},
        update (key, data) {
            if (key === "1") {
                return undefined;
            }
            return {id: "updatedId", data: "all"};
        }
    };

    t.it("constructor / config", t => {
        sim = create();
        t.isInstanceOf(sim, PARENT_CLASS);

        t.expect(l8.unchain(CLASS_NAME, window).required).toEqual({
            mailAccountRepository: "conjoon.localmailuser.data.MailAccountRepository"
        });
    });


    t.it("doGet()", t => {
        sim = create();

        sim.mailAccountRepository = FAKE_REPOSITORY;

        const queryAllSpy = t.spyOn(FAKE_REPOSITORY, "queryAll").and.callThrough();

        let resp = sim.doGet();

        t.expect(resp.status).toBe(200);
        t.expect(resp.responseText).toBe(JSON.stringify({data: queryAllSpy.calls.mostRecent().returnValue}));

        [queryAllSpy].map(spy => spy.remove());
    });


    t.it("doPost()", t => {
        sim = create();

        sim.mailAccountRepository = FAKE_REPOSITORY;

        const insertSpy = t.spyOn(FAKE_REPOSITORY, "insert").and.callThrough();

        const ctx = {xhr: {body: JSON.stringify({newData: "values"})}};

        let resp = sim.doPost(ctx);

        t.expect(insertSpy.calls.mostRecent().args[0]).toEqual(JSON.parse(ctx.xhr.body));
        t.expect(resp.status).toBe(200);

        t.expect(resp.responseText).toBe(JSON.stringify({
            data: {
                id: insertSpy.calls.mostRecent().returnValue.id
            }}));

        [insertSpy].map(spy => spy.remove());
    });


    t.it("doPatch() - 200", t => {
        sim = create();

        sim.mailAccountRepository = FAKE_REPOSITORY;

        const updateSpy = t.spyOn(FAKE_REPOSITORY, "update").and.callThrough();

        const ctx = {
            xhr: {
                url: "https://localhost/MailAccounts/cn_localmailaccount-1?dc=8796689",
                body: JSON.stringify({dataToUpdate: "values"})
            }
        };

        let resp = sim.doPatch(ctx);
        t.expect(updateSpy.calls.mostRecent().args).toEqual([
            "cn_localmailaccount-1",
            JSON.parse(ctx.xhr.body)
        ]);

        t.expect(resp.status).toBe(200);
        t.expect(resp.responseText).toBe(JSON.stringify({
            data: updateSpy.calls.mostRecent().returnValue
        }));

        [updateSpy].map(spy => spy.remove());
    });


    t.it("doPatch() - 400", t => {
        sim = create();

        sim.mailAccountRepository = FAKE_REPOSITORY;

        const ctx = {
            xhr: {
                url: "https://localhost/MailAccounts/1?dc=8796689",
                body: "{}"
            }
        };

        let resp = sim.doPatch(ctx);

        t.expect(resp.status).toBe(400);
    });
});

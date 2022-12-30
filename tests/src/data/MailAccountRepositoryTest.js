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

    let rep;

    const CLASS_NAME = "conjoon.localmailuser.data.MailAccountRepository";
    const PARENT_CLASS = "conjoon.localmailuser.data.MailAccountRepository";


    const generateKey = (rep, ordinal) => {
        return rep.idPrefix + rep.idPostfixTemplate.replace("\\d", ordinal);
    };


    const create = () => Ext.create(CLASS_NAME);

    t.it("constructor / config", t => {
        rep = create();
        t.isInstanceOf(rep, PARENT_CLASS);

        t.expect(rep.idPrefix).toBe("cn_localmailaccount");
        t.expect(rep.idPostfixTemplate).toBe("-\\d");
    });


    t.it("insert()", t => {
        rep = create();

        let idGen = 0;

        const FAKE_STORAGE = {
            setItem: function () {}
        };

        const nextSpy = t.spyOn(rep, "nextId").and.callFake(() => ++idGen);
        const setItemSpy = t.spyOn(FAKE_STORAGE, "setItem").and.callFake(() => {});
        const data = {};

        rep.getStorage = () => FAKE_STORAGE;

        let ins = rep.insert(data);

        t.expect(ins).not.toBe(data);
        t.expect(ins.id).toBe(1);
        t.expect(setItemSpy.calls.mostRecent().args).toEqual([ins.id, JSON.stringify(data)]);

        ins = rep.insert(data);
        t.expect(ins).not.toBe(data);
        t.expect(ins.id).toBe(2);
        t.expect(setItemSpy.calls.mostRecent().args).toEqual([ins.id, JSON.stringify(data)]);

        [nextSpy, setItemSpy].map(spy => spy.remove());
    });


    t.it("update()", t => {

        rep = create();

        const FAKE_STORAGE = {
            setItem: function () {},
            getItem: function (key) {
                if (key === generateKey(rep, 2)) {
                    return JSON.stringify({
                        name: "mailAccountName",
                        from: JSON.stringify({name: "name", address: "address"}),
                        replyTo: JSON.stringify({name: "name", address: "address"})
                    });
                }
            }
        };

        const setItemSpy = t.spyOn(FAKE_STORAGE, "setItem").and.callFake(() => {});
        const encodeSpy = t.spyOn(rep, "encodeItem").and.callThrough();

        const data = {name: "new name", from: JSON.stringify({name: "prevName", address: "prevAddress"})};

        rep.getStorage = () => FAKE_STORAGE;

        t.expect(rep.update(generateKey(rep, 1), {})).toBeUndefined();

        t.expect(rep.update(generateKey(rep, 2), data)).toEqual({
            id: generateKey(rep, 2),
            name: "new name",
            from: {name: "prevName", address: "prevAddress"},
            replyTo: {name: "name", address: "address"}
        });

        t.expect(setItemSpy.calls.mostRecent().args).toEqual([
            generateKey(rep, 2),
            encodeSpy.calls.mostRecent().returnValue
        ]);

        [encodeSpy, setItemSpy].map(spy => spy.remove());
    });


    t.it("nextId()", t => {
        rep = create();

        const ALL_DATA = new Array(5).fill(undefined).map((item, index) => {
            let id = generateKey(rep, index + 1);
            return {id};
        });

        const current = [];
        const queryAllSpy = t.spyOn(rep, "queryAll").and.callFake(() => current);
        ALL_DATA.forEach((item, index) => {
            current.push(item);

            let expected = generateKey(rep,current.length + 1);
            t.expect(rep.nextId()).toBe(expected);
        });

        [queryAllSpy].map(spy => spy.remove());
    });


    t.it("query()", t => {
        rep = create();

        try {
            rep.query("foo");
            t.fail();
        } catch (e) {
            t.expect(e.message).toContain(`expected id to contain "${rep.idPrefix}"`);
        }

        const FAKE_STORAGE = {
            getItem: key => key === generateKey(rep, 1) ? JSON.stringify({key}) : null
        };

        const decodeSpy = t.spyOn(rep, "decodeItem").and.callThrough();

        rep.getStorage = () => FAKE_STORAGE;

        t.expect(rep.query(generateKey(rep, 2))).toBeUndefined();
        t.expect(rep.query(generateKey(rep, 1))).toEqual({key: generateKey(rep, 1)});
        t.expect(decodeSpy.calls.count()).toBe(1);

        [decodeSpy].map(spy => spy.remove());

    });


    t.it("queryAll()", t => {
        rep = create();

        const FAKE_STORAGE = {
            length: 5,
            key: function (i) {
                return generateKey(rep, i+1);
            },
            getItem: key => JSON.stringify({key})
        };

        const decodeSpy = t.spyOn(rep, "decodeItem").and.callThrough();

        rep.getStorage = () => FAKE_STORAGE;

        const allData = rep.queryAll();
        t.expect(allData.length).toBe(FAKE_STORAGE.length);

        allData.map((item, index) => {
            t.expect(item).toEqual({key: generateKey(rep, index +1)});
        });

        t.expect(decodeSpy.calls.count()).toBe(FAKE_STORAGE.length);

        [decodeSpy].map(spy => spy.remove());
    });

});

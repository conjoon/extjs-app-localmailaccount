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

    let ctrl;

    t.it("constructor / config", t => {
        ctrl = Ext.create("conjoon.localmailaccount.app.PackageController");
        t.isInstanceOf(ctrl, "coon.core.app.PackageController");
    });


    t.it("init()", t => {

        ctrl = Ext.create("conjoon.localmailaccount.app.PackageController");

        const interceptUri = "intercepturi";

        const
            app = {
                getPackageConfig: function () {}
            },
            confSpy = t.spyOn(app, "getPackageConfig").and.callFake(() => ({interceptUri})),
            simSpy = t.spyOn(Ext.ux.ajax.SimManager, "register").and.callFake(() => {});

        ctrl.init(app);
        let arg = simSpy.calls.mostRecent().args[0];
        t.isInstanceOf(arg, "conjoon.localmailaccount.data.MailAccountToLocalStorageSim");
        t.expect(arg.url.toString()).toBe(`/${interceptUri}/im`);
        t.expect(arg.delay).toBe(1);

        [confSpy, simSpy].map(spy => spy.remove());
    });


    t.it("preLaunchHook()", t => {

        ctrl = Ext.create("conjoon.localmailaccount.app.PackageController");

        const title = "TITLE";

        const
            app = {
                getPackageConfig: () => title
            },
            fireSpy = t.spyOn(Ext, "fireEvent").and.callFake(() => {});

        t.expect(ctrl.preLaunchHook(app)).toBe(true);

        t.expect(fireSpy.calls.mostRecent().args).toEqual([
            "conjoon.application.TitleAvailable", ctrl, title
        ]);

        [fireSpy].map(spy => spy.remove());
    });


});

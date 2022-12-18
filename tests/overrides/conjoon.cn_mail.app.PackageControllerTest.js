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

StartTest(t => {


    /**
     * Saves the original node nav before localmailuser injects additional buttons.
     *
     */
    let NODE_NAV_LENGTH;

    t.it("original preLaunchHook()", t => {


        const
            ctrl = Ext.create("conjoon.cn_mail.app.PackageController"),
            nav = ctrl.postLaunchHook();

        NODE_NAV_LENGTH = nav.navigation[0].nodeNav.length;

        t.expect(NODE_NAV_LENGTH).toBeGreaterThan(0);

    });


    t.requireOk(
        "conjoon.localmailuser.overrides.conjoon.cn_mail.app.PackageController",
        () => {


            t.it("preLaunchHook()", t => {


                const
                    ctrl = Ext.create("conjoon.cn_mail.app.PackageController"),
                    nav = ctrl.postLaunchHook(),
                    newLength = nav.navigation[0].nodeNav.length;

                t.expect(newLength).toBe(NODE_NAV_LENGTH + 1);
                t.expect(nav.navigation[0].nodeNav[NODE_NAV_LENGTH]).toEqual({
                    xtype: "button",
                    iconCls: "fas fa-at",
                    itemId: "cn-localmailuser-addAccountBtn"
                });

            });

        
        });


});

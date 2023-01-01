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

export default class TestHelper {


    /**
     * Returns an instance of TestHelper.
     *
     * @param siestaTest
     * @param owningWindow
     * @return {TestHelper}
     */
    static get (siestaTest, owningWindow) {
        let stat = new TestHelper();
        stat.siestaTest = siestaTest;
        stat.owningWindow = owningWindow;
        return stat;
    }


    /**
     * Calls the submitted callable.
     *
     * @param cb
     * @return {TestHelper}
     */
    andRun (cb) {
        cb(this.siestaTest);

        return this;
    }


    /**
     *
     * @returns {Promise<TestHelper>}
     */
    async registerIoC () {

        const t = this.siestaTest;

        await new Promise((resolve, reject) => {

            t.requireOk("coon.core.ioc.Container", () => {
                coon.core.ioc.Container.bind({});
                resolve(" -> IoC");
            });

        });

        return this;
    }


    /**
     * Loads the specified files.
     *
     * @param files
     * @return {Promise<TestHelper>}
     */
    async load (...files) {

        const t = this.siestaTest;

        await new Promise((resolve, reject) => {
            t.requireOk(files, () => {
                resolve(" -> load");
            });

        });

        return this;
    }


}

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


Ext.define("conjoon.localmailuser.data.MailAccountRepository", {

    requires: [
        // @define "l8"
        "l8"
    ],

    idPrefix: "cn_localmailaccount",

    idPostfixTemplate: "-\\d",


    /**
     * Inserts new MailAccount-data.
     *
     * @param {Object} data
     *
     * @returns {Object} The newly inserted data along with the auto-generated id.
     *
     * @see nextId()
     */
    insert (data) {

        const
            me = this,
            id = me.nextId();

        data.id = id;

        me.getStorage().setItem(id, me.encodeItem(data));

        return Object.assign({}, data);
    },


    /**
     * Updates MailAccount-data for the given id.
     *
     * @param {String} id
     * @param {Object} data
     *
     * @returns {Object|undefined} The MailAccount with the updated data, or undefined
     * if the data with the id was not found.
     *
     */
    update (id, data) {

        const
            me = this,
            item = me.query(id);

        if (!item) {
            return undefined;
        }

        let parsedData = me.decodeItem(data);
        let updated = Object.assign(item, parsedData);

        me.getStorage().setItem(id, me.encodeItem(updated));


        return Object.assign({}, {id, ...updated});
    },


    /**
     * Returns the next id used with this repository for inserting data.
     *
     * @returns {string}
     */
    nextId () {
        const me = this,
            idPrefix = me.idPrefix,
            idPostfixTemplate = me. idPostfixTemplate,
            accounts = me.queryAll(),
            ids = accounts.map(account => account.id).filter(accountId => accountId !== undefined);

        return ids.length === 0 ? idPrefix + "-1" : l8.text.nameToOrdinal(idPrefix, ids, idPostfixTemplate);
    },


    /**
     * Returns all items in this repository.
     *
     * @returns {Array}
     */
    queryAll () {

        const
            me = this,
            idPrefix = me.idPrefix,
            storage = me.getStorage(),
            res = [];

        for (let i = 0, len = storage.length; i < len; i++) {
            let key = storage.key(i);
            if (key.indexOf(idPrefix) !== 0) {
                continue;
            }

            res.push(me.decodeItem(storage.getItem(key)));
        }

        return res;
    },


    /**
     * Returns the item with the specified id.
     *
     * @param {String} id
     *
     * @returns {Object|undefined}
     *
     * @throws exception if id did not match this repository's idPrefix
     */
    query (id) {

        const
            me = this,
            idPrefix = me.idPrefix,
            storage = me.getStorage();

        if (id.indexOf(idPrefix) !== 0) {
            throw new Error(`Unexpected id: ${id}, expected id to contain "${idPrefix}"`);
        }

        const item = storage.getItem(id);
        if (item) {
            return me.decodeItem(item);
        }

        return undefined;
    },


    /**
     * Decodes an item from the underlying data storage and returns it.
     * Will only decode necessary parts if the submitted data is partially
     * encoded.
     *
     * @param {Object|String} item
     *
     * @returns {Object}
     */
    decodeItem (item) {

        if (l8.isString(item)) {
            try {
                item = JSON.parse(item);
            } catch (e) {
                throw new Error(
                    "Could not decode MailAccount saved in LocalStorage. " +
                    "Please clear the LocalStorage if this problem persists."
                );
            }
        }

        ["replyTo", "from"].map(decodable => {
            if (item[decodable] === undefined) {
                return;
            }
            try {
                item[decodable] = JSON.parse(item[decodable]);
            } catch (e) {
                item[decodable] = {};
            }
        });

        return item;
    },


    /**
     * Prepares item so it can be stored locally.
     *
     * @param {Object} item
     *
     * @returns {String}
     */
    encodeItem (item) {

        const data = Object.fromEntries(

            Object.entries(item).map(([key, value]) => {

                if (["from", "replyTo"].includes(key)) {
                    if (l8.isObject(value)) {
                        value = JSON.stringify(value);
                    }
                }

                return [key, value];
            })

        );

        return JSON.stringify(data);
    },


    /**
     * @private
     */
    getStorage () {
        return window.localStorage;
    }


});

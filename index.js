const fs = require('fs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

// path to json file
const jsonFile = require("./coded_sample.json");
let count = 0;

function decodeNestedHTML(object) { 
    let totalCount = 0;
    let isDirty = true;
    while (isDirty) {
        _decodeNestedHTML(object);
        isDirty = !!count;
        totalCount += count;
        count = 0;
    }
    return totalCount;
}

function _decodeNestedHTML(object) {
    Object.keys(object).forEach(
        function (key) {
            if (
                !(object[key] === undefined || object[key] === null) &&
                object[key].toString() === '[object Object]' &&
                Object.keys(object[key]).length > 0
            ) {
                return _decodeNestedHTML(object[key]);
            } else if (
                !(object[key] === undefined || object[key] === null) &&
                Array.isArray(object[key]) &&
                object[key].length > 0
            ) {
                object[key].forEach(_decodeNestedHTML);
            } else if (typeof object[key] === 'string') {
                const original = object[key];
                object[key] = entities.decode(object[key]); // entities -> "html-entities" npm package
                if (original !== object[key]) {
                    count++; // audit amount of changes
                }
            }
        }.bind(this)
    );
}


console.log(`${decodeNestedHTML(jsonFile)} occurrences`);
fs.writeFileSync(`./decoded-json.json`, JSON.stringify(jsonFile));

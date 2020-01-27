// const express = require("express");
// const bodyParser = require("body-parser");
// const formidable = require("formidable");

const request = require("request");
const path = require("path");
const fs = require("fs");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;
// const server = express();

const OPTS = {
    method: 'GET',
    headers: {
        'Content-Type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'user-agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Mobile Safari/537.36',
        'Cookie': ''
    },
    url: "https://3g.dxy.cn/newh5/view/pneumonia"
};

let list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
let keys = new Map();

let getKey = (obj) => {
    if (obj instanceof Array) {
        obj.forEach(o => {
            for (var k in o) {
                keys.set(k, (keys.get(k) || list.shift()));
                if (typeof o[k] == 'object') {
                    getKey(o[k]);
                }
            }
        })
    } else {
        for (var k in obj) {
            keys.set(k, (keys.get(k) || list.shift()));
            if (typeof o[k] == 'object') {
                getKey(o[k]);
            }
        }
    }
}

let getAndReplaceKey = (obj) => {
    if (obj instanceof Array) {
        obj.forEach(o => {
            for (var k in o) {
                keys.set(k, (keys.get(k) || list.shift()));
                o[keys.get(k)] = o[k];
                delete o[k];
                if (typeof o[keys.get(k)] == 'object') {
                    getAndReplaceKey(o[keys.get(k)]);
                }
            }
        })
    } else {
        for (var k in obj) {
            keys.set(k, (keys.get(k) || list.shift()));
            obj[keys.get(k)] = obj[k];
            if (typeof obj[keys.get(k)] == 'object') {
                getAndReplaceKey(obj[keys.get(k)]);
            }
        }
    }
}

let lastStr = "";

let getNew = () => {
    request(OPTS, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            console.log(err || res.statusCode);
        } else {
            // console.log(body);
            let page = new JSDOM(body);
            let areaStatus = page.window.document.querySelector("#getAreaStat");
            areaStatus = (areaStatus.innerHTML).replace("try { window.getAreaStat =", "").replace("}catch(e){}", "");
            // console.log((areaStatus))
            areaStatus = JSON.parse(areaStatus)

            getAndReplaceKey(areaStatus);
            // console.log(JSON.stringify([...keys]))
            // console.log(JSON.stringify(areaStatus))

            let data = JSON.stringify({
                key: [...keys],
                data: areaStatus
            });

            if (data != lastStr) {
                lastStr = data;
                fs.writeFileSync(path.resolve(__dirname, `./data/${new Date().toLocaleString().replace(/\:|\ /g, "-")}.json`), lastStr);
            }
        }
    });
}

setInterval(getNew, 60 * 1000 * 60)
getNew();
const fs = require('fs');
const path = require('path');
const transliteration = require('transliteration');

const KEYSMAP = require('./KEYSMAP');
const KEY2CN = KEYSMAP.KEY2CN;
const VALUE2ID = KEYSMAP.VALUE2ID;
const ID2VALUE = KEYSMAP.ID2VALUE;
const KEY2ID = KEYSMAP.KEY2ID;
const ID2KEY = KEYSMAP.ID2KEY;
const VALUE2CN = KEYSMAP.VALUE2CN;

// PLAY                     景点游乐园                   A2
// DIET                     餐饮小店                    A3
// SHOP                     商场玩具店                  A4
// HOTEL                    酒店                        A5
// STRATEGY                 攻略                        B1
// WEBSITE                  官网                        B2

// part_0_id                   id
// part_1_type                  类型
// part_2_country             国家
// part_2_area                地区
// part_2_city                城市
// part_2_local               二级地域
// part_3_url_TITLE_CN        标题:官网/网址
// part_3_cn_url_TITLE_CN     标题:中文官网/中文网址
// part_3_other_url_TITLE_CN  标题:其他官网/其他网址
// part_3_url                 官网/网址 数组
// part_3_cn_url              中文官网/中文网址-数组
// part_3_other_url           其他官网/其他网址-数组
// part_3_2_name                名字    
// part_3_2_name_jp             日文名
// part_3_2_name_en             英文名        
// part_3_url                 官网
// part_3_cn_url              中文官网
// part_3_other_url           其他网址
// part_3_markdown              Markdown
// part_3_2_cost                门票价格
// part_3_2_traffic_url         交通位置指南
// part_3_2_address_en          英文地址
// part_3_2_address_cn          中文地址
// part_3_2_time_TITLE_CN       标题:营业时间/开放时间
// part_3_2_time                营业时间/开放时间
// part_3_2_floor_url           楼层指南
// part_3_2_shop_url            店铺指南
// part_3_remarks               其他信息
// part_3_2_gps                 经纬度
// part_3_2_local               地理位置和交通-废弃
// part_3_2_google_url          谷歌分享地址
// part_3_2_google_html         谷歌分享页面
// part_4_last_save_time        最后更新时间

// uid定义方式  类型.地区.名字

let changeKey = (data, isKeyToID = true) => {
    let _data = {};
    let keyMap = isKeyToID ? KEY2ID : ID2KEY;
    for (var key in data) {
        _data[keyMap[key]] = data[key];
    }
    data = null;
    return _data;
}

let debounce = (func, time) => {
    let t = -1;
    return function () {
        clearTimeout(t);
        let self = this;
        let args = arguments;
        t = setTimeout(() => {
            func.apply(self, args);
        }, time);
    };
}

let IDS = {
    ids: [],
    names: [],
    local: {},
    types: {},
    py: {},
    init: function () {
        try {
            this.ids = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../data/map.json`)));
        } catch (error) {
            console.log(error);
        }
        this.refresh();
        // console.log(JSON.stringify(IDS));
    },
    save: debounce(function () {
        fs.writeFileSync(path.resolve(__dirname, `../data/map.json`), JSON.stringify(this.ids));
        this.refresh();
    }, 2000),
    rename: function (oldId, newId) {
        let i = this.ids.indexOf(oldId);
        if (i === -1) {
            this.add(newId);
        } else {
            this.ids.splice(i, 1, newId);
            this.save();
        }
    },
    add: function (id) {
        if(this.ids.indexOf(id) == -1){
            this.ids.push(id);
            this.save();
        }
    },
    remove: function (id) {
        let i = this.ids.indexOf(id);
        if (i !== -1) {
            console.log('remove ' + id);
            this.ids.splice(i, 1);
            this.save();
        }
    },
    refresh: function () {
        this.names = [];
        this.local = {};
        this.types = {};
        this.py = {};
        console.log(JSON.stringify(this.ids));
        this.ids.forEach(id => {
            let _id = id.split(".");
            let type = _id[0];
            let locals = _id[1].split("-");
            let name = _id[2];
            this.names.push({
                name: name,
                id: id
            });
            this.types[type] = this.types[type] || [];
            this.types[type].push(id);
            let py = transliteration.transliterate(name).charAt(0);
            this.py[py] = this.py[py] || [];
            this.py[py].push({
                name: name,
                id: id,
                type: type,
                local: _id[1]
            });
            locals.reduce((last, now, i) => {
                now = now || "un";
                if (i == 3) {
                    last[now] = last[now] || [];
                    last[now].push(id);
                } else {
                    last[now] = last[now] || {};
                    return tempObj = last[now];
                }
            }, this.local);
        });
    }
}

module.exports = {
    init: () => {
        IDS.init();
    },
    add: function (data) {
        let self = this;
        return new Promise(function (resolve, reject) {
            let { part_2_country, part_2_area, part_2_city, part_2_local, part_1_type
                , part_0_id, part_3_2_name, part_3_2_name_en, part_3_2_name_jp } = data;
            let area = [part_2_country, part_2_area, part_2_city, part_2_local].join("-");
            let id = `${VALUE2ID[part_1_type]}.${area}.${part_3_2_name || part_3_2_name_en || part_3_2_name_jp}`;
            // console.log(`${part_0_id} <===> ${id}`);
            if (part_0_id === "") {
                data.part_0_id = id;
            } else if (part_0_id !== id) {
                // console.log(`delete file => ${path.resolve(__dirname, `../data/${id}.json`)}`)
                data.part_0_id = id;
                self.remove(part_0_id);
            }
            console.log(JSON.stringify(data));
            self.save(id, data);
            resolve();
        });
    },
    save: function (id, data) {
        IDS.add(id);
        fs.writeFile(path.resolve(__dirname, `../data/${id}.json`), JSON.stringify(changeKey(data)), (err) => {
            console.log(err);
        });
    },
    // rename: function (oldId, newId) {
    //     this.remove(oldId);
    //     let index;
    //     if ((index = ids.indexOf(id)) > -1) {
    //         ids.splice(index, 1, newId);
    //     }
    // },
    remove: function (id) {
        IDS.remove(id);
        fs.unlink(path.resolve(__dirname, `../data/${id}.json`), (err) => {
            console.log(err);
        });
    },
    get: function (id) {
        return new Promise(function (resolve, reject) {
            let data = fs.readFileSync(path.resolve(__dirname, `../data/${id}.json`));
            data = changeKey(JSON.parse(data), false);
            resolve(data);
        });
    },
    show: function (id) {
        return this.get(id).then(function (data) {
            let showData = {
                id: "",
                type: "",
                desc: "",
                name: "",
                detail: []
            };
            for (var key in KEY2CN) {
                let value = data[key];
                if (!value) {
                    continue;
                }
                let title = data[key + "_TITLE_CN"];
                switch (key) {
                    case 'part_0_id':
                        showData.id = value;
                        break;
                    case 'part_1_type':
                        showData.type = value;
                        showData.desc = VALUE2CN[value];
                        break;
                    case 'part_3_2_name':
                        showData.name = value;
                        break;
                    case 'part_3_url_TITLE_CN':
                    case 'part_3_cn_url_TITLE_CN':
                    case 'part_3_other_url_TITLE_CN':
                    case 'part_3_2_time_TITLE_CN':
                        break;
                    default:
                        let type = "";
                        if (key.endsWith("_url")) {
                            type = "url";
                        } else if (key.endsWith("_html")) {
                            type = "html";
                        }
                        showData.detail.push({
                            key: key,
                            title: title || KEY2CN[key],
                            value: value.replace("\n", "<br>"),
                            type: type
                        });
                        break;
                }
            }
            return Promise.resolve(showData);
        }).catch(function (e) {
            return Promise.reject(e);
        });
    },
    checkName: function (name) {
        return new Promise(function (resolve, reject) {
            let arr = IDS.names.filter((na) => {
                return na.name.indexOf(name) > -1;
            });
            resolve(arr);
        });
    },
    list: function () {
        return {
            ids: IDS.ids,
            // names: IDS.names,
            local: IDS.local,
            types: IDS.types,
            py: IDS.py,
        };
    }
}
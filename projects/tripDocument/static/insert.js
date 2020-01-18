

const EN2CN = {
    'japan': '日本',
    'Kansai': '关西',
    'Kanto': '关东',
    'Hokkaido': '北海道',
}
const AREAMAP = {
    'japan': {
        'Kansai': ['大阪', '奈良', '京都', '宇治', '神户'],
        'Kanto': ['东京', '横滨', '富士急', '川崎', '镰仓', '横须贺', '箱根', '静冈'],
        'Hokkaido': ['札幌', '小樽', '函馆', '南千岁', '登别', '洞爷', '富良野']
    }
}

const VALUE2ID = {
    "PLAY": "P",
    "DIET": "D",
    "SHOP": "S",
    "HOTEL": "H",
    "STRATEGY": "ST",
    "WEBSITE": "W",
    "TRAFFIC": "T",
    "INFORMATION": "I"
}

let getFormartDate = () => {
    return new Date().toLocaleDateString().split("/").reduce((pre, now) => {
        while (now.length < 2) {
            now = "0" + now;
        }
        return pre + "-" + now;
    });
};

let vm = new Vue({
    el: "#app",
    data: function () {
        return {
            part_0_id: "",
            part_1_type: "STRATEGY",
            part_2_country: "日本",
            part_2_area: "",
            part_2_city: "",
            part_2_local: "",
            part_3_url_TITLE_CN: "",
            part_3_cn_url_TITLE_CN: "",
            part_3_other_url_TITLE_CN: "",
            part_3_2_time_TITLE_CN: "",
            part_3_url: [""],
            part_3_cn_url: [""],
            part_3_other_url: [""],
            part_3_remarks: "",
            part_3_markdown: "",
            part_3_2_name: "",
            part_3_2_name_jp: "",
            part_3_2_name_en: "",
            part_3_2_time: "",
            part_3_2_cost: "",
            part_3_2_floor_url: [""],
            part_3_2_shop_url: [""],
            part_3_2_traffic_url: [""],
            part_3_2_gps: "",
            part_3_2_pluscode: "",
            part_3_2_address_en: "",
            part_3_2_address_cn: "",
            part_3_2_local: "",
            part_3_2_pluscode: "",
            part_3_2_google_url: "",
            part_3_2_google_html: "",
            part_3_2_booking_url: "",
            part_3_2_ctrip_url: "",
            part_3_2_tuniu_url: "",
            part_4_last_save_time: getFormartDate()
        }
    },
    // // bind computed methods
    computed: {
    },
    methods: {
        url_add: function (arr, i) {
            arr.splice(i + 1, 0, "");
        },
        url_remove: function (arr, i) {
            if (arr.length === 1) {
                arr.splice(i, 1, "");
            } else {
                arr.splice(i, 1);
            }
        },
        checkName: debounce(function () {
            var name = this.part_3_2_name || this.part_3_2_name_en || this.part_3_2_name_jp;
            if (!name) return;
            this.$http.get(`./checkname?id=${name}`).then((data) => {
                console.log(JSON.stringify(data.body));
                let str = data.body.reduce((org, now) => {
                    org += `<a target="_blank" href="./insertInfo.html?id=${now.id}" alt="${now.id}">${now.name}</a>`;
                    return org;
                }, "");
                document.querySelector(".part_1_right").innerHTML = str;
            }).catch((error) => {
                alert(JSON.stringify(error));
            });
            this.calculateId();
        }, 500),
        calculateId: debounce(function () {
            let { part_2_country, part_2_area, part_2_city, part_2_local, part_1_type
                , part_0_id, part_3_2_name, part_3_2_name_en, part_3_2_name_jp } = this;
            let area = [part_2_country, part_2_area, part_2_city, part_2_local].join("-");
            let id = `${VALUE2ID[part_1_type]}.${area}.${part_3_2_name || part_3_2_name_en || part_3_2_name_jp}`;
            document.querySelector("#currentId").innerHTML = "当前ID: " + id;
        }, 500),
        checkAndSave: function () {
            console.log(JSON.stringify(vm._data));
            if (this.part_3_2_name + this.part_3_2_name_en + this.part_3_2_name_jp === "") {
                alert("空名字不能保存!");
            }
            this.$http.post("./save", {
                data: JSON.stringify(vm.$data),
                bossId: localStorage.getItem("bossId")
            }, {
                emulateJSON: true
            }).then(function (data) {
                // console.log(JSON.stringify(data));
                alert(data.body.data);
                this.reset();
            }).catch(function (e) {
                alert(JSON.stringify(e.body.data));
            })
        },
        reset: function () {
            Object.assign(this.$data, this.$options.data());
        },
        resetWithout: function (obj) {
            Object.assign(this.$data, this.$options.data(), obj);
        }
    },
    watch: {
        part_1_type: function (newValue, oldValue) {
            // this.resetWithout({ part_1_type: newValue });
            // console.log("watch");
            switch (newValue) {
                case 'PLAY':
                    this.part_3_2_time_TITLE_CN = "开放时间";
                    break;
                default:
                    this.part_3_2_time_TITLE_CN = "营业时间";
            }
            this.calculateId();
        },
        part_2_area: function () {
            this.calculateId();
        },
        part_2_local: function () {
            this.calculateId();
        },
        part_2_country: function () {
            this.calculateId();
        },
        part_2_city: function (newValue, oldValue) {
            for (let countryName in AREAMAP) {
                let country = AREAMAP[countryName]
                for (let areaName in country) {
                    let area = country[areaName];
                    if (area.includes(newValue)) {
                        this.part_2_country = EN2CN[countryName];
                        this.part_2_area = EN2CN[areaName];
                        return;
                    }
                }
            }
            this.calculateId();
        },
        part_3_2_name: function (value) {
            this.part_3_2_name = value.replace(/\\|\/|\"|\*|\?|\:|\<|\>|\||\./g, '');
            this.checkName();
        },
        part_3_2_name_en: function (value) {
            this.part_3_2_name_en = value.replace(/\\|\/|\"|\*|\?|\:|\<|\>|\||\./g, '');
            this.checkName();
        },
        part_3_2_name_jp: function (value) {
            this.part_3_2_name_jp = value.replace(/\\|\/|\"|\*|\?|\:|\<|\>|\||\./g, '');
            this.checkName();
        },
        part_3_2_google_html: function (value) {
            this.part_3_2_google_html = value.replace(/width=\"(\d*)\"/g, "width='100%'");
        }
    }
});

let ID;
if (ID = location.getValue('id')) {
    document.querySelectorAll('.orgId').forEach( e => {
        e.style.display = '';
    });
    vm.$http.get(`./get?id=${ID}`).then((data) => {
        data.body.part_4_last_save_time = vm.part_4_last_save_time;
        let needResave = false;
        if(typeof data.body.part_3_2_shop_url === "string"){
            data.body.part_3_2_shop_url = [data.body.part_3_2_shop_url];
            needResave = true;
        }
        if(typeof data.body.part_3_2_traffic_url === "string"){
            data.body.part_3_2_traffic_url = [data.body.part_3_2_traffic_url];
            needResave = true;
        }
        if(typeof data.body.part_3_2_floor_url === "string"){
            data.body.part_3_2_floor_url = [data.body.part_3_2_floor_url];
            needResave = true;
        }
        if(needResave){
            alert("需要重新保存")
        }
        // console.log("beforereset");
        vm.resetWithout(data.body);
        // console.log("afterreset");
    }).catch((error) => {
        alert(JSON.stringify(error));
    });
}else{
    document.querySelectorAll('.orgId').forEach( e => {
        e.style.display = 'none';
    });
}
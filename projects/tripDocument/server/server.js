let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');

let server = express();
let analysis = require('./analysis');

module.exports = {
    start: () => {

        analysis.init();

        server.listen(8099);
        server.use(bodyParser.urlencoded({ extended: false }));
        // server.use(express.static('./'));
        // console.log(path.resolve(__dirname, '../static'));
        server.use('/', express.static(path.resolve(__dirname, '../static')));
        server.use('/save', function (req, res) {
            if(req.body.bossId.indexOf("爆操") == -1) {
                return res.status(403).send({
                    result: 0,
                    data: '无权保存'
                });
            }
            // console.log(typeof req.body);
            // console.log(req.body.data);
            analysis.add(JSON.parse(req.body.data)).then(() => {
                res.send({
                    result: 1,
                    data: 'save success!'
                });
            }).catch((e) => {
                res.status(500).send({
                    result: 0,
                    data: e
                });
            });
        });

        server.use('/get', function (req, res) {
            console.log("/get?" + JSON.stringify(req.query));
            analysis.get(req.query.id).then((data) => {
                res.send(data);
            }).catch((e) => {
                res.send(e);
            });
        });

        server.use('/checkName', function (req, res) {
            console.log("/checkName?" + JSON.stringify(req.query));
            analysis.checkName(req.query.id).then((data) => {
                res.send(data);
            }).catch((e) => {
                res.send(e);
            });
        });

        server.use('/list', function (req, res) {
            console.log("/list?");
            res.send(analysis.list());
        });

        server.use('/show', function (req, res) {
            console.log('/show?' + JSON.stringify(req.query));
            analysis.show(req.query.id).then((data) => {
                res.send(data);
            }).catch((e) => {
                res.send(e);
            });
        });

        let startTime = new Date();
        console.log(`${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString()} 启动`);
    }
}
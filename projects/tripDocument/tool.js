class table {
    constructor(data) {
        let col = data.col;
        let body = data.data;
        let table = $(`<table align="center"></table>`);
        if (data.title) {
            table.append(`<tr class='title'><td colspan="${col.length + 1}">${data.title}</td></tr>`);
        }
        let tr = $(`<tr class="thead tr"></tr>`);
        col.forEach(e => {
            tr.append(`<td class="td" width="${e.w}">${e.n}</td>`);
        });
        table.append(tr);
        body.forEach(tds => {
            tr = $(`<tr class="tbody tr"></tr>`);
            let i = 0;
            tds.forEach(e => {
                tr.append(`<td class="td" width="${col[i].w}">${e}</td>`);
                i++;
            });
            table.append(tr);
        });
        return table;
    }
}

location.getValue = function(key){
    if(this.lastUrl !== this.href){
        this.lastUrl = location.href;
        let arr = this.search.replace("?", "").split("&").reduce((org, kv) => {
            org.push(kv.split("="));
            return org;
        }, []);
        this.kvMap = new Map(arr);
    }
    return this.kvMap.get(key);
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
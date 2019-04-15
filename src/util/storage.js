
var storage = {
 
    //存储
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        // localStorage.setItem(key, value);
    },
    //取出数据
    get(key) {
        console.log(localStorage.getItem(key));
        if(localStorage.getItem(key) != 'undefined'){
            return JSON.parse(localStorage.getItem(key));
        }else{
            return '';
        }
        // return JSON.parse(localStorage.getItem(key));
    },
    // 删除数据
     remove(key) {
        localStorage.removeItem(key);
    }
 
}
 
// 暴露给外部访问
export default storage;

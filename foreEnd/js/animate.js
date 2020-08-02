function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else {
        return  getComputedStyle(obj)[attr];
    }
}
function animate(obj, json,callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        var isStop = true;
        for (var attr in json){
            var now = 0;
            if(attr === 'opacity') {
                now = parseFloat(getStyle(obj,attr))*100; // 注意parseInt是向下取整的
            }else {
                now = parseInt(getStyle(obj,attr));
            }
            var speed = (json[attr] - now) / 6;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            var current = now + speed;
            if(attr === 'opacity') {
                obj.style[attr] = current / 100;
            }else {
                obj.style[attr] = current + "px";
            }
            if(json[attr] !== current) {
                isStop = false;
            }
        }
        if(isStop) {
            clearInterval(obj.timer);
            // console.log(callback);
            callback && callback()
        }
    },30);
}
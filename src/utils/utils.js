//全局节流
export function throttle(fn,interval){
    let timer = null
    return function() {
        timer && clearTimeout()
        let _context = this;
        let _args = arguments;
        let callNow = !timer
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(_context, _args);
                timer = null
                }, interval)
            }
        //第一次点击立即执行
        if(callNow) fn.apply(_context,_args)
        };
    }
//全局防抖
export function debounce(fn,delay){
    let timer = null
    return function() {
        let _context = this;
        let _args = arguments;
        if(timer)return;
        if (!timer) {
            timer = setTimeout(function() {
                fn.apply(_context, _args);
                timer = null
                }, delay)
            }
        };
    }

export function getNowDateTime(){
    const time = new Date()
    let YY = time.getFullYear()
    let MM = time.getMonth()+1
    let dd = time.getDay()
    YY = YY <10?'0'+YY:YY
    MM = MM <10?'0'+MM:MM 
    dd = dd <10?'0'+dd:dd
    return `${YY}-${MM}-${dd} ${getNowTime()}`
}

export function getNowTime(){
    const time = new Date()
    let hh = time.getHours()
    let mm = time.getMinutes()
    let ss = time.getSeconds()
    hh = hh < 10?'0'+hh:hh 
    mm = mm < 10?'0'+mm:mm 
    ss = ss < 10?'0'+ss:ss
    return `${hh}:${mm}:${ss}`
}

//格式化秒级时间
export function formatTime(t){
    if(isNaN(t)) return "--"
    let remainingTimestamp = Math.ceil(t)
    let hh = parseInt(remainingTimestamp/60/60)
    let mm = parseInt(remainingTimestamp/60%60)
    let ss = parseInt(remainingTimestamp%60)
    hh = hh < 10?'0'+hh:hh 
    mm = mm < 10?'0'+mm:mm 
    ss = ss < 10?'0'+ss:ss
    return `${hh}:${mm}:${ss}`
}

//格式化毫秒级时间
export function formatMillisecondTime(t){
    let remainingTimestamp = t/1000
    let hh = parseInt(remainingTimestamp/60/60)
    let mm = parseInt(remainingTimestamp/60%60)
    let ss = parseInt(remainingTimestamp%60)
    mm = mm < 10?'0'+mm:mm 
    ss = ss < 10?'0'+ss:ss
    if(hh <= 0){
        return `${mm}:${ss}`
    }
    return `${hh}:${mm}:${ss}`
}
export default{throttle,debounce}
//添加类名
export function addClass(el, className) {
    //若类名不存在则添加新类名
    if (!hasClass(el, className)) {
        let newClass = el.className.split(' ');
        newClass.push(className);
        el.className = newClass.join(' ');
    }
}
//判断类名是否存在
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className)
}
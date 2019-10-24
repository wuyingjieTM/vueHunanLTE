const dealStr = {
    // 去掉字符串前后空格
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 換行
    changeLine(str, sym) {
        const symble = sym || null;
        return str.split(symble).join('\r\n');
    },
    // 获取字符串中的数字
    getNum(str) {
        str = str + '';
        return str.replace(/[^0-9]/ig, "");
    }
}
export {
    dealStr
}
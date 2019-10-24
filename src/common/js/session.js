const storageProject = {
    // 设置本地存储
    setStorage(key, val) {
        sessionStorage.setItem(key, val);
    },
    // 获取本地存储
    getStorage(key) {
        return sessionStorage.getItem(key);
    }
}

export {
    storageProject
}

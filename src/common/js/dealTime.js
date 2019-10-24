const dealTime = {
    // 判断时间是否小于10
    isAddZero(time) {
        time = time < 10 ? "0" + time : time;
        return time;
    },
    // 获取本机当前时间
    localTime() {
        const localTime = new Date();
        const localYear = localTime.getFullYear();
        const localMonth = localTime.getMonth() + 1;
        const localDay = localTime.getDate();
        return localYear + '-' + this.isAddZero(localMonth) + '-' + this.isAddZero(localDay);
    },
    //   获取想要的某天具体日期
    setTime(timeObj) {
        const d = new Date(timeObj.curTime);
        if (timeObj.days)
        {
            d.setDate(d.getDate() + timeObj.days);
        }
        if (timeObj.months)
        {
            d.setMonth(d.getMonth() + timeObj.months);
        }
        if (timeObj.years)
        {
            d.setFullYear(d.getFullYear() + timeObj.years);
        }
        let month = d.getMonth() + 1;
        let day = d.getDate();
        month = this.isAddZero(month);
        day = this.isAddZero(day);
        const val = d.getFullYear() + "-" + month + "-" + day;
        return val;
    },
    // 获取某一段时间
    getQuantumTime(obj) {
        const dateList = [];
        for (let i = 0; i < obj.dataNum; i++)
        {
            dateList.push(
                dealTime.setTime({
                    curTime: obj.curTime,
                    days: -i
                })
            );
        }
        return dateList;
    }
}


export {
    dealTime
}

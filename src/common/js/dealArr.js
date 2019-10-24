const dealArr = {
    // 传进来一个对象，转成json的形式   
    //  {张三：18,李四:16}} ----> [{张三：18},{李四：16}]
    mapToArray(someObject) {
        const newArr = [];
        for (var key of Object.keys(someObject))
        {
            const itemObj = {};
            itemObj[key] = someObject[key];
            newArr.push(itemObj);
        }
        return newArr;
    },
    // { 1：{42342:[],  2：{532432:[]}}---->[{key:42342,value:[]},{key:532432,value:[]}]
    objToobj(someObject) {
        const arr = [];
        for (var key of Object.keys(someObject))
        {
            for (var curKey of Object.keys(someObject[key]))
            {
                arr.push({
                    index: key,
                    key: curKey,
                    value: someObject[key][curKey],
                })
            }
        }
        return arr;
    },
    // 传进来一个对象，转成json的形式   
    //  {张三：18,李四:16} ----> [{name：张三,value:18},{name：李四,value:16}]
    mapToJson(someObject) {
        const newArr = [];
        for (var key of Object.keys(someObject))
        {
            const itemObj = {};
            itemObj.name = key;
            itemObj.value = someObject[key];
            newArr.push(itemObj);
        }
        return newArr;
    },
    // [{ name: "河南",value: 94},{ name:"四川",value:804}]--->{xData:[],yData:[]}
    toEchartData(someObject) {
        const obj = {
            xData: [],
            yData: [],
        };
        for (let item of someObject.data)
        {
            obj.xData.push(item[someObject.key || "name"]);
            obj.yData.push(item[someObject.val || "value"]);
        }
        return obj;
    },

    // 将json转化为：key和val两个数组 
    // [{ 张三：18}]---> { key: [张三], val: [18] }
    jsonToArr(someObject) {
        const keyVal = {
            key: [],
            val: []
        };
        for (let item of someObject)
        {
            for (var key of Object.keys(item))
            {

                keyVal.key.push(key);
                keyVal.val.push(item[key]);
            }
        }
        return keyVal;
    },

    // 获取数组的最大值
    getMax(arr) {
        return Math.max(...arr);
    },
    // 获取数组的最小值
    getMin(arr) {
        return Math.min(...arr);
    },
    // echart柱状图排序(默认为降序：)
    echartSort(xData, yData, isUp) {
        for (var i = 0; i < yData.length - 1; i++)
        {
            for (var j = i + 1; j < yData.length; j++)
            {
                // 升序
                if (isUp)
                {
                    if (yData[i] > yData[j])
                    { //如果前面的数据比后面的大就交换
                        var temp = yData[i];
                        var tempNext = xData[i];
                        yData[i] = yData[j];
                        yData[j] = temp;
                        xData[i] = xData[j];
                        xData[j] = tempNext;
                    }
                } else//降序
                {
                    if (yData[i] < yData[j])
                    { //如果前面的数据比后面的大就交换
                        var temp = yData[i];
                        var tempNext = xData[i];
                        yData[i] = yData[j];
                        yData[j] = temp;
                        xData[i] = xData[j];
                        xData[j] = tempNext;
                    }

                }
            }
        }
    },
    // 生成下拉框
    createDown: function (data, disabledText) {
        const arr = [];
        for (let item of data)
        {
            if (disabledText == item)
            {
                arr.push({ value: item, label: item})

            } else
            {
                arr.push({ value: item, label: item })

            }
        }
        return arr;
    },
    // 去掉字符串前后空格
    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    // 換行
    changeLine(str, sym) {
        const symble = sym || null;
        return str.split(symble).join('\r\n');
    }
}

export {
    dealArr
}
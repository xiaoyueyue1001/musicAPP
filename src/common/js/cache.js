const SEARCH_HISTORY_KEY = '__search__'
const SEARCH_HISYORY_MAX_LEN = 5

let myLocalStorage = {
    set(key, value) {
        let valueStr = JSON.stringify(value)
        localStorage.setItem(key, valueStr);
    },
    get(key, value) {
        let list = localStorage.getItem(key)
        if (list === null) {
            //为取到值的时候返回默认值
            return value
        }
        else {
            return JSON.parse(list)
        }

    }
}


export function saveSearchHistory(value) {
    let list = myLocalStorage.get(SEARCH_HISTORY_KEY, [])
    let index = list.indexOf(value);
    if (index === -1) {
        //若添加的元素不存在
        list.unshift(value)
    }
    else {
        list.splice(index, 1)
        list.unshift(value)
    }

    if (list.length > SEARCH_HISYORY_MAX_LEN) {
        list.pop();
    }

    myLocalStorage.set(SEARCH_HISTORY_KEY, list)

    return list
}

export function getSearchHistory() {
    return myLocalStorage.get(SEARCH_HISTORY_KEY, [])
}
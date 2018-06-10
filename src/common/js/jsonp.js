import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
    url = url + (url.indexOf('?') < 0 ? '?' : '&') + params(data);
    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, res) => {
            if (!err) {
                resolve(res);
            }
            else {
                reject(err);
            }
        })
    })
}

function params(data) {
    let url = "";
    for (var key in data) {
        let value = data[key] === undefined ? "" : data[key];
        url += `&${key}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
}
import { get } from "lodash";
import { CONFIG_SHOW } from "../constant";

export function getNotificationBody(body) {
    let result = `<div style="color: #f0f0f0">`
    for (const property in body) {
        if (body.hasOwnProperty(property)) {
            if (body[property]) {
                result += `${body[property]}`
            }
        }
    }
    result += `</div>`
    return result;
}

// 根据CONFIG_SHOW的属性值获取Object的属性值。
export function getValueByConfig(obj, key) {
    if (!key) {
        return null
    }
    const T_key = get(CONFIG_SHOW, [key])
    if (Array.isArray(T_key)) {
        let result = null
        for (const item in T_key) {
            result = result && get(obj, T_key[item]) ? result + ' ' + get(obj, T_key[item]) : result || get(obj, T_key[item])
        }
        return result
    }
    return get(obj, T_key)
}
import { get } from "lodash";
import { CONFIG_SHOW } from "../constant";
import parsePhoneNumberFromString from "libphonenumber-js";

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

export function formatDescription(str, params) {
    const regex = /\[([a-zA-Z]+)\]/g;
    return str?.replace(regex, (match, capture) => {
        return get(params, capture) || ''
    });
}

export const startWithHttpsReg = /^(https?:\/\/)\s*/ // 判断是否http开头,支持ipv6
export function testStartWithHttps(value) {
    return value && startWithHttpsReg.test(value)
}

export const endWithSugarReg = /^\S+\/sugarcrm$/ // 判断是否以 / sugarcrm结束
export const testEndWithPort = (value) => {
    return value && endWithSugarReg.test(value)
}


/**
 * 检查是否以https开头，若不是在首位补全
 */
export function checkServerAddress(serverAddr) {
    const protocol = 'http://'
    const sugarcrm$ = '/sugarcrm'
    let serverAddress = serverAddr.trim()
    serverAddress = serverAddress.replace(/\/+$/g, '').toLowerCase()

    if (!testStartWithHttps(serverAddress)) {
        serverAddress = `${protocol}${serverAddr}`
    }

    if (!testEndWithPort(serverAddress)) {
        serverAddress = `${serverAddress}${sugarcrm$}`
    }

    return serverAddress
}

export const formatPhoneNumber = (phone) => {
    if (!phone) return phone;
    // 使用 libphonenumber 解析电话号码
    const parsedPhoneNumber = parsePhoneNumberFromString(phone);
    if (parsedPhoneNumber) {
        // 获取格式化后的号码
        return parsedPhoneNumber.formatInternational();
    } else {
        // 如果解析失败，返回原始号码
        return phone;
    }
}
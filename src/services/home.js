import { stringify } from 'qs';
import { MODULE_TYPE, SESSION_STORAGE_KEY } from "../constant";
import request from '../utils/request';

export function getContact(callNum) {
    const host = sessionStorage.getItem('host');
    const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY.sessionId);
    const rest_data = {
        session: sessionId,
        search_string: callNum,
        modules: [MODULE_TYPE.contact, MODULE_TYPE.account, MODULE_TYPE.lead, MODULE_TYPE.employees],
        select_fields: ['id', 'name', 'title', 'department']
    };
    const params = {
        method: 'search_by_module', input_type: 'JSON', response_type: 'JSON', rest_data: JSON.stringify(rest_data),
    };
    return request(`${host}/service/v4_1/rest.php`, {
        method: 'POST', body: stringify(params)
    })
}

export function getFullInfo({ module, id }) {
    const host = sessionStorage.getItem('host');
    const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY.sessionId);
    const rest_data = {
        session: sessionId,
        modules_name: module,
        id,
    };
    const params = {
        method: 'get_entry', input_type: 'JSON', response_type: 'JSON', rest_data: JSON.stringify(rest_data),
    };
    return request(`${host}/service/v4_1/rest.php`, {
        method: 'POST', body: stringify(params)
    })
}

export function post(params) {
    const host = sessionStorage.getItem('host');
    return request(`${host}/service/v4_1/rest.php`, {
        method: 'POST', body: stringify(params)
    })
}

export function get(params) {
    const host = sessionStorage.getItem('host');
    return request(`${host}/service/v4_1/rest.php${stringify(params)}`)
}
import { stringify } from 'qs';
import { SESSION_STORAGE_KEY } from '@/constant'
import request from '@/utils/request';

export function getUserInfo(userId) {
    const host = sessionStorage.getItem('host');
    const sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY.sessionId);
    const rest_data = {
        session: sessionId,
        modules_name: "Users",
        id: userId,
    };
    const params = {
        method: 'get_entry', input_type: 'JSON', response_type: 'JSON', rest_data: JSON.stringify(rest_data),
    };
    return request(`${host}/service/v4_1/rest.php`, {
        method: 'POST', body: stringify(params)
    })
}


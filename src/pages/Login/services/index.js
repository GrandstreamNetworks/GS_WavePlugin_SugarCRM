import { stringify } from 'qs';
import request from '../../../utils/request';

export function login(params) {
    const host = sessionStorage.getItem('host');
    return request(`${host}/service/v4_1/rest.php`, {
        method: 'POST',
        body: stringify(params)
    });
}
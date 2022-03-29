import md5 from "js-md5";
import { get } from 'lodash';
import { SESSION_STORAGE_KEY } from "@/constant";
import { login } from '../services';

export default {
    namespace: 'login', state: {},

    effects: {
        * login({ payload }, { call, put }) {
            const { username, password } = payload;
            const rest_data = {
                user_auth: {
                    user_name: username,
                    password: md5(password),
                    application_name: 'RestCall',
                    name_value_list: [],
                }
            }
            const params = {
                method: 'login',
                input_type: 'JSON',
                response_type: 'JSON',
                rest_data: JSON.stringify(rest_data),
            }
            const res = yield call(login, params);
            const user_id = get(res, ['name_value_list', 'user_id', 'value']);
            sessionStorage.setItem(SESSION_STORAGE_KEY.sessionId, res?.id);
            yield put({
                type: 'global/save',
                payload: {
                    sessionId: res?.id,
                    connectState: res?.code || 'SUCCESS',
                    user_id,
                }
            })
            return res;
        },
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};

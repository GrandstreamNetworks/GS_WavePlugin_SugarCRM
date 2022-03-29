import { get } from 'lodash'
import { getUserInfo } from '@/services/global';

export default {
    namespace: 'global', state: {
        userConfig: {}, sessionId: '', connectState: 'SUCCESS', user: {}, user_id: ''
    },

    effects: {
        * getUserInfo({ payload }, { call, put }) {
            const res = yield call(getUserInfo, payload);
            const user = {};
            user.id = get(res, ['entry_list', 0, 'id']);
            user.name = get(res, ['entry_list', 0, 'name_value_list', 'full_name', 'value']);
            yield put({
                type: 'global/save', payload: {
                    connectState: res?.code || 'SUCCESS',
                    user,
                }
            })
            return res;
        },

        * saveUserConfig({ payload }, { put }) {
            console.log(payload);
            pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(payload) }, function ({ errorCode }) {
                console.log(errorCode);
            })
            yield put({
                type: 'save', payload: {
                    userConfig: payload
                },
            })
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};

import { get } from 'lodash'
import { history } from 'umi'
import { getUserInfo } from '@/services/global'

export default {
    namespace: 'global', state: {
        userConfig: {},
        sessionId: '',
        connectState: 'SUCCESS',
        user: {},
        user_id: '',
        tokenInfo: {},
        uploadCall: true,
        showConfig: {},
        callState: new Map(),
    },

    effects: {
        * getUserInfo({ payload }, { call, put }) {
            const res = yield call(getUserInfo, payload);
            const user = {};
            user.id = get(res, ['entry_list', 0, 'id']);
            user.name = get(res, ['entry_list', 0, 'name_value_list', 'full_name', 'value']);
            if (user.id) {
                yield put({
                    type: 'global/save', payload: {
                        connectState: res?.code || 'SUCCESS', user,
                    }
                })
            }
            else {
                yield put({
                    type: 'global/save', payload: {
                        connectState: res?.code || 'SUCCESS',
                    }
                })
            }
            return res;
        },

        * uploadCallChange({ payload }, { put, select }) {
            const { userConfig } = yield select((state) => state.global)
            userConfig.uploadCall = payload
            yield put({
                type: 'saveUserConfig', payload: userConfig,
            })
            yield put({
                type: 'save', payload: {
                    uploadCall: payload,
                }
            })
        },

        * saveShowConfig({ payload }, { put, select }) {
            const { userConfig } = yield select((state) => state.global)
            console.log(userConfig)
            userConfig.showConfig = payload
            yield put({
                type: 'saveUserConfig', payload: userConfig,
            })
            yield put({
                type: 'save', payload: {
                    showConfig: payload,
                }
            })
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
        },

        * logout(_, { put, select }) {
            const { userConfig } = yield select((state) => state.global)
            userConfig.autoLogin = false;
            userConfig.tokenInfo.password = undefined;
            yield put({
                type: 'saveUserConfig', payload: userConfig,
            })
            history.replace({ pathname: '/login' })
        }

    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
};

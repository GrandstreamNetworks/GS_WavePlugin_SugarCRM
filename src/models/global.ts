import { getUserInfo } from '@/services/global';
import { get } from 'lodash';
import { Effect, Reducer, history } from 'umi';

export interface GlobalModelState {
    user: LooseObject
    userConfig: LooseObject
    sessionId: string
    connectState: string
    user_id: string
}

export interface GlobalModelType {
    namespace: string
    state: GlobalModelState
    effects: {
        getUserInfo: Effect
        userConfigChange: Effect
        saveUserConfig: Effect
        logout: Effect
    }
    reducers: {
        save: Reducer<GlobalModelState>
    }
}


const globalModel: GlobalModelType = {
    namespace: 'global', state: {
        userConfig: {},
        sessionId: '',
        connectState: 'SUCCESS',
        user: {},
        user_id: '',
    },

    effects: {
        * getUserInfo({ payload }, { call, put }): any {
            const res = yield call(getUserInfo, payload);
            const user: LooseObject = {};
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

        * userConfigChange({ payload }, { put, select }) {
            const { userConfig } = yield select((state: any) => state.global);
            const newConfig = {
                ...userConfig,
                ...payload,
            }
            yield put({
                type: 'saveUserConfig',
                payload: newConfig,
            })
        },


        * saveUserConfig({ payload }, { put }) {
            console.log(payload);
            // @ts-ignore
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
            const { userConfig } = yield select((state: any) => state.global)
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

export default globalModel;

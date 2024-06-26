import { ACTION_TYPE, MODULE_TYPE } from '@/constant';
import { getContact, getFullInfo, post } from '@/services/home';
import { get } from 'lodash';

export default {
    namespace: 'home', state: {},

    effects: {
        * getContact({ payload }, { call, put }) {
            console.log("payload", payload)
            const { userConfig, callNum } = payload;
            let res = yield call(getContact, callNum);
            if (res === null || res?.name === "Invalid Login") {
                const login = yield put({
                    type: 'login/login', payload: userConfig,
                })
                yield call(() => login);
                res = yield call(getContact, callNum);
            }
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'global/save', payload: { connectState: connectState, }
            })
            const contactInfo = {
                displayNotification: connectState === 'SUCCESS',
            };
            const { entry_list = [] } = res;

            /**
             * 取出查询到的联系人
             * 根据号码查询，只会查询到一个联系人，所以取第一个
             */
            entry_list.forEach(item => {
                console.log(item);
                console.log(item?.records?.length)
                if (item?.records?.length && contactInfo.module !== MODULE_TYPE.contact) {
                    contactInfo.module = get(item, 'name');
                    contactInfo.record = get(item, ['records', 0, 'id', 'value']);
                }
            });
            console.log(contactInfo);
            if (contactInfo.record) {
                const params = {
                    id: contactInfo.record, module: contactInfo.module,
                }
                const fullInfo = yield call(getFullInfo, params);
                contactInfo.name = get(fullInfo, ['entry_list', 0, 'name_value_list', 'name', 'value']);
                contactInfo.title = get(fullInfo, ['entry_list', 0, 'name_value_list', 'title', 'value']);
                contactInfo.department = get(fullInfo, ['entry_list', 0, 'name_value_list', 'department', 'value']);
                contactInfo.fax = get(fullInfo, ['entry_list', 0, 'name_value_list', 'phone_fax', 'value']);
                contactInfo.description = get(fullInfo, ['entry_list', 0, 'name_value_list', 'description', 'value']);
                contactInfo.email = get(fullInfo, ['entry_list', 0, 'name_value_list', 'email1', 'value']);
                contactInfo.action = ACTION_TYPE.detail;
            }
            return contactInfo;
        },

        * putCallInfo({ payload }, { call, put }) {
            const res = yield call(post, payload);
            yield put({
                type: 'global/save', payload: {
                    connectState: res?.code || 'SUCCESS',
                }
            })
            return res;
        },

        * createContact({ payload }, { call, put }) {
            const res = yield call(post, payload.params);
            yield put({
                type: 'global/save', payload: {
                    connectState: res?.code || 'SUCCESS',
                }
            })
            const contactInfo = {
                name: get(res, ['entry_list', 'name', 'value']),
                record: get(res, ['id']),
                module: payload.attributesType,
                action: ACTION_TYPE.detail,
            }
            return contactInfo;
        }

    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload }
        }
    }
}
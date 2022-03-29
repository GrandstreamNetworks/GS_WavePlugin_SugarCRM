import React, { useEffect, useRef } from 'react';
import { connect, history, useIntl } from 'umi';
import { Button, Col, Row } from 'antd';
import { stringify } from 'qs';
import moment from 'moment-timezone';
import { ConnectError, ConnectState, Footer, SwitchBtn } from '@/components';
import {
    ACTION_TYPE, DATE_FORMAT, EVENT_KEY, MODULE_TYPE, SESSION_STORAGE_KEY, WAVE_CALL_TYPE
} from '@/constant';
import { getNotificationBody } from '@/utils/utils';
import styles from './index.less';


const HomePage = ({ getContact, putCallInfo, saveUserConfig, userConfig, sessionId, }) => {
    const { formatMessage } = useIntl();

    const host = sessionStorage.getItem(SESSION_STORAGE_KEY.host);

    const callNumber = useRef(null);

    /**
     * 登出
     */
    const logoutClick = () => {
        const config = JSON.parse(JSON.stringify(userConfig));
        config.autoLogin = false;
        config.password = undefined;
        saveUserConfig(config);
        history.replace({ pathname: '/login' });
    };

    /**
     * 通过号码获取联系人
     */
    const getContactByCallNum = callNum => {
        const params = {
            callNum, userConfig
        }
        return getContact(params);
    };

    /**
     * 上报通话信息
     */
    const uploadCallInfo = (callNum, callStartTimeStamp, callEndTimeStamp, callDirection) => {
        if (!userConfig.uploadCall) {
            return;
        }
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContactByCallNum(callNum).then(contactInfo => {
            if (!contactInfo?.record) {
                return;
            }
            const duration = callEndTimeStamp - callStartTimeStamp;
            const name_value_list = {
                direction: callDirection,
                status: 'Held',
                name: `${contactInfo.name} 's call`,
                date_start: moment(callStartTimeStamp || undefined).utc().format(DATE_FORMAT.format_2),
                parent_id: contactInfo.record,
                parent_name: contactInfo.name,
                parent_type: contactInfo.module,
                duration_minutes: moment.duration(duration).asMinutes(),
            };

            const rest_data = {
                session: sessionId, module_name: 'Calls', name_value_list,
            };

            const params = {
                method: 'set_entry', input_type: 'JSON', response_type: 'JSON', rest_data: JSON.stringify(rest_data),
            };

            putCallInfo(params).then(res => {
                console.log(res);
            });
        });
    };

    /**
     * 获取sugarCRM系统URL
     */
    const getUrl = info => {
        return `${host}/index.php?${stringify(info)}`;
    };

    /**
     * 根据callNum获取联系人信息
     * 调用wave接口，打开通知窗口，展示相应信息
     * @param callNum 号码
     */
    const initCallInfo = callNum => {
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContactByCallNum(callNum).then(contact => {
            console.log('getContact', contact);
            if (!contact?.displayNotification) {
                return;
            }
            /**
             * 跳转至新建联系人的参数
             * @type {{module: string, phone_work: string, action: string}}
             */
            const defContact = {
                module: MODULE_TYPE.contact, action: ACTION_TYPE.edit, phone_work: callNum,
            };
            let url = getUrl(defContact);
            if (contact && contact.record) {
                url = getUrl(contact);
            }
            const name = contact?.name;
            const department = contact?.department;
            const title = contact?.title;
            const job = department && title ? department + '|' + title : department || title;
            const pluginPath = sessionStorage.getItem('pluginPath');
            const body = {
                logo: `<div style="margin-bottom: 12px"><img src="${pluginPath}/sugar.svg" alt=""/> Sugar CRM</div>`,
                info: name ? `<div style="font-weight: bold; text-overflow: ellipsis; white-space:nowrap; overflow: hidden">${name}</div>` : null,
                PhoneNumber: `<div style="font-weight: bold; text-overflow: ellipsis; white-space:nowrap; overflow: hidden">${callNum}</div>`,
                title: job ? `<div style="font-weight: bold; text-overflow: ellipsis; white-space:nowrap; overflow: hidden">${job}</div>` : null,
                action: `<div style="margin-top: 10px;display: flex;justify-content: flex-end;"><button style="background: none; border: none;">
                             <a href=${url} target="_blank" style="color: #62B0FF">
                                 ${contact?.record ? formatMessage({ id: 'home.detail' }) : formatMessage({ id: 'home.edit' })}
                             </a>
                         </button></div>`
            };

            console.log('displayNotification');
            pluginSDK.displayNotification({
                notificationBody: getNotificationBody(body),
            })
        });
    };

    useEffect(() => {
        /**
         * 监听收到语音/视频来电
         * 回调函数参数：callType,callNum
         */
        pluginSDK.eventEmitter.on(EVENT_KEY.recvP2PIncomingCall, function ({ callType, callNum }) {
            console.log('onRecvP2PIncomingCall', callType, callNum);
            callNumber.current = callNum
            initCallInfo(callNum);
        });

        /**
         * 监听wave发起语音/视频
         * 回调函数参数：callType,callNum
         */
        pluginSDK.eventEmitter.on(EVENT_KEY.initP2PCall, function ({ callType, callNum }) {
            console.log('onHangupP2PCall', callType, callNum);
            callNumber.current = callNum
            initCallInfo(callNum);
        });

        return function cleanup() {
            pluginSDK.eventEmitter.off(EVENT_KEY.recvP2PIncomingCall);

            pluginSDK.eventEmitter.off(EVENT_KEY.initP2PCall);
        };
    }, []);

    useEffect(() => {
        /**
         * 监听拒绝语音/视频
         * 回调函数参数：callType,callNum
         */
        pluginSDK.eventEmitter.on(EVENT_KEY.rejectP2PCall, function ({ callType, callNum }) {
            console.log('onRejectP2PCall', callType, callNum);
            uploadCallInfo(callNum, 0, 0, WAVE_CALL_TYPE.in);
            if (callNumber.current === callNum) {
                pluginSDK.hideNotification();
            }
        });

        /**
         * 监听挂断语音/视频
         * 回调函数参数：callType,callNum
         */
        pluginSDK.eventEmitter.on(EVENT_KEY.hangupP2PCall, function (data) {
            console.log('onHangupP2PCall', data);
            let { callNum, callStartTimeStamp, callEndTimeStamp, callDirection } = data;
            callDirection = callDirection === 'in' ? WAVE_CALL_TYPE.in : WAVE_CALL_TYPE.out;
            uploadCallInfo(callNum, callStartTimeStamp ?? 0, callEndTimeStamp ?? 0, callDirection);
            if (callNumber.current === callNum) {
                pluginSDK.hideNotification();
            }
        });

        pluginSDK.eventEmitter.on(EVENT_KEY.p2PCallCanceled, function ({ callType, callNum }) {
            console.log('p2PCallCanceled', callType, callNum);
            uploadCallInfo(callNum, 0, 0, WAVE_CALL_TYPE.miss);
            if (callNumber.current === callNum) {
                pluginSDK.hideNotification();
            }
        });

        return function cleanUp() {
            pluginSDK.eventEmitter.off(EVENT_KEY.rejectP2PCall);

            pluginSDK.eventEmitter.off(EVENT_KEY.hangupP2PCall);

            pluginSDK.eventEmitter.off(EVENT_KEY.p2PCallCanceled);
        }
    }, [userConfig, sessionId])

    return (
        <>
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <div className={styles.callConfig}>
                    <Row>
                        <Col span={19}>
                            <span className={styles.spanLabel}>{formatMessage({ id: 'home.Synchronize' })}</span>
                        </Col>
                        <Col span={4}>
                            <SwitchBtn />
                        </Col>
                    </Row>
                </div>
                <Button onClick={logoutClick}>{formatMessage({ id: 'home.logout' })}</Button>
            </div>
            <Footer url={`${host}/index.php`} message={formatMessage({ id: 'home.toCRM' })} />
        </>
    );
};

export default connect(({ global }) => ({
    userConfig: global.userConfig, sessionId: global.sessionId,
}), (dispatch) => ({
    getContact: payload => dispatch({
        type: 'home/getContact', payload,
    }), putCallInfo: payload => dispatch({
        type: 'home/putCallInfo', payload
    }), saveUserConfig: payload => dispatch({
        type: 'global/saveUserConfig', payload,
    }), save: payload => dispatch({
        type: 'global/save', payload,
    }),
}))(HomePage);
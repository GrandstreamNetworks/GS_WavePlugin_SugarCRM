import React, { useCallback } from 'react';
import { connect, useIntl } from 'umi';
import { stringify } from 'qs';
import moment from 'moment-timezone';
import { ConnectError, ConnectState, Footer, ConfigBlock, CallAction } from '@/components';
import { ACTION_TYPE, DATE_FORMAT, MODULE_TYPE, SESSION_STORAGE_KEY } from '@/constant';
import { getNotificationBody, getValueByConfig } from '@/utils/utils';
import styles from './index.less';


const HomePage = ({ getContact, putCallInfo, uploadCall, sessionId, tokenInfo, showConfig, callState }) => {
    const { formatMessage } = useIntl();

    const host = sessionStorage.getItem(SESSION_STORAGE_KEY.host);

    /**
     * 通过号码获取联系人
     */
    const getContactByCallNum = callNum => {
        const params = {
            callNum, userConfig: tokenInfo,
        }
        return getContact(params);
    };

    /**
     * 上报通话信息
     */
    const uploadCallInfo = useCallback((callNum, callStartTimeStamp, callEndTimeStamp, callDirection) => {
        if (!uploadCall) {
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
    }, [uploadCall, sessionId, tokenInfo]);

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
    const initCallInfo = useCallback(callNum => {
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContactByCallNum(callNum).then(contact => {
            console.log("callState", callState);
            if (!contact?.displayNotification || !callState.get(callNum)) {
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
            const pluginPath = sessionStorage.getItem('pluginPath');

            const body = {
                logo: `<div style="margin-bottom: 12px"><img src="${pluginPath}/sugar.svg" alt=""/> Sugar CRM</div>`,
            }

            // 根据自定义信息，添加body属性
            if (contact?.record) {
                // 将showConfig重复的删除
                const configList = [...new Set(Object.values(showConfig))]
                console.log(configList)
                for (const key in configList) {
                    console.log(configList[key])
                    if (!configList[key]) {
                        continue;
                    }

                    // 取出联系人的信息用于展示
                    const configValue = getValueByConfig(contact, configList[key]);
                    console.log(configValue);
                    if (configList[key] === 'Phone') {
                        body[`config_${key}`] = `<div style="font-weight: bold">${callNum}</div>`
                    }
                    else if (configValue) {
                        body[`config_${key}`] = `<div style="font-weight: bold; display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 5;overflow: hidden;word-break: break-all;text-overflow: ellipsis;">${configValue}</div>`
                    }
                }
            }
            else {
                body.phone = `<div style="font-weight: bold;">${callNum}</div>`
            }
            body.action = `<div style="margin-top: 10px;display: flex;justify-content: flex-end;"><button style="background: none; border: none;">
                     <a href=${url} target="_blank" style="color: #62B0FF">
                         ${contact?.record ? formatMessage({ id: 'home.detail' }) : formatMessage({ id: 'home.edit' })}
                     </a>
                 </button></div>`;

            console.log('displayNotification');
            pluginSDK.displayNotification({
                notificationBody: getNotificationBody(body),
            })
        });
    }, [tokenInfo, showConfig, callState]);

    return (
        <>
            <CallAction initCallInfo={initCallInfo} uploadCallInfo={uploadCallInfo} />
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <ConfigBlock />
            </div>
            <Footer url={`${host}/index.php`} message={formatMessage({ id: 'home.toCRM' })} />
        </>
    );
};

export default connect(
    ({ global }) => ({
        sessionId: global.sessionId,
        tokenInfo: global.tokenInfo,
        uploadCall: global.uploadCall,
        showConfig: global.showConfig,
        callState: global.callState,
    }),
    (dispatch) => ({
        getContact: payload => dispatch({
            type: 'home/getContact', payload,
        }),
        putCallInfo: payload => dispatch({
            type: 'home/putCallInfo', payload
        })
    })
)(HomePage);
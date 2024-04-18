import { Footer } from '@/components';
import { AUTO_CREATE_CONFIG_DEF, LOGIN_KEYS, NOTIFICATION_CONFIG_DEF, SESSION_STORAGE_KEY, UPLOAD_CALL_CONFIG_DEF } from '@/constant';
import { checkServerAddress } from '@/utils/utils';
import { Button, Checkbox, Form, Image, Input } from 'antd';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Dispatch, Loading, connect, history, useIntl } from 'umi';
import AccountIcon from '../../asset/login/account-line.svg';
import CodeIcon from '../../asset/login/code-line.svg';
import CloseIcon from '../../asset/login/password-close.svg';
import OpenIcon from '../../asset/login/password-open.svg';
import HostIcon from '../../asset/login/service-line.svg';
import styles from './index.less';

interface Props {
    login: (payload: LooseObject) => Promise<LooseObject>
    saveUserConfig: (payload: LooseObject) => void
    loginLoading: boolean | undefined
    getUserInfo: (payload: LooseObject) => Promise<LooseObject>
}

/**
 * 登录页
 * 需要用户输入相关信息，获取鉴权
 * hostAddress: 部署的sugarCRM服务地址
 * username: 用户名
 * password: 用户密码
 * @constructor
 */
const IndexPage: React.FC<Props> = ({ login, saveUserConfig, loginLoading = false, getUserInfo }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [remember, setRemember] = useState(true);
    const [form] = Form.useForm();
    const { formatMessage } = useIntl();
    const config = useRef({})

    /**
     * 自动登录状态更改
     * @param e
     */
    const onCheckChange = (e: any) => {
        setRemember(e.target.checked);
    };

    const onfocus = () => {
        setErrorMessage('');
    }

    /**
     * 登录成功，页面跳转
     * 跳转home页
     */
    const loginSuccess = () => {
        history.replace({ pathname: '/home' });
    }

    /**
     * 获取用户信息
     * @param {string} user_id
     */
    const getUser = (values: LooseObject) => {
        getUserInfo(values.user_id).then(() => {
            const data = {
                tokenInfo: {
                    ...values.tokenInfo,
                    password: remember ? values.tokenInfo.password : undefined,
                },
                autoLogin: remember,
                uploadCall: values.uploadCall ?? true,
                notification: values.notification ?? true,
                autoCreate: values.autoCreate ?? false,
                autoCreateConfig: values.autoCreateConfig ?? AUTO_CREATE_CONFIG_DEF,
                uploadCallConfig: values.uploadCallConfig ?? UPLOAD_CALL_CONFIG_DEF,
                notificationConfig: values.notificationConfig ?? NOTIFICATION_CONFIG_DEF,
            }
            saveUserConfig(data)
            loginSuccess();
        });
    }

    const onFinish = (values: LooseObject) => {
        let hostAddress = values.tokenInfo?.hostAddress || values.hostAddress;
        hostAddress = checkServerAddress(hostAddress);
        sessionStorage.setItem(SESSION_STORAGE_KEY.host, hostAddress);

        login({ ...values.tokenInfo, ...values }).then(res => {
            if (res?.error) {
                setErrorMessage(res?.error);
                return;
            }
            if (!res.id) {
                setErrorMessage('error.userInfo');
                return;
            }
            const user_id = get(res, ['name_value_list', 'user_id', 'value']);

            getUser({
                ...config.current,
                user_id,
                tokenInfo: {
                    ...values,
                },
                ...values,
            });
        })
    };

    /**
     * 调用wave接口，获取用户信息，自动登录
     */
    useEffect(() => {
        // @ts-ignore
        pluginSDK.userConfig.getUserConfig(function ({ errorCode, data }) {
            console.log(errorCode, data);
            if (errorCode === 0 && data) {
                const userConfig = JSON.parse(data);
                console.log(userConfig);
                config.current = userConfig;
                form.setFieldsValue(userConfig?.tokenInfo);

                // 已登录的与预装配置进行对比
                let sameConfig = true;

                // 有预装配置 走预装配置
                const preParamObjectStr = sessionStorage.getItem('preParamObject');
                if (preParamObjectStr) {
                    const preParamObject = JSON.parse(sessionStorage.getItem('preParamObject') || '');
                    if (preParamObject) {
                        const formParams: LooseObject = {};
                        Object.keys(preParamObject).forEach((item) => {
                            LOGIN_KEYS.forEach((element) => {
                                if (item.toLowerCase() === element.toLowerCase()) {
                                    formParams[element] = preParamObject[item];
                                    if (!sameConfig) {
                                        return;
                                    }
                                    sameConfig = preParamObject[item] === userConfig.tokenInfo[element];
                                }
                            });
                        });
                        form.setFieldsValue({ ...formParams });
                    }
                }
                if (userConfig.autoLogin && sameConfig) {
                    onFinish(userConfig);
                }
            }
            else {
                // 有预装配置 走预装配置
                const preParamObjectStr = sessionStorage.getItem('preParamObject');
                if (!preParamObjectStr) {
                    return;
                }
                const preParamObject = JSON.parse(preParamObjectStr);
                const userInfo: LooseObject = { username: '', password: '', hostAddress: '' }
                if (preParamObject) {
                    Object.keys(preParamObject).forEach(item => {
                        Object.keys(userInfo).forEach(element => {
                            if (item.toLowerCase() === element.toLowerCase()) {
                                userInfo[element] = preParamObject[item]
                            }
                        })
                    })
                    form.setFieldsValue({ ...userInfo })
                }
                onFinish(userInfo);
            }
        })
    }, [])

    return (<>
        {errorMessage && <div className={styles.errorDiv}>
            <div className={styles.errorMessage}>{formatMessage({ id: errorMessage })}</div>
        </div>}
        <div className={styles.homePage}>
            <Form
                className={styles.form}
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFocus={onfocus}
            >
                <div className={styles.formContent}>
                    <Form.Item
                        name="hostAddress"
                        rules={[{
                            required: true, message: formatMessage({ id: 'login.host.error' })
                        }]}
                    >
                        <Input placeholder={formatMessage({ id: 'login.host.address' })}
                            prefix={<Image src={HostIcon} preview={false} />} />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{
                            required: true, message: formatMessage({ id: 'login.username.error' })
                        }]}
                    >
                        <Input placeholder={formatMessage({ id: 'login.username' })}
                            prefix={<Image src={AccountIcon} preview={false} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{
                            required: true, message: formatMessage({ id: 'login.password.error' })
                        }]}
                    >
                        <Input.Password placeholder={formatMessage({ id: 'login.password' })}
                            prefix={<Image src={CodeIcon} preview={false} />}
                            iconRender={visible => (visible ? <Image src={OpenIcon} preview={false} /> :
                                <Image src={CloseIcon} preview={false} />)}
                        />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loginLoading}>
                        {formatMessage({ id: 'login.submit' })}
                    </Button>
                </Form.Item>
                <div className={styles.remember}>
                    <Checkbox checked={remember} onChange={onCheckChange}>
                        {formatMessage({ id: 'login.remember' })}
                    </Checkbox>
                </div>
            </Form>
        </div>
        <Footer url="https://documentation.grandstream.com/knowledge-base/wave-crm-add-ins/#overview"
            message={formatMessage({ id: 'login.user.guide' })} />
    </>);
};

export default connect(
    ({ loading }: { loading: Loading }) => ({
        loginLoading: loading.effects['login/login'] || loading.effects['global/getUserInfo'],
    }),
    (dispatch: Dispatch) => ({
        login: (payload: LooseObject) => dispatch({
            type: 'login/login',
            payload,
        }),
        getUserInfo: (payload: LooseObject) => dispatch({
            type: 'global/getUserInfo',
            payload
        }),
        saveUserConfig: (payload: LooseObject) => dispatch({
            type: 'global/saveUserConfig',
            payload,
        })
    })
)(IndexPage);

import React, { useEffect, useState } from 'react';
import { connect, history, useIntl } from 'umi';
import { Button, Checkbox, Form, Image, Input } from 'antd';
import { get } from 'lodash'
import { Footer } from '@/components';
import { SESSION_STORAGE_KEY } from '@/constant';
import HostIcon from '../../asset/login/service-line.svg';
import AccountIcon from '../../asset/login/account-line.svg';
import CodeIcon from '../../asset/login/code-line.svg';
import OpenIcon from '../../asset/login/password-open.svg';
import CloseIcon from '../../asset/login/password-close.svg';
import styles from './index.less';

/**
 * 登录页
 * 需要用户输入相关信息，获取鉴权
 * hostAddress: 部署的sugarCRM服务地址
 * username: 用户名
 * password: 用户密码
 * @constructor
 */
const IndexPage = ({ login, saveUserConfig, save, loginLoading, getUserInfo }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [remember, setRemember] = useState(true);
    const [form] = Form.useForm();
    const { formatMessage } = useIntl();

    /**
     * 自动登录状态更改
     * @param e
     */
    const onCheckChange = e => {
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
    const getUser = (user_id) => {
        getUserInfo(user_id).then(() => {
            loginSuccess();
        });
    }

    const onFinish = async values => {
        sessionStorage.setItem(SESSION_STORAGE_KEY.host, values.hostAddress);
        login(values).then(res => {
            if (res?.error) {
                setErrorMessage(res?.error);
                return;
            }
            if (!res.id) {
                setErrorMessage('error.userInfo');
                return;
            }
            const data = {
                tokenInfo: {
                    hostAddress: values.hostAddress,
                    username: values.username,
                    password: remember ? values.password : undefined,
                },
                autoLogin: remember,
                uploadCall: values.uploadCall ?? true,
                showConfig: values.showConfig ?? {
                    first: 'Name', second: 'Phone', third: 'None', forth: 'None', fifth: 'None',
                },
            }
            save({
                tokenInfo: {
                    hostAddress: values.hostAddress,
                    username: values.username,
                    password: remember ? values.password : undefined,
                },
                uploadCall: values.uploadCall ?? true,
                showConfig: values.showConfig ?? {
                    first: 'Name', second: 'Phone', third: 'None', forth: 'None', fifth: 'None',
                },
            });
            saveUserConfig(data)
            const user_id = get(res, ['name_value_list', 'user_id', 'value']);
            getUser(user_id);
        })
    };

    /**
     * 调用wave接口，获取用户信息，自动登录
     */
    useEffect(() => {
        pluginSDK.userConfig.getUserConfig(function ({ errorCode, data }) {
            console.log(errorCode, data);
            if (errorCode === 0 && data) {
                const userConfig = JSON.parse(data);
                console.log(userConfig);
                form.setFieldsValue(userConfig?.tokenInfo);
                if (userConfig.autoLogin) {
                    onFinish({ ...userConfig.tokenInfo, ...userConfig });
                }
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
    ({ loading }) => ({
        loginLoading: loading.effects['login/login'] || loading.effects['global/getUserInfo'],
    }),
    (dispatch) => ({
        login: payload => dispatch({
            type: 'login/login',
            payload,
        }),
        getUserInfo: payload => dispatch({
            type: 'global/getUserInfo',
            payload
        }),
        saveUserConfig: payload => dispatch({
            type: 'global/saveUserConfig',
            payload,
        }),
        save: payload => dispatch({
            type: 'global/save',
            payload
        })
    })
)(IndexPage);

import React from 'react';
import { Image, Button } from 'antd';
import { connect, useIntl } from 'umi';
import { REQUEST_CODE } from '@/constant'
import PicSuccess from '@/asset/ConnectState/success.png'
import PicFailure from '@/asset/ConnectState/failure.png'
import styles from './index.less'

const IndexPage = ({ connectState, user, logout }) => {
    const { formatMessage } = useIntl();

    const logoutClick = () => {
        logout()
    }

    return (
        <div className={styles.resultPage}>
            <div hidden={connectState !== 'SUCCESS'}>
                <div className={styles.result}>
                    <Image src={PicSuccess} preview={false} />
                    <div>
                        <p>{user.name}</p>
                        <p>{formatMessage({ id: 'home.logged' })}</p>
                    </div>
                    <Button type="primary" onClick={logoutClick}>{formatMessage({ id: 'home.logout' })}</Button>
                </div>
            </div>
            <div hidden={connectState !== REQUEST_CODE.connectError && connectState !== REQUEST_CODE.reConnect}>
                <div className={styles.result}>
                    <Image src={PicFailure} preview={false} />
                    <div>
                        <p>{user.name}</p>
                        <p>{formatMessage({ id: 'home.connectError' })}</p>
                    </div>
                    <Button type="primary" onClick={logoutClick}>{formatMessage({ id: 'home.logout' })}</Button>
                </div>
            </div>
            <div hidden={connectState !== REQUEST_CODE.invalidToken}>
                <div className={styles.result}>
                    <Image src={PicFailure} preview={false} />
                    <div>
                        <p>{user.name}</p>
                        <p>{formatMessage({ id: 'home.invalidToken' })}</p>
                    </div>
                    <Button type="primary" onClick={logoutClick}>{formatMessage({ id: 'home.logout' })}</Button>
                </div>
            </div>
        </div>
    )
}

export default connect(
    ({ global }) => ({
        connectState: global.connectState,
        user: global.user
    }),
    (dispatch) => ({
        logout: () => dispatch({
            type: 'global/logout',
        })
    })
)(IndexPage);
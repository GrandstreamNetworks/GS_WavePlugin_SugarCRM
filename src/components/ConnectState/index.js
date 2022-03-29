import React from 'react';
import { Result, Image } from 'antd';
import { connect, useIntl } from 'umi';
import { REQUEST_CODE } from '@/constant';
import PicSuccess from '../../asset/home/pic-ok.svg';
import PicFailure from '../../asset/home/pic-link.svg';
import PicNoPass from '../../asset/home/pic-noPass.svg';
import styles from './index.less'

const IndexPage = ({ connectState, user }) => {
    const { formatMessage } = useIntl();

    return (
        <div className={styles.resultPage}>
            <div hidden={connectState !== 'SUCCESS'}>
                <Result
                    icon={<Image src={PicSuccess} preview={false} />}
                    title={user.name}
                    subTitle={formatMessage({ id: 'home.logged' })}
                />
            </div>
            <div hidden={connectState !== REQUEST_CODE.connectError && connectState !== REQUEST_CODE.reConnect}>
                <Result
                    icon={<Image src={PicFailure} preview={false} />}
                    title={user.name}
                    subTitle={formatMessage({ id: 'home.connectError' })}
                />
            </div>
            <div hidden={connectState !== REQUEST_CODE.invalidToken}>
                <Result
                    icon={<Image src={PicNoPass} preview={false} />}
                    title={formatMessage({ id: 'home.invalidToken' })}
                />
            </div>
        </div>
    )
}

export default connect(
    ({ global }) => ({
        connectState: global.connectState,
        user: global.user
    })
)(IndexPage);
import { ConfigBlock, ConnectError, ConnectState, Footer } from '@/components';
import { SESSION_STORAGE_KEY } from '@/constant';
import { GlobalModelState, connect, useIntl } from 'umi';
import styles from './index.less';
import React from 'react';

interface Props {
    userConfig?: any
}

const HomePage: React.FC<Props> = ({ userConfig }) => {
    const { formatMessage } = useIntl();

    const host = sessionStorage.getItem(SESSION_STORAGE_KEY.host);

    return (
        <>
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <ConfigBlock />
            </div>
            <Footer url={`${host}/index.php`}
                userConfig={userConfig}
                message={formatMessage({ id: 'home.toCRM' })} />
        </>
    );
};

export default connect(({ global }: { global: GlobalModelState }) => ({
    userConfig: global.userConfig,
}))(HomePage);;
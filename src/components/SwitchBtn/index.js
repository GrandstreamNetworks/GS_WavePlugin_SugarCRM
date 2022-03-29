import React from 'react';
import { Switch } from 'antd';
import { connect } from 'umi';
import styles from './index.less'

const IndexPage = ({ userConfig, saveUserConfig, connectState }) => {

    const onSwitchChange = checked => {
        const config = JSON.parse(JSON.stringify(userConfig));
        config.uploadCall = checked;
        saveUserConfig(config);
    };

    return (
        <div className={styles.switch}>
            <Switch
                checked={userConfig.uploadCall}
                onChange={onSwitchChange}
                disabled={connectState !== 'SUCCESS'} />
        </div>
    )
}

export default connect(
    ({ global }) => ({
        userConfig: global.userConfig,
        connectState: global.connectState,
    }),
    (dispatch) => ({
        saveUserConfig: (payload) =>
            dispatch({
                type: 'global/saveUserConfig',
                payload,
            })
    })
)(IndexPage);
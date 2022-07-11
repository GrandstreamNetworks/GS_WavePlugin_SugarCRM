import React from 'react';
import { Switch } from 'antd';
import { connect } from 'umi';
import styles from './index.less'

const IndexPage = ({ uploadCall, uploadCallChange, connectState }) => {

    const onSwitchChange = checked => {
        uploadCallChange(checked);
    };

    return (
        <div className={styles.switch}>
            <Switch
                checked={uploadCall}
                onChange={onSwitchChange}
                disabled={connectState !== 'SUCCESS'} />
        </div>
    )
}

export default connect(
    ({ global }) => ({
        uploadCall: global.uploadCall,
        connectState: global.connectState,
    }),
    (dispatch) => ({
        uploadCallChange: (payload) =>
            dispatch({
                type: 'global/uploadCallChange',
                payload,
            })
    })
)(IndexPage);
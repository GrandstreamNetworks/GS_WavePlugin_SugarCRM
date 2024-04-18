import React from 'react';
import { message as Message } from 'antd';
import styles from './index.less'
import { GlobalModelState, connect } from 'umi';

interface Props {
    url: string
    message: string
    userConfig?: any
}

const IndexPage: React.FC<Props> = ({ url, message, userConfig }) => {

    const copyConfig = () => {
        const copyText = JSON.stringify(userConfig.tokenInfo);
        // 拷贝内容
        navigator.clipboard.writeText(copyText).then(() => {
            Message.success('Copied').then()
        })
    }
    const onClick = () => {
        window.open(url)
    }

    return (
        <div className={styles.footer}>
            <span className={styles.openUrl} onClick={onClick}>{message}</span>
            {userConfig?.tokenInfo && <>
                <span>|</span>
                <a className={styles.copy} onClick={copyConfig}>Copy Account Configuration</a>
            </>}
        </div >
    )
}

export default IndexPage
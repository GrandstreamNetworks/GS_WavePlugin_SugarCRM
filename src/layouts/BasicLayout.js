import React from 'react';
import { Card } from 'antd';
import Header from '../components/Header';

import styles from './basicLayout.less'

const BasicLayout = ({ children, location }) => {
    const { action } = location.query;
    const getExtra = () => <Header location={location}/>

    return (
        <div className={styles.layoutBody}>
            <Card title={action} extra={getExtra()} className={styles.cardBody}>
                {children}
            </Card>
        </div>
    );
};

export default BasicLayout;

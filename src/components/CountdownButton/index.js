import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

const IndexPage = ({ showTime, closeTime, loginImmediately }) => {
    const [time, setTime] = useState < number > (0);

    useEffect(() => {
        if (showTime) {
            setTime(30);
        }
    }, [showTime]);

    useEffect(() => {
        if (time > 0) {
            setTimeout(() => {
                setTime(time => time - 1);
            }, 1000)
        } else {
            closeTime()
        }
    }, [time, showTime])

    return (
        <Button type="primary" onClick={loginImmediately} disabled={time > 0}>{time || '立即登录'}</Button>
    )
}

export default IndexPage;
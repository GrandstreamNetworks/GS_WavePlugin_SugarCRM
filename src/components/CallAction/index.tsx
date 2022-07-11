import React, { useEffect, useRef } from "react";
import { EVENT_KEY, WAVE_CALL_TYPE } from "@/constant";

interface IndexProps {
    initCallInfo: (obj: string) => void
    uploadCallInfo: (callNum: string, callStartTimeStamp: number, callEndTimeStamp: number, callDirection: string) => void
}

const IndexPage: React.FC<IndexProps> = ({ initCallInfo, uploadCallInfo }) => {

    const callNumber = useRef(null);

    useEffect(() => {
        /**
         * 监听收到语音/视频来电
         * 回调函数参数：callType,callNum
         **/
        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.recvP2PIncomingCall, function ({ callType, callNum }) {
            console.log("onRecvP2PIncomingCall", callType, callNum);
            callNumber.current = callNum;
            initCallInfo(callNum);
        });

        /**
         * 监听wave发起语音/视频
         * 回调函数参数：callType,callNum
         */
        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.initP2PCall, function ({ callType, callNum }) {
            console.log("onHangupP2PCall", callType, callNum);
            callNumber.current = callNum;
            initCallInfo(callNum);
        });

        return function cleanup() {

            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.recvP2PIncomingCall);

            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.initP2PCall);
        }
    }, [initCallInfo])

    useEffect(() => {
        /**
         * 监听拒绝语音/视频
         * 回调函数参数：callType,callNum
         */
        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.rejectP2PCall, function ({ callType, callNum }) {
            console.log("onRejectP2PCall", callType, callNum);
            uploadCallInfo(callNum, 0, 0, WAVE_CALL_TYPE.in);
            if (callNumber.current === callNum) {
                setTimeout(() => {
                    // @ts-ignore
                    pluginSDK.hideNotification();
                }, 1000)
            }
        });

        /**
         * 监听挂断语音/视频
         * 回调函数参数：callType,callNum
         */
        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.hangupP2PCall, function (data) {
            console.log("onHangupP2PCall", data);
            let { callNum, callStartTimeStamp, callEndTimeStamp, callDirection } = data;
            callDirection = callDirection === "in" ? WAVE_CALL_TYPE.in : WAVE_CALL_TYPE.out;
            uploadCallInfo(callNum, callStartTimeStamp ?? 0, callEndTimeStamp ?? 0, callDirection);
            if (callNumber.current === callNum) {
                setTimeout(() => {
                    // @ts-ignore
                    pluginSDK.hideNotification();
                }, 1000)
            }
        });

        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.p2PCallCanceled, function ({ callType, callNum }) {
            console.log("p2PCallCanceled", callType, callNum);
            uploadCallInfo(callNum, 0, 0, WAVE_CALL_TYPE.in);
            if (callNumber.current === callNum) {
                setTimeout(() => {
                    // @ts-ignore
                    pluginSDK.hideNotification();
                }, 1000)
            }
        });

        return function cleanup() {
            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.rejectP2PCall);

            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.hangupP2PCall);

            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.p2PCallCanceled);
        };

    }, [uploadCallInfo]);


    return (<></>)
}

export default IndexPage;
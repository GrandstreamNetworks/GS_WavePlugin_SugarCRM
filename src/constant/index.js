const ACTION_TYPE = {
    detail: 'DetailView', // 查看详情
    edit: 'EditView', // 编辑
}

const MODULE_TYPE = {
    account: 'Accounts', // 客户
    contact: 'Contacts', // 联系人
    lead: 'Leads', // 潜在客户
    employees: 'Employees' //员工
}

const DATE_FORMAT = {
    format_1: 'YYYY/MM/DD',
    format_2: 'YYYY-MM-DD HH:mm:ss Z',
    format_3: 'YYYY/MM/DD HH/mm/ss Z',
};

const GLOBAL_MESSAGE = {
    timeout: 'global_message_timeout',
    error: 'global_message_error',
    success: 'global_message_success',
    info: 'global_message_info',
    warning: 'global_message_warning',
    duration_0: 0,
    duration_1: 1,
    duration_2: 2,
    duration_3: 3,
    duration_4: 4,
    duration_5: 5,
};

const REQUEST_CODE = {
    ok: 200,
    created: 201,
    deleted: 204,
    dataError: 400,
    noAuthority: 401,
    noFound: 404,
    serverError: 500,
    gatewayError: 502,
    serverOverload: 503,
    serverTimeout: 504,
    connectError: 'CONNECT_ERROR',
    invalidToken: 'INVALID_TOKEN',
    reConnect: 'RECONNECT',
};

const SESSION_STORAGE_KEY = {
    user: 'user',
    sessionId: 'sessionId',
    host: 'host',
}

const EVENT_KEY = {
    recvP2PIncomingCall: 'onRecvP2PIncomingCall', // 收到来电
    answerP2PCall: 'onAnswerP2PCall', // 接听来电
    hangupP2PCall: 'onHangupP2PCall', // 挂断来电
    rejectP2PCall: 'onRejectP2PCall', // 拒接来电
    initP2PCall: 'onInitP2PCall', // wave发去呼叫
    p2PCallCanceled: 'onP2PCallCanceled', // 未接来电、去电
    initPluginWindowOk: 'onInitPluginWindowOk', //初始化窗口成功
}

const WAVE_CALL_TYPE = {
    in: 'Inbound',
    out: 'Outbound',
    miss: 'Missed',
}

export {
    ACTION_TYPE,
    MODULE_TYPE,
    GLOBAL_MESSAGE,
    REQUEST_CODE,
    SESSION_STORAGE_KEY,
    EVENT_KEY,
    WAVE_CALL_TYPE,
    DATE_FORMAT
};

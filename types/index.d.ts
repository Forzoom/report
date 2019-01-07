interface ReportOption {
    /** 上报链接 */
    url?: string;
    /** 是否识别用户身份 */
    reportUser: boolean;
    /** 是否上报设备数据 */
    reportDevice: boolean;
    /** 上报设备数据时机 */
    reportDeviceOn: 'manual';
}

interface UserContext {
    /** 用户id */
    id?: string;
    /** 匿名id */
    anonymousId?: string;
}

interface Lib {
    flexible: {
        rem: null,
    };
}

interface Window {
    lib: {
        flexible: {
            rem: number | null,
        },
    };
}

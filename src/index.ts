import {
    stringify,
} from 'querystring';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

function get(key: string) {
    if (window.localStorage) {
        return localStorage.getItem(key);
    } else {
        const match = document.cookie.match(new RegExp("(?:^|;\\s)" + key + "=(.*?)(?:;\\s|$)"));
        return match && match.length >= 2 ? match[1] : '';
    }
}

function set(key: string, value: string, expire: string) {
    // 这里为什么需要try..catch..
    if (window.localStorage) try { expire ? localStorage.setItem(key, value) : sessionStorage.setItem(key, value) } catch (h) {} else {
        var d = window.location.host,
            f = { "com.cn": 1, "js.cn": 1, "net.cn": 1, "gov.cn": 1, "com.hk": 1, "co.nz": 1 },
            g = d.split(".");
        2 < g.length && (d = (f[g.slice(-2).join(".")] ? g.slice(-3) : g.slice(-2)).join("."));
        document.cookie =
            key + "=" + value + ";path=/;domain=" + d + (expire ? ";expires=" + expire : "")
    }
}

function randomString(len: number, src: string = alphabet) {
    let result: string = '';
    for (let i = 0; i < len; i++) {
        result += src[Math.floor(Math.random() * src.length)];
    }
    return result;
}

class ROReport {
    /** 配置 */
    public options: ReportOption = {
        reportUser: false,
        reportDevice: false,
        reportDeviceOn: 'manual',
    };
    /** 用户数据 */
    public userContext: UserContext = {};
    /** 设备信息 */
    public deviceInfo: {
        [key: string]: string | undefined,
    } = {};

    public init() {
        const userContext = this.userContext;
        userContext.anonymousId = get('ro_report_anonymous_id');
        userContext.id = get('ro_report_user_id');

        if (!userContext.anonymousId && !userContext.id) {
            const anonymousId = randomString(5) + (new Date()).valueOf();
            set('ro_report_anonymous_id', anonymousId, "Sun, 18 Jan 2038 00:00:00 GMT;");
            userContext.anonymousId = anonymousId;
        }

        if (this.options.reportDevice) {
            this.setDeviceInfo('width', '' + window.innerWidth);
        }
    }

    /** 补充用户信息 */
    public setUserContext(userContext: UserContext) {
        const keys = Object.keys(userContext);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            this.userContext[key] = userContext[key];
        }
    }

    /** 记录设备信息 */
    public setDeviceInfo(key: string, value: string) {
        this.deviceInfo[key] = value;
    }

    /**
     * 数据上报
     */
    public report(data) {
        if (!this.options.url) {
            return;
        }
        data.uid = this.options.reportUser && this.userContext.id ? this.userContext.id : this.userContext.anonymousId;
        var img = new Image();
        img.src = this.options.url + '?' + stringify(data);
    }

    /**
     * 上报设备信息
     */
    public reportDevice() {
        this.report(this.deviceInfo);
    }

    /**
     * 针对lib-flexible fontSize
     */
    public installLibFlexibleFontSizeReport() {
        const self = this;
        let rem = null;
        const lib: Lib = {
            flexible: {
                rem: null,
            },
        };
        Object.defineProperty(lib.flexible, 'rem', {
            get: function() {
                return rem;
            },
            set: function(val) {
                self.setDeviceInfo('fontSize', val);
                rem = val;
            },
        });

        window.lib = lib;
    }
}

export default ROReport;

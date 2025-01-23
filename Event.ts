import { App } from "vue";
interface Handlers {
  [key: string]: Array<Function>;
}

export class JsEvents {
  protected handlers: Handlers;
  constructor() {
    this.handlers = {};
  }

  /**
   * # 监听
   * * 事件的监听；
   * --------------------------------
   * ### 例子👇
   * ```js
   * import { Events } from "@/utils/utils";
   * const key = "EVENT_KEY_TEST";
   * Events.on(key, (val) => {});
   * ```
   * --------------------------------
   * @param {string} name 监听的key
   * @param {function} callback 回调
   */
  on(name: string, callback: (...args: any) => void) {
    if (!this.handlers.hasOwnProperty(name)) {
      this.handlers[name] = [];
    }
    this.handlers[name].push(callback);
  }

  /**
   * # 推送
   * * 事件推送；
   * ------------------------------
   * ### 例子👇
   * ```js
   * import { Events } from "@/utils/utils";
   * const key = "EVENT_KEY_TEST";
   * Events.emit(key, "内容");
   * ```
   * ------------------------------
   * @param name 推送的key
   * @param args 推送的数据
   */
  emit(name: string, ...args: any) {
    if (this.handlers.hasOwnProperty(name)) {
      const events = this.handlers[name];
      events.map((fn) => {
        fn(...args);
      });
    }
  }

  off(name: string, callback?: Function) {
    if (this.handlers.hasOwnProperty(name)) {
      if (callback) {
        const list: Array<Function> = [];

        this.handlers[name].map((fn) => {
          if (callback != fn) {
            list.push(fn);
          }
        });

        this.handlers[name] = list;
      } else {
        delete this.handlers[name];
      }
    }
  }
}

/**
 * # 事件推送功能
 * * 全局事件推送方案
 * * 当系统中出现跨模块事件推送时可以考虑使用该方案，改方案已在多个项目试验成功，相较于稳定成熟
 * -------------------------------
 * 
 * ### 例子👇
 * ```ts
 * import { Events } from "@/utils/utils";
 * const key = "EVENT_KEY_TEST";
 * Events.on(key, (val) => {});
 * Events.emit(key, "内容");
 * ```
 */
export const Events: JsEvents = new JsEvents();

export const EventBus = {
  install(app: App) {
    app.config.globalProperties.$Events = Events;
    return app;
  },
};

export default Events;

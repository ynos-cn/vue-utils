/*
 * @Description: 存储
 * @Version: 1.0
 */
import { Storage, sessionStorage } from "ynos-storage";
import Cookies from "js-cookie";

/** 本地存储  LocalStorage */
export const LocalStorage = Storage.useStorage({
  namespace: "pro__",
}).ls;
/** 本地会话  SessionStorage */
export const SessionStorage = sessionStorage.useStorage();
// /** Cookie  Cookie */
export const Cookie = Cookies;

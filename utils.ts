/*
 * @Description: 公共方法 非hooks函数
 * @Version: 1.0
 */
import { LocalStorage, SessionStorage, Cookie } from './storage'

/**
 * 动态加载js资源
 * @param url js资源url
 * @returns Promise
 */
export const loadScript = (url: string) => {
  return new Promise((resolve, reject) => {
    let docURl = document.getElementById(url)
    if (docURl) {
      resolve(undefined)
      return
    }
    const script = document.createElement('script')

    script.onload = () => resolve(undefined)

    script.onerror = () => reject(new Error(`Load script from ${url} failed`))
    script.type = 'text/javascript';
    script.src = url;
    script.id = url
    const head =
      document.head || document.getElementsByTagName('head')[0]
      ; (document.body || head).appendChild(script)
  })
}

/**
 * @description: 获取token
 * @return {String} token | undefined
 */
export const getToken = (): string | undefined => {
  return Cookie.get('token') ?? SessionStorage.get('token') ?? LocalStorage.get('token')
}

/**
 * @description: 设置token
 * @return {String} token | undefined
 */
export const setToken = (token: string) => {
  Cookie.set("token", token);
  SessionStorage.set("token", token);
  LocalStorage.set("token", token);
}

/** 身份证信息数据 */
export interface RecordIDCardStruct {
  /** 年龄 */
  age?: number;
  /** 性别 */
  sex?: '男' | '女';
  /** 出生年 */
  year?: number;
  /** 出生月 */
  month?: number;
  /** 出生日 */
  day?: number;
  /** 籍贯 */
  province?: string;
  /** 身份证号码 */
  id?: string
}

/**
 * 分析身份证
 * * 根据身份证号码进行分析`年龄`,`性别`,`出生年`,`出生月`,`出生日`,`籍贯`;
 * ---
 * ### 例子👇
 * ```js
 * import { analyzeIDCard } from '@/utils/utils'
 * analyzeIDCard("4418xxxx")
 * ```
 * ---
 * @param idCode 身份证号码
 * @returns `RecordIDCardStruct`
 */
export const analyzeIDCard = (idCode: string): RecordIDCardStruct | undefined => {
  //获取用户身份证号码
  let userCard = idCode;
  //如果用户身份证号码为undefined则返回空
  if (!userCard) {
    return undefined;
  }
  let info: RecordIDCardStruct = {};
  info.id = userCard;
  const provinceData = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门" };

  // 获取籍贯
  info.province = provinceData[parseInt(userCard.substring(0, 2))];

  // 获取性别
  if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
    info.sex = '男'
  } else {
    info.sex = '女'
  }

  // 获取出生日期
  let yearBirth = parseInt(userCard.substring(6, 10))
  let monthBirth = parseInt(userCard.substring(10, 12));
  let dayBirth = parseInt(userCard.substring(12, 14));

  info.year = yearBirth;
  info.month = monthBirth;
  info.day = dayBirth;

  // 获取当前年月日并计算年龄
  let myDate = new Date();
  let monthNow = myDate.getMonth() + 1;
  let dayNow = myDate.getDate();
  let age = myDate.getFullYear() - yearBirth;
  if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
    age--;
  }
  // 得到年龄
  info.age = age;
  // 返回 性别和年龄
  return info;
}


/**
 * 身份证号码脱敏
 * @param idCode 身份证号码脱敏
 * @param desensitization 是否脱敏
 * @returns 处理后的身份证号码
 */
export const maskedIdCard = (idCode: string, desensitization = true): string | undefined => {
  if (!idCode) {
    return undefined
  }
  const reg = /^(.{6})(?:\d+)(.{4})$/;
  if ((window as any).rootShowIdCard || !desensitization) {
    return idCode
  }
  return idCode.replace(reg, '\$1******\$2')
}

/**
 * 手机号码脱敏
 * @param idCode 手机号码脱敏
 * @param desensitization 是否脱敏
 * @returns 处理后的手机号码
 */
export const maskedPhone = (phone: string, desensitization = true): string | undefined => {
  if (!phone) {
    return undefined
  }
  const reg = /^(1[3-9][0-9])\d{4}(\d{4}$)/;
  if ((window as any).rootShowPhone || !desensitization) {
    return phone
  }
  return phone.replace(reg, '$1****$2')
}

/**
 * # 组合键方法
 * * win:`ctrl+shift+R`; mac:`command+shift+R`
 * @param {Function} fn 回调
 */
export function onCacheCleanup(fn: Function) {
  let code = 0, code1 = 0, code2 = 0;
  window.addEventListener('keydown', async (e: KeyboardEvent) => {
    if (e.keyCode === 17 || e.keyCode === 91) {
      code = 1
    }
    if (e.keyCode === 16) {
      code1 = 1
    }
    if (e.keyCode === 82) {
      code2 = 1
    }

    if (code === 1 && code1 === 1 && code2 === 1) {
      fn()
      code = 0
      code1 = 0
      code2 = 0
    }
  })
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.keyCode === 17 || e.keyCode === 91) {
      code = 0
    }
    if (e.keyCode === 16) {
      code1 = 0
    }
    if (e.keyCode === 82) {
      code2 = 0
    }
  })
}

/**
 * # 获取url参数
 * * 用于解决url地址非`hash`模式下的参数
 * --------
 * ### 例子👇
 * ```js
 * // http://127.0.0.1/hello/?code=world/#/?code=hello
 * const code = getQueryVariable("code")
 * console.log(code) // world
 * ```
 * --------
 * 
 * @param key 参数key
 * @return 值
 */
export const getQueryVariable = (key: string): string | undefined => {
  let url = window.location.href;
  if (url.indexOf('?') != -1) {
    let arr = url.slice(url.indexOf('?') + 1).split('&');
    let value: string | undefined = undefined
    for (let index = 0; index < arr.length; index++) {
      let param = arr[index].split('=');
      if (param[0] == key) {
        value = param[1];
        break;
      }
    }
    return value
  } else {
    return undefined;
  }
}

/**
 * # 检查手机号码是否合法
 * @param tel 手机号码
 * @returns Boolean
 */
export const verifyTel = (tel: string) => {
  let wiredTelephone = /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^[0−9]3,4[0-9]{3,8}$)/
  //判断手机格式可以用
  let phone = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/
  return wiredTelephone.test(tel) || phone.test(tel)
}


export function scorePassword(pass: string) {
  let score: number = 0
  if (!pass) {
    return score
  }
  // award every unique letter until 5 repetitions
  const letters: any = {}
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations: any = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass)
  }

  let variationCount = 0
  for (var check in variations) {
    variationCount += (variations[check] === true) ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return score
}

/**
 * @description: 页面可见性 API 允许我们检查页面对用户是否可见
 * @param {function} 回调方法
 * @return boolean
 */
export const getPageVisibility = (callback?: (visible?: boolean) => void) => {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      if (callback) {
        callback(document.visibilityState === "visible")
      }
      return document.visibilityState === "visible";
    }
    if (callback) {
      callback(false)
    }
    return false;
  });
}

/**
 * 获取随机颜色
 * @param type 类型：16进制、rgb
 * @returns 类型：16进制、rgb
 */
export const getRandomColor = (type?: "16" | "rgb") => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  if (type === 'rgb') {
    return `rgb(${r},${g},${b})`;
  }
  const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  return color;
}

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}


export function arrayToTree<T = any>(listData: Array<T>, parentKey = 'parentId') {
  if (listData.length <= 0) {
    return []
  }
  const rootItems = [listData[0]];
  const childrenOfItem = new Map();

  // 建立每个项目的子项目映射
  for (const item of listData) {
    const parentId = item[parentKey];
    if (!childrenOfItem.has(parentId)) {
      childrenOfItem.set(parentId, []);
    }
    childrenOfItem.get(parentId).push(item);
  }

  // 递归地将子项目添加到它们的父项目中
  function addChildren(listData) {
    for (const item of listData) {
      const children = childrenOfItem.get(item.id) || [];
      item.children = children.length ? addChildren(children) : [];
    }
    return listData;
  }

  // 返回处理过的根项目
  return addChildren(rootItems);
}


/** 生成渐变色 */
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}

const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const hsvToRgb = (h, s, v) => {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const rgbToHsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, v];
}

/**
 * 生成渐变色 区间值
 * @param color1 
 * @param color2 
 * @param steps 
 * 
 * # 案例
 * 
 * ``` js
const color1 = "#0651D9";
const color2 = "#AAE9E4";
const steps = 50;
const gradientColors = generateGradientColors(color1, color2, steps);
console.log(JSON.stringify(gradientColors));

 */
export const generateGradientColors = (color1, color2, steps) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const hsv1 = rgbToHsv(rgb1[0], rgb1[1], rgb1[2]);
  const hsv2 = rgbToHsv(rgb2[0], rgb2[1], rgb2[2]);

  const gradientColors: Array<string> = [];

  for (let i = 0; i < steps; i++) {
    const h = hsv1[0] + (hsv2[0] - hsv1[0]) * i / steps;
    const s = hsv1[1] + (hsv2[1] - hsv1[1]) * i / steps;
    const v = hsv1[2] + (hsv2[2] - hsv1[2]) * i / steps;

    const rgb = hsvToRgb(h, s, v);
    gradientColors.push(rgbToHex(rgb[0], rgb[1], rgb[2]));
  }

  return gradientColors;
}

/**
 * 清空表单状态
 * @param obj 
 */
export const clearFormState = <T extends Record<string, unknown>>(obj: T): void => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key as keyof T] = '' as unknown as T[keyof T];
    }
  }
}

/**
 * 查找父级ID列表
 * @param data 数据数组
 * @param targetId 目标ID
 * @param parentIdKey 父级ID字段名，默认为'parentId'
 */
export const findParentIds = <T extends { id: any; orgId?: any, parentId?: any; children?: T[] }>(
  data: T[],
  targetId: any,
  parentIdKey: keyof T = 'parentId' as keyof T
): any[] => {
  const result: any[] = [];

  function dfs(node: T) {
    if (node.id === targetId) {
      result.push(node[parentIdKey]);
      return true;
    }

    if (node?.children) {
      for (const child of node?.children) {
        if (dfs(child)) {
          if (node[parentIdKey]) {
            result.push(node[parentIdKey]);
          }
          return true;
        }
      }
    }

    return false;
  }

  for (const node of data) {
    if (dfs(node)) {
      break;
    }
  }

  return result.reverse();
};


/**
 * 检查给定的 ID 是否有效。
 *
 * @param id - 要检查的 ID，可以是数字或字符串类型。
 * @returns 如果 ID 已定义且不为 null 或 undefined，且如果是字符串类型则不为空字符串，则返回 true；否则返回 false。
 */
export function isIdValid(id: number | string | undefined): boolean {
  // 检查 id 是否被定义并且不等于 null 或 undefined
  if (typeof id === 'undefined' || id === null) {
    return false;
  }
  // 如果 id 是数字或字符串类型，并且不等于空字符串（对于字符串id）
  if (typeof id === 'number' || (typeof id === 'string' && id !== '')) {
    return true;
  }
  return false;
}

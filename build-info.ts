/*
 * @Description: 构建信息
 * @Version: 1.0
 */

import {
  version,
  buildIp,
  currentTime,
  gitCommitId,
} from "@/components/version/version";

/** 生产构建信息 */
export function buildInfo() {
  const info = {
    版本号: version,
    构建ip: buildIp,
    构建时间: currentTime,
    当前git版本号: gitCommitId,
  };

  sessionStorage.setItem("构建信息", JSON.stringify(info));
}

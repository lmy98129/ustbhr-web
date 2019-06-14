import fetch from 'dva/fetch';
import { error } from './message';

const jsonHeader = {
  "content-type": "application/json;charset=UTF-8",
}

/**
 * 检查网络是否出现异常状态
 * 
 * @param {object} response 返回的响应对象
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const errorStatus = new Error(response.statusText);
  errorStatus.response = response;
  
  error(`网络异常 ${response.status} ${response.statusText}`);
  throw errorStatus;
}

/**
 * 发送请求到一个 URL, 返回一个promise对象
 *
 * @param  {string} url       要请求的URL地址
 * @param  {object} [options] 提交给fetch的请求参数
 * @return {object}           返回带有“data”或“err”的对象
 */
export default async function request(url, options) {
  if ( (options.method === "POST" 
    || options.method === "PUT") && options.body !== undefined ) {
    options.headers = jsonHeader;
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, options);

  checkStatus(response);

  const data = await response.json();

  const ret = {
    data,
    headers: {},
  };

  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count');
  }

  return ret;
}

import define from 'configs/define';
import request from 'utils/request';

export async function sendRequestG<T, R>(url: string, params?: R) {
  const response = request.get<T>(url, { params })
  return response
}

export async function sendRequestP<T, R>(url: string, params?: R) {
  const response = request.post<T>(url, { params })
  return response
}

export function getBaseName() {
  var env = import.meta.env.MODE || 'development';
  var root = env === 'development' ? '/' : define.root
  return root
}
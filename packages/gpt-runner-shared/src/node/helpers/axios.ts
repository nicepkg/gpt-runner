import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { HttpProxyAgent } from 'http-proxy-agent'
import { HttpsProxyAgent } from 'https-proxy-agent'

export function initAxios(): void {
  const httpProxyUrl = process.env.HTTP_PROXY
  const httpsProxyUrl = process.env.HTTPS_PROXY

  if (httpProxyUrl) {
    const httpAgent = new HttpProxyAgent(httpProxyUrl)
    axios.defaults.httpAgent = httpAgent
  }

  if (httpsProxyUrl) {
    const httpsAgent = new HttpsProxyAgent(httpsProxyUrl)
    axios.defaults.httpsAgent = httpsAgent
  }
}

let axiosInstance: AxiosInstance | null = null

export function getAxiosInstance(): AxiosInstance {
  if (!axiosInstance) {
    initAxios()
    axiosInstance = axios.create()
  }

  return axiosInstance
}

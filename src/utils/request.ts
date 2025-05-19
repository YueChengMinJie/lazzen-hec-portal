import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { defu } from 'defu';
import qs from 'qs';
import { isFunction, isString } from '@vue/shared';
import { bindMethods } from '@/utils/index';
import { message } from 'ant-design-vue';

type ExtendOptions<T = any> = {
  /**
   * 参数序列化方式。预置的有
   * - brackets: ids[]=1&ids[]=2&ids[]=3
   * - comma: ids=1,2,3
   * - indices: ids[0]=1&ids[1]=2&ids[2]=3
   * - repeat: ids=1&ids=2&ids=3
   */
  paramsSerializer?: 'brackets' | 'comma' | 'indices' | 'repeat' | AxiosRequestConfig<T>['paramsSerializer'];
  /**
   * 响应数据的返回方式。
   * - raw: 原始的AxiosResponse，包括headers、status等，不做是否成功请求的检查。
   * - body: 返回响应数据的BODY部分（只会根据status检查请求是否成功，忽略对code的判断，这种情况下应由调用方检查请求是否成功）。
   * - data: 解构响应的BODY数据，只返回其中的data节点数据（会检查status和code是否为成功状态）。
   */
  responseReturn?: 'body' | 'data' | 'raw';
};

type RequestClientOptions = CreateAxiosDefaults & ExtendOptions;

type RequestClientConfig<T = any> = AxiosRequestConfig<T> & ExtendOptions<T>;

interface RequestInterceptorConfig {
  fulfilled?: (
    config: ExtendOptions & InternalAxiosRequestConfig,
  ) => (ExtendOptions & InternalAxiosRequestConfig<any>) | Promise<ExtendOptions & InternalAxiosRequestConfig<any>>;
  rejected?: (error: any) => any;
}

type RequestResponse<T = any> = AxiosResponse<T> & {
  config: RequestClientConfig<T>;
};

interface ResponseInterceptorConfig<T = any> {
  fulfilled?: (response: RequestResponse<T>) => Promise<RequestResponse> | RequestResponse;
  rejected?: (error: any) => any;
}

const defaultRequestInterceptorConfig: RequestInterceptorConfig = {
  fulfilled: response => response,
  rejected: error => Promise.reject(error),
};

const defaultResponseInterceptorConfig: ResponseInterceptorConfig = {
  fulfilled: (response: AxiosResponse) => response,
  rejected: error => Promise.reject(error),
};

class InterceptorManager {
  private axiosInstance: AxiosInstance;

  constructor(instance: AxiosInstance) {
    this.axiosInstance = instance;
  }

  addRequestInterceptor({ fulfilled, rejected }: RequestInterceptorConfig = defaultRequestInterceptorConfig) {
    this.axiosInstance.interceptors.request.use(fulfilled, rejected);
  }

  addResponseInterceptor<T = any>({
    fulfilled,
    rejected,
  }: ResponseInterceptorConfig<T> = defaultResponseInterceptorConfig) {
    this.axiosInstance.interceptors.response.use(fulfilled, rejected);
  }
}

function getParamsSerializer(paramsSerializer: RequestClientOptions['paramsSerializer']) {
  if (isString(paramsSerializer)) {
    switch (paramsSerializer) {
      case 'brackets': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'brackets' });
      }
      case 'comma': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'comma' });
      }
      case 'indices': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'indices' });
      }
      case 'repeat': {
        return (params: any) => qs.stringify(params, { arrayFormat: 'repeat' });
      }
    }
  }
  return paramsSerializer;
}

class RequestClient {
  public addRequestInterceptor: InterceptorManager['addRequestInterceptor'];
  public addResponseInterceptor: InterceptorManager['addResponseInterceptor'];

  private readonly instance: AxiosInstance;

  constructor(options: RequestClientOptions = {}) {
    const defaultConfig: RequestClientOptions = {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      responseReturn: 'raw',
      // 默认超时时间
      timeout: 10_000,
    };
    const { ...axiosConfig } = options;
    const requestConfig = defu(axiosConfig, defaultConfig);
    requestConfig.paramsSerializer = getParamsSerializer(requestConfig.paramsSerializer);
    this.instance = axios.create(requestConfig);

    bindMethods(this);

    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor = interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor = interceptorManager.addResponseInterceptor.bind(interceptorManager);
  }

  /**
   * DELETE请求方法
   */
  public delete<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * GET请求方法
   */
  public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST请求方法
   */
  public post<T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'POST' });
  }

  /**
   * PUT请求方法
   */
  public put<T = any>(url: string, data?: any, config?: RequestClientConfig): Promise<T> {
    return this.request<T>(url, { ...config, data, method: 'PUT' });
  }

  /**
   * 通用的请求方法
   */
  public async request<T>(url: string, config: RequestClientConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance({
        url,
        ...config,
        ...(config.paramsSerializer ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) } : {}),
      });
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }
}

const defaultResponseInterceptor = ({
  codeField = 'code',
  dataField = 'data',
  successCode = 0,
}: {
  codeField: string;
  dataField: ((response: any) => any) | string;
  successCode: ((code: any) => boolean) | number | string;
}): ResponseInterceptorConfig => {
  return {
    fulfilled: response => {
      const { config, data: responseData, status } = response;

      if (config.responseReturn === 'raw') {
        return response;
      }

      if (status >= 200 && status < 400) {
        if (config.responseReturn === 'body') {
          return responseData;
        } else if (
          isFunction(successCode) ? successCode(responseData[codeField]) : responseData[codeField] === successCode
        ) {
          return isFunction(dataField) ? dataField(responseData) : responseData[dataField];
        }
      }
      throw Object.assign({}, response, { response });
    },
  };
};

type MakeErrorMessageFn = (message: string, error: any) => void;

const errorMessageResponseInterceptor = (makeErrorMessage?: MakeErrorMessageFn): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      const err: string = error?.toString?.() ?? '';
      let errMsg = '';
      if (err?.includes('Network Error')) {
        errMsg = '网络错误';
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = '网络超时';
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg, error);
        return Promise.reject(error);
      }

      let errorMessage = '';
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          errorMessage = '请问错误';
          break;
        }
        case 401: {
          errorMessage = '认证失败';
          break;
        }
        case 403: {
          errorMessage = '没有权限';
          break;
        }
        case 404: {
          errorMessage = '地址错误';
          break;
        }
        case 408: {
          errorMessage = '请求超时';
          break;
        }
        default: {
          errorMessage = '错误';
        }
      }
      makeErrorMessage?.(errorMessage, error);
      return Promise.reject(error);
    },
  };
};

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'resCode',
      dataField: 'data',
      successCode: 0,
    }),
  );

  client.addResponseInterceptor(
    errorMessageResponseInterceptor(async (msg: string, error: any) => {
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.errorMessage ?? '';
      await message.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(
  import.meta.env.VITE_GLOB_API_URL + import.meta.env.VITE_GLOB_API_URL_PREFIX,
  {
    responseReturn: 'data',
  },
);

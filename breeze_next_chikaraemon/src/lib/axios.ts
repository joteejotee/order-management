import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosHeaders,
  AxiosResponse,
} from 'axios';

// 環境変数の確認用ログ
console.log('✅ axios.ts loaded');
console.log('ENV:', process.env.NEXT_PUBLIC_BACKEND_URL);

// Process環境変数の型定義
declare global {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_BACKEND_URL?: string;
  }
}

// サンクタムのCookie設定
axios.defaults.withCredentials = true;

// フロントエンドがブラウザで実行されているか、サーバーで実行されているかを判定
const isBrowser = typeof window !== 'undefined';

// バックエンドのURLを設定
let baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

if (isBrowser) {
  // ブラウザ環境では環境変数から取得したURLを使用
  // ただし、nginxの場合は適切な外部アクセス用URLに置き換える
  if (baseURL === 'http://nginx') {
    baseURL = 'http://localhost:8000';
  }
  console.log('Browser environment detected, using baseURL:', baseURL);
} else {
  // サーバー環境ではコンテナ間通信のためのURLを使用
  console.log('Server environment detected, using baseURL:', baseURL);
}

// axiosインスタンスの設定
axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

// キャンセルトークンの格納用オブジェクト
const cancelTokens: Record<string, AbortController> = {};

// ナビゲーション検出のためのグローバルイベントリスナー
if (isBrowser) {
  window.addEventListener('navigationStart', () => {
    console.log('Navigation detected, canceling all pending requests');
    Object.values(cancelTokens).forEach(controller => {
      try {
        controller.abort();
      } catch (e) {
        console.log('Error aborting request:', e);
      }
    });
    // キャンセルしたトークンをクリア
    Object.keys(cancelTokens).forEach(key => {
      delete cancelTokens[key];
    });
  });
}

// リクエスト・レスポンスのインターセプター
axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ブラウザ環境かつURLがnginxの場合は適切なURLに変換
    if (isBrowser && config.url?.includes('http://nginx')) {
      config.url = config.url.replace('http://nginx', 'http://localhost:8000');
    }

    // リクエストIDを生成
    const requestId = `req_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // 既存のAbortControllerを上書きし、cancelTokensに保存
    const controller = new AbortController();
    if (config.signal) {
      // 元のシグナルとこのコントローラーを連携
      const originalSignal = config.signal;
      if (
        originalSignal &&
        typeof originalSignal.addEventListener === 'function'
      ) {
        originalSignal.addEventListener('abort', () => {
          controller.abort();
        });
      }
    }

    // 新しいシグナルを設定
    config.signal = controller.signal;
    cancelTokens[requestId] = controller;

    // リクエストIDをヘッダーに設定
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('X-Request-ID', requestId);

    // クリーンアップ関数を設定（レスポンスまたはエラー時）
    const cleanupToken = () => {
      if (cancelTokens[requestId]) {
        delete cancelTokens[requestId];
      }
    };

    // リクエスト完了時に自動的にクリーンアップするためにconfig拡張
    (config as any)._requestId = requestId;
    (config as any)._cleanupToken = cleanupToken;

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
    );

    return config;
  },
  error => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);

    // リクエストトークンをクリーンアップ
    const requestId = (response.config as any)._requestId;
    if (requestId && cancelTokens[requestId]) {
      delete cancelTokens[requestId];
    }

    return response;
  },
  (error: unknown) => {
    // エラーがキャンセルによるものかをチェック
    if (axios.isCancel(error)) {
      console.log(
        '⚠️ Request canceled:',
        error instanceof Error
          ? error.message
          : 'Navigation or manual cancellation',
      );

      // キャンセルによるエラーは静かに処理
      return Promise.reject({
        name: 'CanceledError',
        code: 'ERR_CANCELED',
        message: 'canceled',
        isAxiosError: false,
        isCanceled: true,
        _isSilent: true,
      });
    }

    // エラーをAxiosErrorとして扱う
    const axiosError = error as AxiosError;

    // リクエストトークンをクリーンアップ
    const config = axiosError.config as any;
    if (config?._requestId && cancelTokens[config._requestId]) {
      delete cancelTokens[config._requestId];
    }

    if (axiosError.response) {
      console.error(
        `❌ API Error: ${axiosError.response.status} ${config?.url}`,
        axiosError.response.data,
      );
    } else if (axiosError.request) {
      console.error('❌ No response received:', axiosError.request);
    } else {
      console.error('❌ Request setup error:', axiosError.message);
    }

    return Promise.reject(error);
  },
);

export default axios;

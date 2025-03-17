import Axios from 'axios';

// 環境変数からバックエンドのURLを取得。未設定の場合は本番環境のAPIを使用
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.order-management1.com',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

export default axios;

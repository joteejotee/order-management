import Axios from 'axios';

// 環境変数からバックエンドのURLを取得。未設定の場合はローカルホストを使用
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

export default axios;

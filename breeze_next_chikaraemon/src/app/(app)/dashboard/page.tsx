'use client';

import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/types';

const DashboardPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isValidating, forceRefresh, clearCache } = useAuth({
    middleware: 'auth',
  });

  // 時間関連の状態管理
  const [currentTime, setCurrentTime] = useState('');
  const [mountTime, setMountTime] = useState('');

  // デバッグ用のステート
  const [debugInfo, setDebugInfo] = useState({
    mountTime: '',
    renderCount: 0,
    lastUserState: null as any,
    lastValidatingState: null as boolean | null,
  });

  // 時間の更新
  useEffect(() => {
    const now = new Date().toISOString();
    setCurrentTime(now);
    setMountTime(now);
    setDebugInfo(prev => ({
      ...prev,
      mountTime: now,
    }));
  }, []);

  // コンポーネントのマウント時に実行
  useEffect(() => {
    console.log('Dashboard - Component mounted at', currentTime);
    setMounted(true);

    // ローカルストレージから直接ユーザーデータを確認
    try {
      const storedUser = localStorage.getItem('user');
      console.log(
        'Dashboard - LocalStorage user:',
        storedUser ? JSON.parse(storedUser) : 'なし',
      );
    } catch (error) {
      console.error('Dashboard - Error reading localStorage:', error);
    }

    // 強制的にユーザーデータを再取得
    console.log('Dashboard - Force refreshing user data on mount');
    forceRefresh();
  }, [currentTime]);

  // デバッグ情報の更新
  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      lastUserState: user,
      lastValidatingState: isValidating,
    }));

    console.log('Dashboard - Debug Info Updated:', {
      ...debugInfo,
      renderCount: debugInfo.renderCount + 1,
      currentTime,
      user: user ? { id: user.data.id, name: user.data.name } : 'なし',
      isValidating,
    });
  }, [user, isValidating]);

  // ユーザー状態の変更を監視
  useEffect(() => {
    console.log('Dashboard - Auth State Changed:', {
      user: user ? { id: user.data.id, name: user.data.name } : '存在しません',
      isValidating,
      mounted,
      time: currentTime,
    });

    if (mounted && !isValidating && !user) {
      console.log('Dashboard - No user after validation, redirecting');
      // リダイレクト前にキャッシュをクリア
      clearCache();
      // 直接リダイレクト
      window.location.href = '/login';
    }
  }, [user, isValidating, mounted, currentTime]);

  // ローディング状態の表示（マウント中または検証中）
  if (!mounted || isValidating) {
    console.log('Dashboard - Showing loading state', {
      mounted,
      isValidating,
      hasUser: !!user,
      time: currentTime,
    });
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-600">ロード中...</div>
        <div className="mt-4 text-xs text-gray-400">
          <div>マウント: {mounted ? '完了' : '未完了'}</div>
          <div>検証中: {isValidating ? 'はい' : 'いいえ'}</div>
          <div>マウント時刻: {mountTime}</div>
          <div>現在時刻: {currentTime}</div>
        </div>
      </div>
    );
  }

  // ユーザーデータがあれば表示
  if (user) {
    console.log('Dashboard - Rendering with user:', user);
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="mb-4">ようこそ {user.data.name} さん！</div>
              <div className="text-xs text-gray-500">
                <div>マウント時刻: {mountTime}</div>
                <div>レンダリング回数: {debugInfo.renderCount}</div>
                <div>現在時刻: {currentTime}</div>
                <button
                  onClick={() => {
                    console.log('Dashboard - Manual refresh triggered');
                    clearCache();
                    forceRefresh();
                  }}
                  className="mt-2 px-2 py-1 bg-gray-200 rounded text-gray-700"
                >
                  キャッシュクリア＆更新
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ユーザーが存在しない場合（エラー状態）
  console.log('Dashboard - No user found, showing error state');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-red-500 text-xl mb-4">エラー</div>
      <div className="text-center p-4">
        ユーザー情報が見つかりません。再ログインしてください。
      </div>
      <button
        onClick={() => {
          // ローカルストレージをクリア
          clearCache();
          window.location.href = '/login';
        }}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ログイン画面へ
      </button>
      <div className="mt-4 text-xs text-gray-400">
        <div>デバッグ情報:</div>
        <div>マウント: {mounted ? '完了' : '未完了'}</div>
        <div>検証中: {isValidating ? 'はい' : 'いいえ'}</div>
        <div>マウント時刻: {mountTime}</div>
        <div>現在時刻: {currentTime}</div>
      </div>
    </div>
  );
};

export default DashboardPage;

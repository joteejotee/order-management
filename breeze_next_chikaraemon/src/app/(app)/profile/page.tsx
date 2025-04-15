import { FC } from 'react'

const ProfilePage: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">プロフィール機能</h1>
        <p className="text-gray-600 mb-6">
          この機能は現在開発中です。順次実装予定となっております。
        </p>
        <div className="text-sm text-gray-500">
          今しばらくお待ちください。
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 
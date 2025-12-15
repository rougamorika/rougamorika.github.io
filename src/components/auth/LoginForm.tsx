import { useState, FormEvent } from 'react';
import { useAuthStore } from '@store/authStore';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    clearError();

    // Validate inputs
    if (!username.trim() || !password.trim()) {
      return;
    }

    // Attempt login
    const success = await login(username, password);

    if (success) {
      // Clear form on success
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-white mb-2"
          >
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-anime-pink focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="请输入用户名"
            autoComplete="username"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-2"
          >
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-anime-pink focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="请输入密码"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading || !username.trim() || !password.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-anime-pink to-anime-purple text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              登录中...
            </span>
          ) : (
            '登录'
          )}
        </button>

        {/* Helper Text */}
        <p className="text-center text-white/60 text-sm">
          默认账号: admin / admin123
        </p>
      </form>
    </div>
  );
}

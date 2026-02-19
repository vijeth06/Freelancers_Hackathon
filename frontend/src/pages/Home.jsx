import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MeetingAI</h1>
            <p className="text-xs text-purple-200">Intelligent Meeting Notes</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 text-sm font-medium text-purple-100 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-32">
          <div className="text-center space-y-8">
            {/* Animated badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-purple-100">AI-Powered Analysis • Real-Time Processing</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Transform Your Meetings
              </span>
              <br />
              <span className="text-white">Into Actionable Insights</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-purple-100">
              Let AI analyze your meeting transcripts. Automatically extract summaries, key points, and action items. 
              Organize, search, and export to Trello or Notion in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border-2 border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-lg text-purple-200">Everything you need to master your meetings</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-purple-100">
                Claude and OpenAI integration extracts summaries, key points, and action items automatically.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Action Item Tracking</h3>
              <p className="text-purple-100">
                Centralized dashboard to manage all action items with filtering, priority, and status tracking.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-pink-500 to-orange-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Search</h3>
              <p className="text-purple-100">
                Full-text search across meeting titles, content, and action items. Find anything instantly.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Format Export</h3>
              <p className="text-purple-100">
                Export to JSON, PDF, Trello, and Notion. Integrate seamlessly with your workflow.
              </p>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Secure & Private</h3>
              <p className="text-purple-100">
                JWT authentication, encrypted data, role-based access control. Your data is safe.
              </p>
            </div>
          </div>

          {/* Feature 6 */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500 to-fuchsia-600 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity blur-xl" />
            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl hover:border-purple-500/50 transition-colors">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Version History</h3>
              <p className="text-purple-100">
                Track all AI analysis versions. Edit analyses and see change history automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">10k+</div>
            <p className="text-purple-100 mt-2">Meetings Analyzed</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">500+</div>
            <p className="text-purple-100 mt-2">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">99.9%</div>
            <p className="text-purple-100 mt-2">Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-300 bg-clip-text text-transparent">24/7</div>
            <p className="text-purple-100 mt-2">Support</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative border-t border-slate-700/50 mt-20 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-purple-200">
            © 2026 MeetingAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

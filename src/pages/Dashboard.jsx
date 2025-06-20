// ============================================================================
// Dashboard Page Component  
// ============================================================================
import React from 'react';
import { Users, FileText, Clock, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data - replace with real data from your API
  const stats = [
    { name: 'Total Questions', value: '1,234', icon: FileText, change: '+12%', changeType: 'increase' },
    { name: 'Active Users', value: '89', icon: Users, change: '+5%', changeType: 'increase' },
    { name: 'Questions This Month', value: '156', icon: Clock, change: '+8%', changeType: 'increase' },
    { name: 'Success Rate', value: '87%', icon: TrendingUp, change: '+3%', changeType: 'increase' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your question bank system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {item.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <FileText className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" />
                    Create Question
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add a new question to your bank
                  </p>
                </div>
              </button>

              <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <Users className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" />
                    Manage Users
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Add or edit system users
                  </p>
                </div>
              </button>

              <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    <TrendingUp className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">
                    <span className="absolute inset-0" />
                    View Reports
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Check usage statistics
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {[
                  { action: 'Created new question', user: 'John Doe', time: '2 hours ago' },
                  { action: 'Updated question bank', user: 'Jane Smith', time: '4 hours ago' },
                  { action: 'Added new user', user: 'Admin', time: '1 day ago' },
                ].map((activity, activityIdx) => (
                  <li key={activityIdx}>
                    <div className="relative pb-8">
                      {activityIdx !== 2 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <FileText className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span> {activity.action}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

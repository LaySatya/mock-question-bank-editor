import React, { useState } from 'react';
import { BookOpen, Users, Layers, Clock, TrendingUp, CheckCircle, AlertCircle, Calendar, Star } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { title: 'Total Questions', value: '2,345', icon: <BookOpen size={24} />, color: 'bg-blue-500', trend: '+15%', trendUp: true },
    { title: 'Active Students', value: '1,023', icon: <Users size={24} />, color: 'bg-green-500', trend: '+8%', trendUp: true },
    { title: 'Course Paths', value: '48', icon: <Layers size={24} />, color: 'bg-amber-500', trend: '+3', trendUp: true },
    { title: 'Average Progress', value: '68%', icon: <Clock size={24} />, color: 'bg-purple-500', trend: '+5%', trendUp: true },
  ];

  const courseData = [
    { id: 1, name: 'Biology 101', enrolled: 145, completion: 75, rating: 4.8 },
    { id: 2, name: 'Chemistry Basics', enrolled: 98, completion: 60, rating: 4.5 },
    { id: 3, name: 'Physics Fundamentals', enrolled: 120, completion: 90},
    { id: 3, name: 'Physics Fundamentals', enrolled: 120, completion: 90, rating: 4.9 },
    { id: 4, name: 'Math Concepts', enrolled: 210, completion: 85, rating: 4.7 },
  ];

  const recentActivity = [
    { id: 1, action: 'Question Bank "Science Quiz" updated', user: 'Mr. Johnson', time: '2h ago', avatar: '👨‍🔬' },
    { id: 2, action: 'New course "Advanced Mathematics" created', user: 'Ms. Williams', time: '4h ago', avatar: '👩‍🏫' },
    { id: 3, action: 'Student reports generated for Q2', user: 'System', time: '1d ago', avatar: '🤖' },
    { id: 4, action: 'Quiz "Chemistry Basics" edited', user: 'Dr. Smith', time: '2d ago', avatar: '👨‍🔬' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'End of Term Exams', date: 'May 15, 2025', type: 'exam' },
    { id: 2, title: 'Teacher Training Workshop', date: 'May 10, 2025', type: 'training' },
    { id: 3, title: 'Science Fair Projects Due', date: 'May 20, 2025', type: 'deadline' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening in your learning platform.</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-primary">
            <Layers size={18} className="mr-2" /> Create New Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <div className={`text-sm px-2 py-1 rounded-md flex items-center ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trendUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingUp size={14} className="mr-1 transform rotate-180" />}
                {stat.trend}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h2 className="text-3xl font-bold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Top Performing Courses</h2>
              <button className="btn btn-ghost btn-sm text-primary">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Students</th>
                    <th>Completion</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.map(course => (
                    <tr key={course.id}>
                      <td className="font-medium">{course.name}</td>
                      <td>{course.enrolled}</td>
                      <td>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${course.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{course.completion}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500 mr-1" fill="#FBBF24" />
                          <span>{course.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <button className="btn btn-ghost btn-sm text-primary">
              <Calendar size={16} className="mr-1" /> Calendar
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center p-3 border rounded-lg">
                <div className={`
                  p-3 rounded-full mr-4
                  ${event.type === 'exam' ? 'bg-red-100 text-red-600' : 
                    event.type === 'training' ? 'bg-blue-100 text-blue-600' : 
                    'bg-amber-100 text-amber-600'}
                `}>
                  {event.type === 'exam' ? <AlertCircle size={20} /> : 
                   event.type === 'training' ? <Users size={20} /> : 
                   <Clock size={20} />}
                </div>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start p-3 border-b last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-xl mr-3">
                  {activity.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{activity.action}</p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-500">by {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-outline btn-sm w-full mt-4">View All Activity</button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-500 mr-2" />
                <span className="font-medium">All systems operational</span>
              </div>
              <span className="text-sm text-gray-500">Updated 5m ago</span>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Storage Usage</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>45% used (450GB of 1TB)</span>
                <span>Upgrade</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Question Bank Health</h3>
                <div className="flex items-center mt-2">
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                  <span className="font-medium">Excellent</span>
                </div>
              </div>
              <div className="bg-base-200 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Data Backup</h3>
                <div className="flex items-center mt-2">
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                  <span className="font-medium">Up to date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
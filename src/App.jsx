import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import QuestionBank from './pages/QuestionBank';
import ManageUsers from './pages/ManageUsers';
import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard'; // If you have a Dashboard component

// const App = () => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarCollapsed(prev => !prev);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar collapsed={sidebarCollapsed} />
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header toggleSidebar={toggleSidebar} />
//         <main className="flex-1 overflow-auto p-4">
//           <Routes>
//             {/* <Route path="/" element={<Dashboard />} /> */}
            
//             <Route path="/" element={<LoginPage />} />
//             <Route path="/" element={<QuestionBank />} />
            
//             <Route path="/question-bank" element={<QuestionBank />} />
//             <Route path="/manage-users" element={<ManageUsers />} />
//             <Route path="*" element={<div className="text-center p-10">Page not found</div>} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default App;
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
// ...other imports

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <QuestionBank />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/question-bank"
              element={
                <>
                  <SignedIn>
                    <QuestionBank />
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="*" element={<div className="text-center p-10">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
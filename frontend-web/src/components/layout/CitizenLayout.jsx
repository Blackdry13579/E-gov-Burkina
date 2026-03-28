import { Outlet } from 'react-router-dom';
import CitizenTopNav from './CitizenTopNav';
import { useAuth } from '../../context/AuthContext';

const CitizenLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 flex-col">
      {/* Universal Top Navigation */}
      <CitizenTopNav />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Main Content Area — Scrollable */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-12 relative z-0">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full w-full pt-2 pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CitizenLayout;

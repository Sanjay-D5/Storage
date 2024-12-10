import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/actions/user.action';
import MobileNavigation from './MobileNavigation';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from "@/components/ui/toaster"

interface User {
  fullName: string;
  avatar: string;
  email: string;
  ownerId: string;
  accountId: string;
  $id: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/signin");
      } else {
        setCurrentUser(user);
      }
    };

    fetchUser();
  }, [navigate]);

  if (!currentUser) return null; // Optionally, you can show a loading indicator

  return (
    <main className="flex h-screen">
      <Sidebar fullName={currentUser.fullName} avatar={currentUser.avatar} email={currentUser.email} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation ownerId={currentUser.ownerId} accountId={currentUser.accountId} fullName={currentUser.fullName} avatar={currentUser.avatar} email={currentUser.email}/>
        <Header userId={currentUser.$id} accountId={currentUser.accountId}/>
        <div className="main-content">
          {/* Render the pages here */}
          <Outlet />
        </div>
      </section>
      <Toaster />
    </main>
  );
};

export default Home;

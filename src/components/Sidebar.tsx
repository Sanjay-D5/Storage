import { navItems } from "@/contants";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}
const Sidebar = ({fullName, avatar, email}: Props) => {
  return (
    <aside className="sidebar">
      <NavLink to="/home">
        <img src="/assets/images/logoName.png" alt="logo" width={200} height={90} className="hidden h-auto lg:block" />
        <img src="/assets/images/logoName.png" alt="logo" width={52} height={52} className="lg:hidden"/>
      </NavLink>

      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ url, name, icon }) => (
            <NavLink
              key={name}
              to={`/home${url}`}
              className={({ isActive }) =>
                cn("sidebar-nav-item hover:shad-active lg:w-full", {
                  "shad-active": isActive
                })
              }
              end
            >
              <li className="flex items-center gap-2">
                <img src={icon} alt={name} width={24} height={24} className="h-6 w-6" />
                <p className="lg:block hidden">{name}</p>
              </li>
            </NavLink>
          ))}
        </ul>
      </nav>

      <img src="/assets/images/files-2.png" alt="logo" width={506} height={418} className="w-full"/>
      <div className="sidebar-user-info">
        <img src={avatar} alt="Avatar" width={44} height={44} className="sidebar-user-avatar" />
        <div className="hidden lg:block">
          <p className="subtitle-2 capitalize">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

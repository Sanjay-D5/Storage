import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { Separator } from "./ui/separator";
import { navItems } from "@/contants";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.action";

interface Props {
  ownerId: string; 
  accountId: string; 
  fullName: string; 
  avatar: string; 
  email: string;
}

const MobileNavigation = ({ownerId, accountId, fullName, avatar, email}: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/signin");
  }

  return (
    <header className="mobile-header">
      <img src="/assets/images/logoName.png" alt="logo" width={170} height={52} className="h-auto" />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <img src="/assets/icons/menu.svg" alt="search" width={30} height={30} />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          
          <SheetTitle>
            <div className="header-user">
              <img src={avatar} alt="avatar" width={44} height={44} className="header-user-avatar"/>
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-4 bg-light-200/20"/>
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map(({ url, name, icon }) => (
                <NavLink
                  key={name}
                  to={`/home${url}`}
                  className={({ isActive }) =>
                    cn("mobile-nav-item hover:shad-active lg:w-full", {
                      "shad-active": isActive
                    })
                  }
                  end
                >
                  <li className="flex items-center gap-2">
                    <img src={icon} alt={name} width={24} height={24} className="h-6 w-6" />
                    <p>{name}</p>
                  </li>
                </NavLink>
              ))}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20"/>

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={ownerId} accountId={accountId}/>

            <Button type='submit' className='mobile-sign-out-button' onClick={handleSignOut}>
              <img src="/assets/icons/logout.svg" alt="logo" width={24} height={24} /> 
              <p>Logout</p>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
  
    </header>
  )
}

export default MobileNavigation
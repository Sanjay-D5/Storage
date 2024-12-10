import { signOutUser } from '@/lib/actions/user.action'
import FileUploader from './FileUploader'
import Search from './Search'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const Header = ({userId, accountId}: {userId: string; accountId: string}) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/signin");
  }
  return (
    <header className='header'>
      <Search/>
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId}/>
        
        <Button type='submit' className='sign-out-button' onClick={handleSignOut}>
          <img src="/assets/icons/logout.svg" alt="logo" width={24} height={24} className='w-6' />
        </Button>
      </div>
    </header>
  )
}

export default Header
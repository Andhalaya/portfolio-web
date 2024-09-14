import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import * as Icons from "../assets/Icons"

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return <Icons.LuLogOut onClick={handleSignOut} className='icon'/>;
};

export default SignOutButton;
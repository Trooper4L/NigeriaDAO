import { auth } from '@/lib/config/firebase';
import { 
  signInAnonymously, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { User } from '@/lib/types';

export class AuthService {
  static async signInAnonymous(): Promise<FirebaseUser> {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  }

  static onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          createdAt: Date.now(),
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  static async signOut(): Promise<void> {
    await auth.signOut();
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

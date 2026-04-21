import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';
import type { Role, AppwriteUser } from '@/types';

export const authService = {
  async register(name: string, email: string, password: string, role: Role): Promise<AppwriteUser> {
    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    await account.updatePrefs({ role });
    const user = await account.get();
    return user as unknown as AppwriteUser;
  },

  async login(email: string, password: string): Promise<AppwriteUser> {
    await account.createEmailPasswordSession(email, password);
    const user = await account.get();
    return user as unknown as AppwriteUser;
  },

  async logout(): Promise<void> {
    await account.deleteSession('current');
  },

  async getUser(): Promise<AppwriteUser | null> {
    try {
      const user = await account.get();
      return user as unknown as AppwriteUser;
    } catch {
      return null;
    }
  },
};
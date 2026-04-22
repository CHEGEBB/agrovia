import { account, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import type { Role, AppwriteUser } from '@/types';

const DB_ID = 'agrovia';
const USERS_COLLECTION_ID = 'users';

export const authService = {
  async register(name: string, email: string, password: string, role: Role = 'agent'): Promise<AppwriteUser> {
    // Kill any existing session first
    try { await account.deleteSession('current'); } catch { /* none */ }

    const created = await account.create(ID.unique(), email, password, name);
    await account.createEmailPasswordSession(email, password);

    // Save user record with role in our collection
    await databases.createDocument(DB_ID, USERS_COLLECTION_ID, created.$id, {
      userId: created.$id,
      name,
      email,
      role,
    });

    const user = await account.get();
    return { ...user, prefs: { role } } as unknown as AppwriteUser;
  },

  async login(email: string, password: string): Promise<AppwriteUser> {
    // Kill any existing session first so no ghost sessions
    try { await account.deleteSession('current'); } catch { /* none */ }

    await account.createEmailPasswordSession(email, password);
    const user = await account.get();

    // Fetch role from our users collection
    const docs = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID, [
      Query.equal('userId', user.$id),
    ]);

    const role: Role = docs.total > 0 ? (docs.documents[0].role as Role) : 'agent';

    return { ...user, prefs: { role } } as unknown as AppwriteUser;
  },

  async logout(): Promise<void> {
    try { await account.deleteSession('current'); } catch { /* already gone */ }
  },

  async getUser(): Promise<AppwriteUser | null> {
    try {
      const user = await account.get();

      const docs = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID, [
        Query.equal('userId', user.$id),
      ]);

      const role: Role = docs.total > 0 ? (docs.documents[0].role as Role) : 'agent';

      return { ...user, prefs: { role } } as unknown as AppwriteUser;
    } catch {
      return null;
    }
  },
};
import { IEUser, INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, avatars, databases, appwriteConfig } from "./config";
export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.username);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });
    return newAccount;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveUserToDB = async (user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) => {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const signInAccount = async (user: IEUser) => {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    console.log(session);
    return session;
  } catch (error) {
    console.log(error);
  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    console.log(currentAccount);
    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    console.log(currentAccount);
    if (!currentAccount) throw Error;
    console.log("Arif", appwriteConfig.userCollectionId);
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );
    console.log(currentUser);
    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
};

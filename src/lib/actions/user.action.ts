// **Create account flow**
// 1. User enters full name and email
// 2. Check if the user already exist using the email (we will use this to identify if we still need to create a user document or not)
// 3. Send OTP to user's email
// 4. This will send a secret key for creating a session. 
// 5. Create a new user document if the user is a new user
// 6. Return the user's accountId that will be used to complete the login
// 7. Verify OIP and authenticate the login

import { createAdminClient, createSessionClient } from "@/appwrite";
import { appwriteConfig } from "@/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import Cookies from "js-cookie";
import { avatarPlaceholderUrl } from "@/contants";


// helper function
const getUserByEmail = async(email: string) => {
    
    const {databases} = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const sendEmailOTP = async ({email}: {email: string}) => {
    const {account} = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
};

// create account
export const createAccount = async ({fullName, email}: {fullName: string; email: string}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });
    if(!accountId) throw new Error("Failed to send an OTP");

    if(!existingUser){
        const {databases} = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
            },
        );
    }
    return parseStringify({accountId});
};

// verify OTP
export const verifySecret = async ({ accountId, password }: { accountId: string; password: string }) => 
{ 
    try { 
        const { account } = await createAdminClient(); 
        const session = await account.createSession(accountId, password); 
            Cookies.set("appwrite-session", session.secret, { // Directly use the `Cookies` object 
            path: "/", 
            sameSite: "strict", 
            secure: true, 
        }); 
        return parseStringify({ sessionId: session.$id }); 
    } catch (error) {
        handleError(error, "Failed to verify OTP"); 
    } 
};

// fetch the current user
export const getCurrentUser = async () => {
    const {databases, account} = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountId", result.$id)],
    );

    if(user.total <= 0) return null;

    return parseStringify(user.documents[0]);
};

// sign-out user
export const signOutUser = async () => {
    const {account} = await createSessionClient();

    try {
        await account.deleteSession("current");
        Cookies.remove("appwrite-session");
    } catch (error) {
        handleError(error, "Failed to sign out user")
    }
};

// sign-in user
export const signInUser = async ({ email }: { email: string }) => {
    try {
      const existingUser = await getUserByEmail(email);
  
      // User exists, send OTP
      if (existingUser) {
        await sendEmailOTP({ email });
        return parseStringify({ accountId: existingUser.accountId });
      }
  
      return parseStringify({ accountId: null, error: "User not found" });
    } catch (error) {
      handleError(error, "Failed to sign in user");
    }
  };
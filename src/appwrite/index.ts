import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import Cookies from 'js-cookie';

// client is used to initialize database and services and connect it . there are two ways to create a clinet -> AdminClient , SessionClient . This client will be linked to specific user session letting user to access data and perform action they are allowed to.
export const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId);

    const session = Cookies.get('appwrite-session'); // Get the session cookie using js-cookie

    if (!session) throw new Error('No session'); 
    
    client.setSession(session); 

    return { 
        get account() {
            return new Account(client); 
        }, 
        get databases() {
            return new Databases(client); 
        }
    }
};


// This create a clinet instance with admin level permission to manage your entier appwrite project. Only use it on server when we need to create user , manage database , handle task , that need a higher level access this never exposed to user.

// for every request create to new client for privacy

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpointUrl)
        .setProject(appwriteConfig.projectId)
        .setKey(appwriteConfig.secretKey);

    return { 
        get account() {
            return new Account(client); 
        }, 
        get databases() {
            return new Databases(client); 
        },
        get storage(){
            return new Storage(client);
        },
        get avatars(){
            return new Avatars(client);
        }
    }
}
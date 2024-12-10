export const appwriteConfig = {
    endpointUrl: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId:import.meta.env.VITE_APPWRITE_PROJECT,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE,
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION,
    filesCollectionId: import.meta.env.VITE_APPWRITE_FILES_COLLECTION,
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET,
    secretKey: import.meta.env.VITE_APPWRITE_KEY!,
};

// helps in accesing a keys through variables
// secretkey will be private
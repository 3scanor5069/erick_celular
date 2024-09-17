import 'react-native-url-polyfill/auto'; 
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.jsm.aora',
  projectId: '66e11c770022184bac41',
  databaseId: '66e11e87002cecb3545d',
  userCollectionId: '66e11edd001e4200800f',
  videoCollectionId: '66e11ef3002a2e2e09a8',
  storageId: '66e12196002401fa4198'
};

const {
  endpoint,
  plataform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId)  // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Revisar si hay una sesión activa
export const checkSession = async () => {
  try {
    const session = await account.get();  // Revisa si existe alguna sesión activa
    return session ? true : false;  // Devuelve true si existe, false si no
  } catch (error) {
    console.log('inactiva sesión encontrada.');
    return false;
  }
};

// Crear un nuevo usuario
export const createUser = async (email, password, username) => {
  try {
    console.log('Ttando de crear usuario...');

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    console.log('Usuario creado:', newAccount);

    if (!newAccount) throw Error;

    // Generar avatar (obligatorio según la base de datos)
    const avatarUrl = avatars.getInitials(username); // Crear un avatar básico
    console.log('Avatar URL:', avatarUrl);


    // Crear el nuevo documento de usuario en la base de datos
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        username,
        email,
        accountId: newAccount.$id,
        avatar: avatarUrl // Añadir el avatar
      }
    );
    console.log('documento de usuario  creado en la base de datos:', newUser);


    // Iniciar sesión después de crear el usuario
    await signIn(email, password);  

    return newUser;
  } catch (error) {
    console.log('Error al crear el usuario:', error);
    throw new Error(error.message);
  }
};

// Iniciar sesión solo con credenciales válidas
export const signIn = async (email, password) => {
  try {
    // Verifica si ya existe una sesión activa
    const hasSession = await checkSession();
    if (hasSession) {
      console.log('Sesion activa, cargando out first...');
      await account.deleteSession('current');  // Cerrar la sesión activa
    }
    console.log('Tratando de iniciar sesion...');

    // Crear una nueva sesión
    const session = await account.createEmailPasswordSession(email, password);
    console.log('Sesion creada:', session);

    return session;
  } catch (error) {
    console.log('Error al iniciar sesion:', error);

    throw new Error(error.message);
  }
};

// Obtener el usuario actual
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};


//obtener todos los post de videos
export const getAllPost = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )
      return posts.documents
     } catch (error) {
      throw new Error(error);
     }
}


//obtener los últimos post de videos creados
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
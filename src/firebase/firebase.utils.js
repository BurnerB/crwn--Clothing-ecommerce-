import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyArmmrjW4tg_7s53xeAdZYDQwt4XldqkE8",
    authDomain: "clothing-db-28859.firebaseapp.com",
    databaseURL: "https://clothing-db-28859.firebaseio.com",
    projectId: "clothing-db-28859",
    storageBucket: "clothing-db-28859.appspot.com",
    messagingSenderId: "521151961693",
    appId: "1:521151961693:web:43eea7686b73efe59a0bb4",
    measurementId: "G-Q4B49Y01VV"
  };

export const createUserProfileDocument  = async(userAuth, additionalData) => {
  if(!userAuth) return;

  

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get()

  if (!snapShot.exists){
    const { displayName, email} = userAuth;

    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      })
    } catch (error) {
      console.log('error creating user', error.message)
      
    }
  }
  return userRef;
};



export const addCollectionAndDocuments = async( collectionKey, objectToAdd) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();

  objectToAdd.forEach(obj => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef,obj)
  });

  return await batch.commit();
};


export const convertCollectionsSnapshotToMap = (collections) =>{
  const transformedCollection = collections.docs.map(doc => {
    const { title,items} = doc.data();

    return{
      routeName: encodeURI(title.toLowerCase()),
      id:doc.id,
      title,
      items
    }
  });

  return transformedCollection.reduce( (accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  },{})

}

firebase.initializeApp(config);

export const auth = firebase.auth();

export const firestore = firebase.firestore();





const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt:'select_account'});

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
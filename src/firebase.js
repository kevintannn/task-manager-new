import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAHvz6mbeD1ML3zrTUUIDD1F2kDp5Uo2Js",
  authDomain: "task-manager-28866.firebaseapp.com",
  databaseURL:
    "https://task-manager-28866-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "task-manager-28866",
  storageBucket: "task-manager-28866.appspot.com",
  messagingSenderId: "1038705529285",
  appId: "1:1038705529285:web:c23be5b7634079a53a3bac",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();

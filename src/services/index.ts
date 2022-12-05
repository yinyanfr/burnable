// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref as dbRef,
  remove,
  serverTimestamp,
  set,
} from "firebase/database";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { firebaseConfig } from "./firebase";
import shortUUID from "short-uuid";
import type { RcFile } from "antd/es/upload";
import dayjs from "dayjs";

const uuid = shortUUID();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
const storage = getStorage(app);

export async function sendMessage(roomId: string, msg: ChatMessage) {
  const msgId = uuid.generate();
  const date = serverTimestamp();
  const payload = { ...msg, date };
  const msgRef = dbRef(database, `msg/${roomId}/${msgId}`);
  await set(msgRef, payload);
  return msgId;
}

export async function uploadImage(
  roomId: string,
  msgId: string,
  file: RcFile | Blob
) {
  const date = dayjs().format("YYYYMMDDHHmmss");
  const ext = file.type.split("/")[1] || "jpg";
  const filename = `${roomId}/${msgId}/${date}-${uuid.generate()}.${ext}`;
  const imageRef = storageRef(storage, filename);
  await uploadBytes(imageRef, file);
  return filename;
}

export async function getImageUrls(filenames: string[] = []) {
  if (!Array.isArray(filenames)) return [];
  const reqs = filenames.map((filename) =>
    getDownloadURL(storageRef(storage, filename))
  );
  const res = await Promise.allSettled(reqs);
  return res.map((e) => (e.status === "fulfilled" ? e.value : null));
}

export async function deleteImage(roomId: string, msgId: string) {
  await deleteObject(storageRef(storage, `${roomId}/${msgId}`));
  return msgId;
}

export async function deleteMessage(roomId: string, msgId: string) {
  const msgRef = dbRef(database, `msg/${roomId}/${msgId}`);
  await remove(msgRef);
  await deleteImage(roomId, msgId);
  return msgId;
}

export async function destroyRoom(roomId: string) {
  await remove(dbRef(database, `msg/${roomId}`));
  await deleteObject(storageRef(storage, roomId));
  return roomId;
}

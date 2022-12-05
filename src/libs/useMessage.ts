import { database, deleteMessage, sendMessage } from "@/services";
import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";

function useMessage(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const roomMsgRef = ref(database, `msg/${roomId}`);

  useEffect(() => {
    onValue(roomMsgRef, (snapshot) => {
      const data: ChatMessage[] = snapshot.val();
      setMessages(data);
    });
  }, []);

  function send(msg: ChatMessage) {
    return sendMessage(roomId, msg);
  }

  function withdraw(msgId: string) {
    return deleteMessage(roomId, msgId);
  }

  return [messages, { send, withdraw }];
}

export default useMessage;

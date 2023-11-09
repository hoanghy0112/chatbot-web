import React, { createContext, PropsWithChildren } from "react";
import { fakeChatList } from "./mock";
import { v4 } from "uuid";

const API_ENDPOINT =
  "https://mutually-knowing-bull.ngrok-free.app/api/get_answer";

type ChatBotContextType = {
  chatList: IChatItem[];
  setChatList: React.Dispatch<React.SetStateAction<IChatItem[]>>;
  lastChat: IChatItem | null;
  setLastChat?: React.Dispatch<React.SetStateAction<IChatItem | null>>;
  handleSendText: (text: string) => Promise<void>;
  chatText: string;
  setChatText: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatBotContext = createContext<ChatBotContextType>({
  chatList: fakeChatList(),
  setChatList: () => {},
  lastChat: null,
  setLastChat: () => {},
  handleSendText: async () => {},
  chatText: "",
  setChatText: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const ChatBotProvider = ({ children }: PropsWithChildren) => {
  const [chatList, setChatList] = React.useState<IChatItem[]>(fakeChatList());
  const [lastChat, setLastChat] = React.useState<IChatItem | null>(null);
  const [chatText, setChatText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (chatList.length > 0) {
      setLastChat(chatList[chatList.length - 1]);
      localStorage.setItem("chatList", JSON.stringify(chatList));
    }
  }, [chatList]);

  const handleSendText = async (text: string) => {
    if (!text) return;
    setIsLoading(true);
    setChatText("");
    setChatList((prev) => [
      ...prev,
      { id: v4(), content: text, type: "client" },
    ]);
    // setTimeout(() => {
    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          database: ["q", "tthc"],
          dead: false,
          roomId: "111111111111111111111111",
        }),
      });
      if (res.status !== 200) {
        throw new Error((await res.text()) || "Timeout");
      }
      const data = (await res.json()) as IChatRespone;
      setIsLoading(false);

      // const data: IChatRespone = {
      //   answer: "Đây là câu trả lời",
      //   ref: [
      //     {
      //       link: "https://google.com",
      //       title: "Đây là link",
      //     },
      //   ],
      //   related_q: ["Câu hỏi liên quan 1", "Câu hỏi liên quan 2"],
      //   related_tthc: ["TTHC liên quan 1", "TTHC liên quan 2"],
      // };
      setChatList((prev) => [
        ...prev,
        {
          id: v4(),
          content: data.answer,
          type: "bot",
          reference: data.ref,
          ...data,
        },
      ]);
    } catch {
      setChatList((prev) => [
        ...prev,
        {
          id: v4(),
          content: "Xin lôi, tôi không hiểu câu hỏi của bạn.",
          type: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
    // }, 5000);
  };

  const value = {
    chatList,
    setChatList,
    lastChat,
    handleSendText,
    chatText,
    setChatText,
    isLoading,
    setIsLoading,
  };

  return (
    <ChatBotContext.Provider value={value}>{children}</ChatBotContext.Provider>
  );
};

export const useChatBotContext = () => React.useContext(ChatBotContext);

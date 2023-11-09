import { v4 } from "uuid";

export const fakeChatList: () => IChatItem[] = () => {
  if (localStorage.getItem("chatList")) {
    return JSON.parse(localStorage.getItem("chatList") || "[]");
  }
  return [
    {
      content: "Tôi là robot hỏi đáp dịch vụ công. Tôi có thể giúp gì cho bạn?",
      id: v4(),
      type: "bot",
    },
  ];
};

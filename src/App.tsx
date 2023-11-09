/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useRef } from "react";
import { useChatBotContext } from "./ChatBotContext";
import ChatItem from "./ChatItem";
import SendIcon from "./SendIcon";
import Generating from "./Generating";
import CancelFetch from "./CancelFetch";

function App() {
  const { chatList, handleSendText, setChatText, chatText, isLoading } =
    useChatBotContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
    inputRef.current?.focus();
  }, [chatList.length]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inputRef.current && inputRef.current?.focus();
      }
    });
  }, []);

  const send = async () => {
    await handleSendText(chatText);
  };

  const refresh = () => {
    localStorage.removeItem("chatList");
    window.location.reload();
  };

  return (
    <div className="w-full h-screen flex flex-col justify-end bg-slate-50">
      <div className="p-5 border-b-1 shadow-md bg-white flex items-center justify-between">
        <h1 className="flex gap-2 font-bold text-3xl">
          <span className="text-[#bf0000]">Chatbot</span>
          <span>Hỏi đáp dịch vụ công</span>
        </h1>
        <button
          className="hover:text-[#bf0000] text-gray-400"
          onClick={refresh}
        >
          Xóa và làm mới cuộc trò chuyện
        </button>
      </div>
      <div
        className="h-full overflow-auto scroll-smooth pt-4 flex flex-col gap-4 pb-[160px]"
        id="content"
      >
        {chatList.map((item) => {
          return <ChatItem key={item.id} {...item} />;
        })}
        {isLoading && <Generating />}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-col p-5 pt-10 fixed right-0 left-0 bottom-0 z-[99] gap-8 bg-gradient-to-t from-white via-white to-gray">
        <div className="flex gap-3 rounded-2xl border border-input bg-white py-3 px-4 shadow-custom">
          <input
            ref={inputRef}
            autoFocus
            placeholder={
              isLoading ? "Đang trả lời..." : "Nhập câu hỏi của bạn..."
            }
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            type="text"
            disabled={isLoading}
            className="w-full rounded-md outline-none bg-white"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          {isLoading ? (
            <CancelFetch />
          ) : (
            <button
              className={`flex flex-row items-center transition-opacity justify-center p-2 bg-[#bf0000] rounded-md ${
                chatText === "" ? "opacity-20" : ""
              }`}
              disabled={isLoading || chatText === ""}
              onClick={send}
            >
              <SendIcon width={16} height={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

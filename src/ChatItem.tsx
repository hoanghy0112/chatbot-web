import React from "react";
import Avatar from "./Avatar";
import ChatbotIcon from "./ChatbotIcon";
import ChatHelpIcon from "./ChatHelpIcon";
import { useChatBotContext } from "./ChatBotContext";

const _ChatItem = ({
  content,
  id,
  type,
  reference,
  related_q,
  related_tthc,
}: IChatItem) => {
  const { lastChat, handleSendText } = useChatBotContext();
  const [renderQ, setRenderQ] = React.useState<string[]>([""]);
  const onPressRelatedQ = () => {
    setRenderQ(related_q || [""]);
  };
  const onPressRelatedTTHC = () => {
    setRenderQ(related_tthc || [""]);
  };

  const onPressQ = (selectedQ: string) => {
    handleSendText(selectedQ);
  };

  const returnQ = () => {
    setRenderQ([""]);
  };

  return (
    <div className="px-5 flex gap-2 md:max-w-[70%] w-full">
      <div className="self-start -mt-2">
        {type === "client" ? (
          <Avatar width={40} height={40} />
        ) : (
          <ChatbotIcon width={46} height={46} />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div
          className={`rounded-b-2xl rounded-tr-2xl ${
            type === "client" ? "bg-[#bf0000]" : "bg-white"
          } shadow-custom h-fit`}
        >
          <p
            className={`px-4 py-2 whitespace-pre-wrap ${
              reference && reference.length > 0 ? "border-b" : ""
            } ${type === "client" ? "text-white" : "text-black"}`}
          >
            {content}
          </p>
          {reference && reference.length > 0 && (
            <div className="flex gap-2 px-4 py-2 items-center flex-wrap">
              <p className="text-sm font-bold">Tham khảo:</p>
              {reference.map(({ link, title }, index) => (
                <a
                  key={`href-${title}-${index}}`}
                  href={link}
                  target="_blank"
                  className="px-2 rounded-md hover:bg-[#bf0000] hover:text-white ring-1 ring-[#bf0000] text-[#bf0000] text-sm line-clamp-1 max-w-[300px]"
                  title={title}
                >
                  {title}
                </a>
              ))}
            </div>
          )}
        </div>
        {lastChat &&
          lastChat.id === id &&
          ((related_q && related_q.length > 0) ||
            (related_tthc && related_tthc.length > 0)) && (
            <div className="flex items-center gap-4 flex-wrap">
              <ChatHelpIcon width={20} height={20} fill="#bf0000" />
              {renderQ.length > 0 && renderQ[0] === "" && related_q && (
                <button
                  className="rounded-md ring-1 hover:text-white ring-[#bf0000] text-[#bf0000] text-sm px-2 hover:bg-[#bf0000]"
                  onClick={onPressRelatedQ}
                >
                  Câu hỏi liên quan
                </button>
              )}
              {renderQ.length > 0 && renderQ[0] === "" && related_tthc && (
                <button
                  className="rounded-md ring-1 hover:text-white ring-[#bf0000] text-[#bf0000] text-sm px-2 hover:bg-[#bf0000]"
                  onClick={onPressRelatedTTHC}
                >
                  Thủ tục hành chính liên quan
                </button>
              )}
              {renderQ.length > 0 &&
                renderQ[0] !== "" &&
                renderQ.map((q, index) => (
                  <button
                    className="rounded-md ring-1 hover:text-white ring-[#bf0000] text-[#bf0000] text-sm px-2 hover:bg-[#bf0000] text-left"
                    onClick={() => onPressQ(q)}
                    key={`q-${index}-${q}`}
                  >
                    {q}
                  </button>
                ))}
              {renderQ.length > 0 && renderQ[0] !== "" && (
                <button
                  onClick={returnQ}
                  className="text-sm underline text-[#bf0000]"
                >
                  Trở lại
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
};
const ChatItem = React.memo(_ChatItem);
export default ChatItem;

import ChatbotIcon from "./ChatbotIcon";
import { TypeAnimation } from "react-type-animation";

const Generating = () => {
  return (
    <div className="flex items-center gap-4 px-5">
      <ChatbotIcon width={46} height={46} />
      <p className="text-left text-sm text-gray-500 font-semibold">
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed once, initially
            "Chatbot đang trả lời câu hỏi của bạn.",
            500,
            "Chatbot đang trả lời câu hỏi của bạn..",
            500,
            "Chatbot đang trả lời câu hỏi của bạn...",
            500,
          ]}
          speed={99}
          style={{
            fontSize: "1rem",
          }}
          repeat={Infinity}
        />
      </p>
    </div>
  );
};

export default Generating;

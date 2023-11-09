import { useChatBotContext } from "./ChatBotContext";

const CancelFetch = () => {
  const { abortController } = useChatBotContext();
  const abort = () => {
    abortController?.abort();
  };

  return (
    <button className="text-[#bf0000] underline" onClick={abort}>
      Hủy
    </button>
  );
};

export default CancelFetch;

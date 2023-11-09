declare type IChatItem = {
  id: string;
  content: string;
  type: "client" | "bot";
  reference?: {
    link: string;
    title: string;
  }[];
  related_q?: string[];
  related_tthc?: string[];
};

declare type IChatRespone = {
  answer: string;
  question?: string;
  ref: {
    link: string;
    title: string;
  }[];
  related_q: string[];
  related_tthc: string[];
};

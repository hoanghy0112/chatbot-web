import { Spinner } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const API_ENDPOINT =
	"https://mutually-knowing-bull.ngrok-free.app/api/get_answer";

function App() {
	const [chatList, setChatList] = useState<IChatItem[]>([]);
	const [chatText, setChatText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	const handleSendText = useCallback(async () => {
		if (isLoading) return;

		setChatText("");
		setChatList((prev) => [
			...prev,
			{ id: v4(), content: chatText, type: "client" },
		]);

		setIsLoading(true);

		const res = await fetch(API_ENDPOINT, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				question: chatText,
				database: ["q", "tthc"],
				dead: false,
				roomId: "111111111111111111111111",
			}),
		});
		const data = (await res.json()) as IChatRespone;

		setChatList((prev) => [
			...prev,
			{ id: v4(), content: data.answer, type: "bot" },
		]);
		setIsLoading(false);
	}, [chatText, isLoading]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTo(
				0,
				chatContainerRef.current.getBoundingClientRect().height
			);
		}
	}, [chatList]);

	return (
		<div className=" w-full h-screen pb-5 flex flex-col justify-end">
			<div
				ref={chatContainerRef}
				className=" h-full overflow-auto px-5 py-3"
			>
				{chatList.map(({ id, content, type }) => (
					<div
						className={` my-3 ${type == "client" ? "" : "pr-10"}`}
						key={id}
					>
						<p
							className={` rounded-md p-4 w-max max-w-full whitespace-pre-wrap ${
								type === "client"
									? "ml-auto bg-slate-700"
									: " pr-5  bg-zinc-700"
							}`}
						>
							{content}
						</p>
					</div>
				))}
			</div>
			<div className=" w-full flex items-stretch gap-3 mt-5 px-5">
				<input
					value={chatText}
					onChange={(e) => setChatText(e.target.value)}
					type="text"
					className=" w-full rounded-md pl-5"
					onKeyDown={(e) => e.key === "Enter" && handleSendText()}
				/>
				<button
					className=" w-20 h-12 flex flex-row items-center justify-center"
					disabled={isLoading}
					onClick={handleSendText}
				>
					{isLoading ? <Spinner size="sm" /> : "Send"}
				</button>
			</div>
		</div>
	);
}

type IChatItem = {
	id: string;
	content: string;
	type: "client" | "bot";
};

type IChatRespone = {
	answer: string;
	question: string;
	ref: {
		link: string;
		title: string;
	}[];
	related_q: string[];
	related_tthc: string[];
};

export default App;

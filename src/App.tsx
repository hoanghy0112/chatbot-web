/* eslint-disable no-mixed-spaces-and-tabs */
import { Spinner } from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

const API_ENDPOINT =
	"https://mutually-knowing-bull.ngrok-free.app/api/get_answer";

function App() {
	const [chatList, setChatList] = useState<IChatItem[]>([]);
	const [chatText, setChatText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const bottomRef = useRef<HTMLDivElement>(null);

	const handleSendText = useCallback(
		async (text: string) => {
			if (isLoading) return;

			setChatText("");
			setChatList((prev) => [
				...prev,
				{ id: v4(), content: text, type: "client" },
			]);

			setIsLoading(true);

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
			const data = (await res.json()) as IChatRespone;

			setChatList((prev) => [
				...prev,
				{ id: v4(), content: data.answer, type: "bot", ...data },
			]);
			setIsLoading(false);
		},
		[isLoading]
	);

	const handleUserSendQuestion = useCallback(
		() => handleSendText(chatText),
		[chatText, handleSendText]
	);

	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView();
		}
	}, [chatList.length]);

	return (
		<div className=" w-full h-screen pb-5 flex flex-col justify-end">
			<div className=" h-full overflow-auto px-5 py-3 scroll-smooth">
				{chatList.map(
					({ id, content, type, ref, related_q, related_tthc }) => (
						<div
							className={` my-3 ${type == "client" ? "" : "pr-10"}`}
							key={id}
						>
							<p
								className={` flex flex-col rounded-md p-4 w-max max-w-full whitespace-pre-wrap ${
									type === "client"
										? "ml-auto bg-slate-700"
										: " pr-5  bg-zinc-700"
								}`}
							>
								{content}
								{type === "bot" ? (
									<span className=" mt-4">
										{ref?.map(({ link, title }) => (
											<a target="blank" href={link}>
												{title}
											</a>
										))}
									</span>
								) : null}
							</p>
							{type === "bot" ? (
								<div className=" mt-5">
									<div className=" flex gap-3 flex-wrap">
										{related_q
											? related_q.map((question) => (
													<button
														onClick={() =>
															handleSendText(question)
														}
													>
														{question}
													</button>
											  ))
											: null}
									</div>
									<div className="mt-3 flex gap-3 flex-wrap">
										{related_tthc
											? related_tthc.map((question) => (
													<button
														onClick={() =>
															handleSendText(question)
														}
													>
														{question}
													</button>
											  ))
											: null}
									</div>
								</div>
							) : null}
						</div>
					)
				)}
				<div ref={bottomRef} />
			</div>
			<div className=" w-full flex items-stretch gap-3 mt-5 px-5">
				<input
					value={chatText}
					onChange={(e) => setChatText(e.target.value)}
					type="text"
					className=" w-full rounded-md pl-5"
					onKeyDown={(e) => e.key === "Enter" && handleUserSendQuestion()}
				/>
				<button
					className=" w-20 h-12 flex flex-row items-center justify-center"
					disabled={isLoading}
					onClick={handleUserSendQuestion}
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
	ref?: {
		link: string;
		title: string;
	}[];
	related_q?: string[];
	related_tthc?: string[];
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

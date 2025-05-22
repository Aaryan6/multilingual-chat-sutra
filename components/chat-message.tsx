import type { Message } from "ai";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Split content by newline to handle multiline messages
  const contentLines = message.content.split("\n");

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm my-1 sm:my-2",
          isUser
            ? "bg-muted text-foreground"
            : "bg-gradient-to-br from-slate-700 to-slate-600 text-white"
        )}
      >
        {contentLines.map((line, i) => (
          <div key={i} className="break-words">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

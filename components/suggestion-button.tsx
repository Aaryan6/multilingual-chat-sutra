"use client";

import { Button } from "@/components/ui/button";

interface SuggestionButtonProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function SuggestionButton({
  title,
  subtitle,
  onClick,
}: SuggestionButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 sm:py-4 px-4 sm:px-5 flex flex-col items-start w-full rounded-xl border-gray-200 hover:bg-gray-50 transition-colors border"
      onClick={onClick}
    >
      <span className="font-medium text-left text-sm sm:text-base">
        {title}
      </span>
      <span className="text-gray-500 text-xs sm:text-sm text-left">
        {subtitle}
      </span>
    </Button>
  );
}

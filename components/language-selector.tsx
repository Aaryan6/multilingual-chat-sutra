"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

const languages = [
  "English",
  "Hindi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Marathi",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Urdu",
  "Odia",
  "Assamese",
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <Select defaultValue={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="h-8 sm:h-9 rounded-full bg-gray-200 hover:bg-gray-300 px-2 sm:px-3 gap-1 sm:gap-1.5 w-[70px] sm:w-auto text-xs sm:text-sm">
        <Languages className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <SelectValue
          placeholder={selectedLanguage}
          className="hidden sm:block"
        />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language} value={language}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

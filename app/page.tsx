"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import LanguageSelector from "@/components/language-selector";
import ChatMessage from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import SuggestionButton from "@/components/suggestion-button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { ApiKeyDialog } from "@/components/api-key-dialog";

export default function ChatPage() {
  const [language, setLanguage] = useState("English");
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedApiKey = localStorage.getItem("sutraApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    body: {
      language,
      apiKey,
    },
    onError: (error) => {
      console.error("Chat error:", error);
      if (error.message.includes("API key")) {
        setShowApiKeyDialog(true);
      }
    },
  });

  // Map languages to suggestion items
  const languageSuggestions = {
    English: [
      { title: "Tell me about", subtitle: "Indian classical music" },
      { title: "Explain", subtitle: "the history of India" },
      { title: "How to make", subtitle: "authentic Indian cuisine" },
      { title: "Compare", subtitle: "northern and southern Indian culture" },
    ],
    Hindi: [
      { title: "मुझे बताएं", subtitle: "भारत के प्रमुख त्योहारों के बारे में" },
      { title: "व्याख्या करें", subtitle: "भारत का इतिहास" },
      { title: "समझाइए", subtitle: "भारतीय व्यंजन कैसे बनाते हैं" },
      { title: "तुलना करें", subtitle: "उत्तर और दक्षिण भारतीय संस्कृति की" },
    ],
    Bengali: [
      { title: "আমাকে বলুন", subtitle: "ভারতীয় উৎসব সম্পর্কে" },
      { title: "ব্যাখ্যা করুন", subtitle: "ভারতের ইতিহাস" },
      {
        title: "আমাকে সাহায্য করুন",
        subtitle: "ভারতীয় রান্নার রেসিপি খুঁজতে",
      },
      { title: "তুলনা করুন", subtitle: "উত্তর ও দক্ষিণ ভারতীয় সংস্কৃতির" },
    ],
    Tamil: [
      { title: "எனக்கு சொல்லுங்கள்", subtitle: "இந்திய பண்டிகைகளைப் பற்றி" },
      { title: "விளக்குங்கள்", subtitle: "இந்தியாவின் வரலாறு" },
      { title: "எப்படி செய்வது", subtitle: "பாரம்பரிய இந்திய உணவு" },
      { title: "ஒப்பிடுங்கள்", subtitle: "வட மற்றும் தென் இந்திய கலாச்சாரம்" },
    ],
  };

  // Default to English suggestions for other languages
  const suggestions =
    languageSuggestions[language as keyof typeof languageSuggestions] ||
    languageSuggestions["English"];

  const handleSuggestionClick = (suggestion: string, newLanguage?: string) => {
    if (newLanguage) {
      setLanguage(newLanguage);
    }

    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    handleInputChange({
      target: { value: suggestion },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    setTimeout(() => {
      handleSubmit(fakeEvent);
    }, 100);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  // Modified submit handler to check for API key
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if API key exists
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    // If API key exists, proceed with normal submission
    handleSubmit(e);
  };

  const handleApiKeyDialogClose = () => {
    setShowApiKeyDialog(false);
    // Update API key from localStorage after dialog closes
    const storedApiKey = localStorage.getItem("sutraApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-background">
      {/* Logo */}
      <div className="w-full py-2 sm:py-4 text-center fixed top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-2xl mx-auto px-3 sm:px-4">
          <ModeToggle />
          <h1 className="text-lg sm:text-2xl font-bold">
            SUTRA: Multilingual Chatbot
          </h1>
          <ApiKeyDialog
            externalOpen={showApiKeyDialog}
            onClose={handleApiKeyDialogClose}
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-1 p-4 sm:p-6 pt-16 sm:pt-20">
        {messages.length === 0 ? (
          <>
            {/* Welcome message */}
            <div className="text-center mb-8 sm:mb-16">
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                नमस्ते! Hello! வணக்கம்!
              </h1>
              <p className="text-base sm:text-xl text-gray-500">
                How can I help you today? आज मैं आपकी क्या मदद कर सकता हूँ?
              </p>
            </div>

            {/* Suggestion grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
              {suggestions.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  title={suggestion.title}
                  subtitle={suggestion.subtitle}
                  onClick={() => {
                    // Check for API key before processing suggestion
                    if (!apiKey) {
                      setShowApiKeyDialog(true);
                    } else {
                      handleSuggestionClick(
                        `${suggestion.title} ${suggestion.subtitle}`
                      );
                    }
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          /* Chat messages */
          <ScrollArea className="w-full h-[calc(100vh-130px)] sm:h-[calc(100vh-100px)]">
            <div className="flex flex-col space-y-4 sm:space-y-6 p-2 sm:p-4 max-w-2xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}

              {/* Thinking indicator */}
              {status === "submitted" && (
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4">
                  <Spinner size="small" />
                  <p className="text-sm">Thinking...</p>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} className="w-full pb-20 sm:pb-8" />
          </ScrollArea>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full pb-4 sm:pb-8 fixed bottom-0 px-2 sm:px-0 bg-background/80 backdrop-blur-sm pt-2">
        <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl border border-muted-foreground/10 bg-muted shadow-sm p-1 sm:p-2">
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2">
              <LanguageSelector
                selectedLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                className="resize-none border-0 rounded-2xl !bg-transparent p-1 sm:p-2 min-h-[40px] max-h-[120px] sm:max-h-[200px] text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 flex-1"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    // Check for API key before submitting
                    if (!apiKey) {
                      setShowApiKeyDialog(true);
                      return;
                    }

                    handleSubmit(
                      e as unknown as React.FormEvent<HTMLFormElement>
                    );
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center",
                  !input.trim()
                    ? "bg-gray-300 text-gray-500"
                    : "bg-primary text-primary-foreground"
                )}
                disabled={!input.trim() || status === "streaming"}
              >
                <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

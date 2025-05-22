"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApiKeyDialogProps {
  externalOpen?: boolean;
  onClose?: () => void;
}

export function ApiKeyDialog({ externalOpen, onClose }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Handle external open state
  useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
    }
  }, [externalOpen]);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const storedApiKey = localStorage.getItem("sutraApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("sutraApiKey", apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);

      // Close dialog
      setOpen(false);
      if (onClose) {
        onClose();
      }

      // Reload the page to apply the new API key
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>SUTRA API Key</DialogTitle>
          <DialogDescription>
            Enter your SUTRA API key to use the chatbot. The key will be stored
            in your browser.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-y-2 py-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="apiKey" className="sr-only">
              SUTRA API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your SUTRA API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between">
          {isSaved && <span className="text-green-500">API key saved!</span>}
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

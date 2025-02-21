"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Lock, LogIn } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Login Required
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              To continue with your booking, please log in to your account.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex flex-col space-y-4 pt-6">
          {/* Login Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition-all duration-300"
            onClick={() => router.push("/auth/sign-in")}
          >
            <LogIn className="h-5 w-5" />
            <span>Log In</span>
          </Button>

          <p className="text-sm text-gray-600 text-center">
            Don&apos;t have an account?{" "}
            <button
              className="text-primary hover:underline focus:outline-none hover:font-bold"
              onClick={() => router.push("/auth/sign-up")}
            >
              Sign Up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

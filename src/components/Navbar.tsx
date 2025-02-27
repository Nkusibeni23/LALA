"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LogIn, Menu, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import HostPropertyModal from "./HostModal";
import NotificationPopover from "./NotificationPopover";
import Image from "next/image";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const userColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function hashStringToIndex(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % userColors.length;
}

function getUserColor(userId: string) {
  return userColors[hashStringToIndex(userId)];
}

export function Navbar({
  searchTerm,
  setSearchTerm,
  setIsSidebarOpen,
}: NavbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-white border-b border-gray-200 py-4 px-3 md:px-8 transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : "shadow-none"
        }`}
      >
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search properties..."
                className="pl-10 w-44 md:w-96 bg-gray-50 focus:ring-1 focus:ring-gray-300 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <NotificationPopover />

            {/* Host Button (For Hosts Only) */}
            {session?.user?.role === "HOST" && (
              <Button
                variant="outline"
                className="hover:bg-gray-900 hover:text-white transition-all duration-300"
                onClick={() => setIsHostModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden md:block">Host Your Place</span>
              </Button>
            )}

            {session ? (
              <div className="flex items-center gap-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white rounded-full text-lg font-bold cursor-pointer ${
                      session.user?.id
                        ? getUserColor(session.user.id)
                        : "bg-gray-900"
                    }`}
                  >
                    {session.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                className="hover:bg-gray-900 hover:text-white transition-all duration-300"
                onClick={() => router.push("/auth/sign-in")}
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden md:block">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Host Modal */}
      <HostPropertyModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
      />
    </>
  );
}

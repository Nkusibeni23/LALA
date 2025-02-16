"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, LogIn, Menu, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import HostPropertyModal from "./HostModal";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
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
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getUserColorIndex = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 6;
  };

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-gray-900",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
  ];

  const userColorIndex = session
    ? getUserColorIndex(session.user?.name || "Unknown")
    : 0;

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
              <Menu className="w-3 h-3 md:h-4 md:w-4" />
            </Button>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search properties..."
                className="pl-10 w-44 md:w-96 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              className="hidden sm:flex hover:bg-gray-900 hover:text-white"
            >
              <Filter className="w-3 h-3 md:h-4 md:w-4" />
              <span className="hidden md:block">Filters</span>
            </Button>

            {session?.user?.role === "HOST" && (
              <Button
                variant="outline"
                className="hover:bg-gray-900 hover:text-white transition-all duration-300"
                onClick={() => setIsHostModalOpen(true)}
              >
                <Plus className="w-3 h-3 md:h-4 md:w-4" />
                <span className="hidden md:block">Host Your Place</span>
              </Button>
            )}

            {session ? (
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center cursor-pointer justify-center w-10 h-10 md:w-14 md:h-14 rounded-full ${colors[userColorIndex]}`}
                >
                  <span className="text-white text-lg font-bold">
                    {session.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="hover:bg-gray-900 hover:text-white transition-all duration-300"
                onClick={() => router.push("/auth/sign-in")}
              >
                <LogIn className="w-3 h-3 md:h-4 md:w-4" />
                <span className="hidden md:block">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>
      <HostPropertyModal
        isOpen={isHostModalOpen}
        onClose={() => setIsHostModalOpen(false)}
      />
    </>
  );
}

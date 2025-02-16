"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Home, Map, Heart, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({
  isSidebarOpen,
  isMobile,
  setIsSidebarOpen,
}: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed lg:relative z-50 flex flex-col h-full bg-gray-900 text-white transition-all duration-300 
        ${
          isSidebarOpen
            ? "w-16 lg:w-64"
            : "w-16 -translate-x-full lg:translate-x-0"
        }
        ${isMobile ? "shadow-xl" : ""}
        overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between min-h-[60px]">
          {isSidebarOpen && !isMobile && (
            <h2 className="text-2xl font-bold hidden lg:block">🏠 Estate</h2>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hidden lg:flex ml-auto"
            >
              <ChevronLeft
                className={`h-6 w-6 transition-transform ${
                  isSidebarOpen ? "rotate-0" : "rotate-180"
                }`}
              />
            </Button>
          )}
        </div>

        <nav className="space-y-2 p-3 flex-1">
          {[
            { icon: Home, text: "Home" },
            { icon: Map, text: "Explore" },
            { icon: Heart, text: "Saved" },
            { icon: Settings, text: "Settings" },
          ].map(({ icon: Icon, text }, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-center lg:justify-start text-white hover:bg-gray-800 h-12"
            >
              <Icon className="h-5 w-5" />
              {isSidebarOpen && !isMobile && (
                <span className="ml-3 hidden lg:block">{text}</span>
              )}
            </Button>
          ))}
        </nav>

        <div className="p-3 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-center lg:justify-start text-white hover:bg-red-600 h-12"
            onClick={() => signOut({ callbackUrl: "/auth/sign-in" })}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && !isMobile && (
              <span className="ml-3 hidden lg:block">Logout</span>
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}

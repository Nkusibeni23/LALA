"use client";

import React, { useState, useEffect } from "react";
import { HouseCard } from "@/components/HouseCard";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/SideBar";
import { House } from "@/types/HomePage";
import SkeletonCard from "@/components/SkeletonCard";
import api from "@/lib/axios";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchHouses = async () => {
    try {
      const { data } = await api.get<House[]>("/properties");
      setHouses(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const housesPerPage = 8;
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = houses.slice(indexOfFirstHouse, indexOfLastHouse);
  const totalPages = Math.ceil(houses.length / housesPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {loading ? (
              Array(8)
                .fill(null)
                .map((_, index) => <SkeletonCard key={index} />)
            ) : currentHouses.length > 0 ? (
              currentHouses.map((house) => (
                <HouseCard key={house.id} house={house} />
              ))
            ) : (
              <p className="p-4 font-bold text-black text-center text-lg">
                No houses available
              </p>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </main>
      </div>
    </div>
  );
}

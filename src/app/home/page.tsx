"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HouseCard } from "@/components/HouseCard";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { Sidebar } from "@/components/SideBar";
import { House } from "@/types/HomePage";
import SkeletonCard from "@/components/SkeletonCard";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");
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

  const filteredHouses = houses.filter((house) =>
    house.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHouses = [...filteredHouses].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else if (sortOrder === "desc") {
      return b.price - a.price;
    }
    return 0;
  });

  const housesPerPage = 8;
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = sortedHouses.slice(indexOfFirstHouse, indexOfLastHouse);
  const totalPages = Math.ceil(sortedHouses.length / housesPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

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
          <div className="mb-6 flex justify-end">
            <Select
              value={sortOrder}
              onValueChange={(value: "none" | "asc" | "desc") =>
                setSortOrder(value)
              }
            >
              <SelectTrigger className="w-[180px] bg-white border border-gray-300 shadow-sm hover:bg-gray-100">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md">
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="asc">Price: Low to High</SelectItem>
                <SelectItem value="desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {loading ? (
              Array(8)
                .fill(null)
                .map((_, index) => <SkeletonCard key={index} />)
            ) : currentHouses.length > 0 ? (
              currentHouses.map((house) => (
                <Link key={house.id} href={`/properties/${house.id}`}>
                  <HouseCard house={house} />
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-lg font-bold text-gray-600">
                No houses found
              </p>
            )}
          </div>

          {currentHouses.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </main>
      </div>
    </div>
  );
}

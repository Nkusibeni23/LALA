"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Sidebar } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";

const houses = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `House ${i + 1}`,
  image: "https://via.placeholder.com/300",
  price: `$${(i + 1) * 1000}`,
}));

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const housesPerPage = 10;
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = houses.slice(indexOfFirstHouse, indexOfLastHouse);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content Section */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentHouses.map((house) => (
            <Card key={house.id}>
              <CardContent className="p-4">
                <img
                  src={house.image}
                  alt={house.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-2">{house.title}</h3>
                <p className="text-gray-500">{house.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center my-6">
          <Pagination />
        </div>
      </div>
    </div>
  );
}

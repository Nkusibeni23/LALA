"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bed, ShowerHead, Home, ImageOff } from "lucide-react";
import { HouseCardProps } from "@/types/HomePage";

export const HouseCard = ({ house }: HouseCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-shadow duration-300 cursor-pointer rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
          {house.images?.[0] ? (
            <img
              src={house.images[0]}
              alt={house.title}
              className="w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
              onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <ImageOff className="w-10 h-10 opacity-50" />
              <span className="text-sm mt-2">No Photo</span>
            </div>
          )}

          {/* Heart Button */}
          <Button
            variant="ghost"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white p-1.5 shadow-md rounded-full"
          >
            <Heart className="h-5 w-5 text-red-500" />
          </Button>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{house.title}</h3>
          <p className="text-gray-500 text-sm truncate">{house.location}</p>
          <p className="text-xl font-bold mt-2">
            ${house.price.toLocaleString()}{" "}
            <span className="text-gray-500 font-normal">per Night</span>
          </p>

          {/* Properties Details*/}
          <div className="flex justify-between text-sm text-gray-600 mt-3">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-gray-400" /> {house.rooms} Beds
            </span>
            <span className="flex items-center gap-1">
              <ShowerHead className="h-4 w-4 text-gray-400" /> {house.bathrooms}{" "}
              Baths
            </span>
            <span className="flex items-center gap-1">
              <Home className="h-4 w-4 text-gray-400" /> {house.category}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

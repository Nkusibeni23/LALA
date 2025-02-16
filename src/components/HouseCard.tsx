"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { HouseCardProps } from "@/types/HomePage";

export const HouseCard = ({ house }: HouseCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={house.image}
            alt={house.title}
            className="w-full h-64 object-cover"
          />
          <Button
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{house.title}</h3>
          <p className="text-gray-600 text-sm mb-2 truncate">
            {house.location}
          </p>
          <p className="text-xl font-bold mb-2">
            ${house.price.toLocaleString()}
          </p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{house.beds} beds</span>
            <span>{house.baths} baths</span>
            <span>{house.sqft} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

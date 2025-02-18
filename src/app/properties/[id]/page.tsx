"use client";

import React, { useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { Property, User } from "@/types/HomePage";
import {
  Bed,
  ShowerHead,
  Home,
  Star,
  MapPin,
  User as UserIcon,
  ArrowLeft,
  Wifi,
  Tv,
  Utensils,
  Car,
  Snowflake,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookingSection from "@/components/BookingSection";
import SpinnerLoader from "@/components/SpinnerLoader";
import UpdateSection from "@/components/Updatesection";

const amenityIcons: { [key: string]: JSX.Element } = {
  wifi: <Wifi className="h-5 w-5 text-primary" />,
  tv: <Tv className="h-5 w-5 text-primary" />,
  kitchen: <Utensils className="h-5 w-5 text-primary" />,
  parking: <Car className="h-5 w-5 text-primary" />,
  ac: <Snowflake className="h-5 w-5 text-primary" />,
  pool: <Droplets className="h-5 w-5 text-primary" />,
};

async function fetchPropertyWithHost(id: string) {
  try {
    const response = await api.get<Property & { host: User }>(
      `/properties/${id}`
    );
    if (response.status === 404) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export default function PropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [property, setProperty] = useState<(Property & { host: User }) | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPropertyWithHost(params.id);

      setProperty(data);
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return <SpinnerLoader />;
  }

  if (!property) {
    notFound();
  }

  const hostJoinYear = property.host?.createdAt
    ? new Date(property.host.createdAt).getFullYear()
    : new Date().getFullYear();

  const isHost =
    session?.user?.role === "HOST" && session.user.id === property.host?.id;

  return (
    <div className="container min-h-screen">
      <div className="mx-auto p-4 lg:p-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
            <Badge variant="secondary" className="ml-2">
              {property.category || "Uncategorized"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {property.images.length > 0 ? (
                    property.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))
                  ) : (
                    <div className="col-span-2 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Home className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className=" hover:font-extrabold">
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="amenities"
                  className=" hover:font-extrabold"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger value="host" className=" hover:font-extrabold">
                  Host Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{property.rooms}</p>
                          <p className="text-sm text-gray-600">Bedrooms</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShowerHead className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{property.bathrooms}</p>
                          <p className="text-sm text-gray-600">Bathrooms</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">4.8</p>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{property.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {property.amenities.map(
                        (amenity: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-4 border border-black text-black rounded-lg transition-colors"
                          >
                            <div className="p-2 bg-primary/10 rounded-full">
                              {amenityIcons[amenity.toLowerCase()] || (
                                <Home className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <span className="capitalize text-sm font-medium">
                              {amenity}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="host" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Host</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={property.host?.image} />
                        <AvatarFallback>
                          <UserIcon className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {property.host?.name || "Anonymous Host"}
                        </h3>
                        <p className="text-gray-600 mb-2 text-sm">
                          {property.host?.email || "No email provided"}
                        </p>
                        <p className="text-gray-600">
                          Member since {hostJoinYear}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {isHost ? (
            <UpdateSection propertyId={params.id} />
          ) : (
            <BookingSection property={property} />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Palmtree,
  Home,
  Mountain,
  Umbrella,
  Waves,
  Droplet,
  Crown,
  MoreHorizontal,
  Upload,
  Wifi,
  Car,
  Tv,
  UtensilsCrossed,
  Bath,
  Wind,
  PawPrint,
  Baby,
  Dumbbell,
} from "lucide-react";
import {
  Amenity,
  Category,
  HostPropertyModalProps,
  PropertiesData,
} from "@/types/Properties";
import api from "@/lib/axios";
import ValidationCard from "./ValidationCard";
import Image from "next/image";

const categories: Category[] = [
  { id: "beach", name: "Beach", icon: Palmtree },
  { id: "modern", name: "Modern", icon: Home },
  { id: "countryside", name: "Countryside", icon: Mountain },
  { id: "pools", name: "Pools", icon: Umbrella },
  { id: "islands", name: "Islands", icon: Waves },
  { id: "lake", name: "Lake", icon: Droplet },
  { id: "luxuries", name: "Luxuries", icon: Crown },
  { id: "others", name: "Others", icon: MoreHorizontal },
];

const amenities: Amenity[] = [
  { id: "wifi", name: "WiFi", icon: Wifi },
  { id: "parking", name: "Parking", icon: Car },
  { id: "tv", name: "TV", icon: Tv },
  { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed },
  { id: "bathtub", name: "Bathtub", icon: Bath },
  { id: "ac", name: "Air Conditioning", icon: Wind },
  { id: "pets", name: "Pet Friendly", icon: PawPrint },
  { id: "baby", name: "Baby Friendly", icon: Baby },
  { id: "pool", name: "Pool", icon: Waves },
  { id: "gym", name: "Gym", icon: Dumbbell },
];

const HostPropertyModal: React.FC<HostPropertyModalProps> = ({
  isOpen,
  onClose,
  mode = "create",
  propertyId,
  initialData,
}) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const totalSteps = 6;

  const [formData, setFormData] = useState<PropertiesData>(
    initialData || {
      category: "",
      title: "",
      description: "",
      location: "",
      price: "",
      rooms: "",
      bathrooms: "",
      amenities: [],
      images: [],
    }
  );
  const [validation, setValidation] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  const handleNext = () => {
    setStep((prev) => prev + 1);
    setProgress(((step + 1) / totalSteps) * 100);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
    setProgress(((step - 1) / totalSteps) * 100);
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("file", file);
    });

    try {
      const response = await api.post<{ url: string }>("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, response.data.url],
        }));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  useEffect(() => {
    if (mode === "update" && propertyId) {
      const fetchProperty = async () => {
        try {
          const response = await api.get<PropertiesData>(
            `/properties/${propertyId}`
          );
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching property:", error);
        }
      };
      fetchProperty();
    }
  }, [mode, propertyId]);

  const handleSubmit = async () => {
    try {
      const {
        category,
        title,
        description,
        price,
        location,
        images,
        amenities,
        rooms,
        bathrooms,
      } = formData;

      if (mode === "create") {
        await api.post("/properties", {
          category,
          title,
          description,
          price: parseFloat(price),
          location,
          images,
          amenities,
          rooms: parseInt(rooms),
          bathrooms: parseInt(bathrooms),
        });

        setValidation({
          type: "success",
          message: "Property created successfully!",
        });
        resetForm();
      } else if (mode === "update" && propertyId) {
        await api.put(`/properties/${propertyId}`, {
          category,
          title,
          description,
          price: parseFloat(price),
          location,
          images,
          amenities,
          rooms: parseInt(rooms),
          bathrooms: parseInt(bathrooms),
        });

        setValidation({
          type: "success",
          message: "Property updated successfully!",
        });
      }

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error submitting property:", error);
      setValidation({
        type: "error",
        message: `Failed to ${
          mode === "create" ? "create" : "update"
        } property. Please try again.`,
      });
    }
  };
  const resetForm = () => {
    setFormData({
      category: "",
      title: "",
      description: "",
      price: "",
      location: "",
      images: [],
      amenities: [],
      rooms: "",
      bathrooms: "",
    });
  };

  useEffect(() => {
    if (validation) {
      const timer = setTimeout(() => {
        setValidation(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [validation]);

  const isNextDisabled = () => {
    if (step === 2 && !formData.location) return true;
    if (step === 4 && formData.images.length === 0) return true;
    if (
      step === 6 &&
      (!formData.price || !formData.rooms || !formData.bathrooms)
    )
      return true;
    return false;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                What kind of place will you host?
              </DialogTitle>
              <DialogDescription>
                Choose the category that best describes your property
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(({ id, name, icon: Icon }) => (
                <Button
                  key={id}
                  variant={formData.category === id ? "default" : "outline"}
                  className={`h-24 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    formData.category === id
                      ? "bg-gray-900 text-white scale-105"
                      : "hover:scale-105"
                  }`}
                  onClick={() => handleCategorySelect(id)}
                >
                  <Icon className="w-6 h-6" />
                  <span>{name}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Where&apos;s your place located?
              </DialogTitle>
              <DialogDescription>
                Add the address of your property
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Enter your full address"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="h-12 focus:ring-1 focus:ring-gray-300 outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Tell us about your place
              </DialogTitle>
              <DialogDescription>
                Add a title and description that best describes your property
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g., Cozy Beachfront Villa"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="h-12 focus:ring-1 focus:ring-gray-300 outline-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Tell potential guests what makes your place special..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="h-32 resize-none focus:ring-1 focus:ring-gray-300 outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Add photos of your place
              </DialogTitle>
              <DialogDescription>
                Great photos help guests imagine staying in your place
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="object-cover w-full h-full"
                      layout="responsive"
                      width={500}
                      height={500}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center gap-2 hover:border-gray-400 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Photo</span>
                  </div>
                  <input
                    type="file"
                    name="files"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                What amenities do you offer?
              </DialogTitle>
              <DialogDescription>
                Select all the amenities available at your property
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map(({ id, name, icon: Icon }) => (
                <Button
                  key={id}
                  variant={
                    formData.amenities.includes(id) ? "default" : "outline"
                  }
                  className={`h-20 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    formData.amenities.includes(id)
                      ? "bg-gray-900 text-white scale-105"
                      : "hover:scale-105"
                  }`}
                  onClick={() => handleAmenityToggle(id)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{name}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Set your price and details
              </DialogTitle>
              <DialogDescription>
                Add the final details about your property
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Price per Night</Label>
                <Input
                  type="number"
                  placeholder="$"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="h-12 focus:ring-1 focus:ring-gray-300 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input
                    type="number"
                    placeholder="Number of rooms"
                    value={formData.rooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rooms: e.target.value,
                      }))
                    }
                    className="h-12 focus:ring-1 focus:ring-gray-300 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input
                    type="number"
                    placeholder="Number of bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bathrooms: e.target.value,
                      }))
                    }
                    className="h-12 focus:ring-1 focus:ring-gray-300 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white p-0">
        <div className="h-1 bg-gray-100">
          <Progress value={progress} className="h-full rounded-none" />
        </div>
        <div className="p-6">
          {renderStep()}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={step === totalSteps ? handleSubmit : handleNext}
              disabled={isNextDisabled()}
              className={`gap-2 text-black hover:bg-black hover:text-white transition-all duration-300 ${
                step === 1 ? "w-full" : "ml-auto"
              }`}
            >
              {step === totalSteps ? "Finish" : "Next"}
              {step !== totalSteps && <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        {validation && (
          <ValidationCard type={validation.type} message={validation.message} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HostPropertyModal;

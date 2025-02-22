"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { ValidationCardProps } from "@/types/Validation";
import ValidationCard from "./ValidationCard";
import HostPropertyModal from "./HostModal";

export default function UpdateSection({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validation, setValidation] = useState<ValidationCardProps | null>(
    null
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const response = await api.delete(`/properties/${propertyId}`);
      if (response.status === 200) {
        setValidation({
          type: "success",
          message: "Property deleted successfully!",
        });
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        throw new Error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      setValidation({
        type: "error",
        message: "Failed to delete property. Please try again.",
      });
    } finally {
      setIsDeleteLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="lg:col-span-1">
      {validation && (
        <ValidationCard type={validation.type} message={validation.message} />
      )}

      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Manage Your Place</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full hover:bg-black hover:text-white duration-300 transition-all"
            variant="outline"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            Update Your Place
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full hover:bg-red-400 hover:text-white duration-300 transition-all"
                variant="outline"
              >
                Delete Your Place
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your property and all its data.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className=" hover:bg-black hover:text-white duration-300 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  className=" hover:bg-red-500 hover:text-white duration-300 transition-all"
                  onClick={handleDelete}
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Update Property Modal */}
      <HostPropertyModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        mode="update"
        propertyId={propertyId}
      />
    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default function Updatesection() {
  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle>Manage Your Place</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full hover:bg-black hover:text-white duration-300 transition-all"
            variant="outline"
          >
            Update Your Place
          </Button>
          <Button
            className="w-full hover:bg-red-400 hover:text-white duration-300 transition-all"
            variant="destructive"
          >
            Delete Your Place
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

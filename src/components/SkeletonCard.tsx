import React from "react";

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-sm p-4 bg-gray-200 rounded-xl shadow-lg animate-pulse">
      <div className="w-full h-60 bg-gray-300 rounded-lg"></div>
      <div className="mt-4 space-y-4">
        <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-6 bg-gray-300 rounded"></div>
        <div className="w-2/3 h-6 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

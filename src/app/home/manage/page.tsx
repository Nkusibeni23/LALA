"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManagePage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Manage Properties</h1>
        <p>This page is protected. Only authenticated users can see this.</p>
      </div>
    </ProtectedRoute>
  );
}

"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>User Profile</h1>
        <p>Only logged-in users can access this page.</p>
      </div>
    </ProtectedRoute>
  );
}

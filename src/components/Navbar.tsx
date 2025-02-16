"use client";

export function Navbar() {
  return (
    <nav className="p-4 bg-white shadow-md flex justify-between">
      <h1 className="text-xl font-bold">🏡 Real Estate</h1>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Login
        </button>
        <button className="px-4 py-2 bg-gray-300 rounded-md">Sign Up</button>
      </div>
    </nav>
  );
}

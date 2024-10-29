"use client";
import React, { useState } from 'react';
import { db } from "~/server/db";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Dropdown open state
  const [selectedMajor, setSelectedMajor] = useState<string>(''); // Selected major state
  const [boxHeight, setBoxHeight] = useState(400); // Dynamic height for the boxes

  // Toggle dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  // Handle major selection and close the dropdown
  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
    setIsOpen(false);
  };

  // Increment box height by a specified amount
  const incrementHeight = (incrementAmount: number) => {
    setBoxHeight(prevHeight => prevHeight + incrementAmount);
  };

  return (
    <main className="flex flex-col items-center pt-10 space-y-8">
      {/* Major selection box */}
      <div className="bg-gray-100 p-12 rounded-lg shadow-md w-3/4">
        <div className="flex flex-col items-center">
          <p className="text-center">{"What's your major?"}</p>
          
          {/* Dropdown Menu */}
          <div className="relative mt-4">
            <button 
              onClick={toggleDropdown} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {selectedMajor || "Select Major"}
            </button>

            {isOpen && (
              <ul className="absolute bg-white shadow-md mt-1 rounded border border-gray-300 z-10 w-full">
                {["Computer Science", "Business Administration", "Biology"].map(major => (
                  <li
                    key={major}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleMajorSelect(major)}
                  >
                    {major}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedMajor && <p className="mt-4">You selected: {selectedMajor}</p>}
        </div>
      </div>

      {/* Side-by-Side Boxes with Shared Height */}
      <div className="flex space-x-4 w-3/4">
        {/* Left Box with Button */}
        <div className="bg-gray-100 p-12 rounded-lg shadow-md w-1/2 flex flex-col items-center" style={{ height: `${boxHeight}px` }}>
          <p>Your Schedule:</p>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md" style={{ width: '80%', height: '100px' }}>
            <p className="text-center">This is a long but short box</p>
          </div>
          <button onClick={() => incrementHeight(50)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Add Semester
          </button>
        </div>

        {/* Right Box */}
        <div
          className="bg-gray-100 p-12 rounded-lg shadow-md w-1/2 flex justify-center"
          style={{ height: `${boxHeight}px` }}
        >
          <p>School Recommended Schedule:</p>
        </div>
      </div>
    </main>
  );
}

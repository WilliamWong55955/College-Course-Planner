"use client"; // Add this directive at the top

import { useState } from 'react';
// import other necessary modules
import { db } from "~/server/db";
// import { images } from "~/server/db/schema"; // Remove if not needed
// import { desc } from "drizzle-orm/expressions"; // Remove if not needed

export default function HomePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Dropdown open state
  const [selectedMajor, setSelectedMajor] = useState<string>(''); // Selected major state

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <main className="flex flex-col items-center pt-10">
      {/* Box covering "What's your major?" */}
      <div className="bg-gray-100 p-12 rounded-lg shadow-md mb-8 w-3/4">
        <div className="flex flex-col items-center"> {/* Flex container for centering */}
          <p className="text-center">{`What's your major?`}</p>
          
          {/* Dropdown Menu */}
          <div className="relative mt-4">
            <button 
              onClick={toggleDropdown} 
              className="bg-blue-500 text-white p-2 rounded"
            >
              {selectedMajor || "Select Major"}
            </button>

            {isOpen && (
              <ul className="absolute bg-white shadow-md mt-1 rounded border border-gray-300 z-10">
                <li 
                  className="p-2 hover:bg-gray-200 cursor-pointer" 
                  onClick={() => handleMajorSelect("Computer Science")}
                >
                  Computer Science
                </li>
                <li 
                  className="p-2 hover:bg-gray-200 cursor-pointer" 
                  onClick={() => handleMajorSelect("Business Administration")}
                >
                  Business Administration
                </li>
                <li 
                  className="p-2 hover:bg-gray-200 cursor-pointer" 
                  onClick={() => handleMajorSelect("Biology")}
                >
                  Biology
                </li>
                {/* Add more options as needed */}
              </ul>
            )}
          </div>

          {selectedMajor && <p className="mt-4">You selected: {selectedMajor}</p>}
        </div>
      </div>

      {/* Box for "Enter in the most recent classes" */}
      <div className="bg-gray-100 p-12 rounded-lg shadow-md mb-8 w-3/4">
        <p className="text-center">{`Enter your most recent classes`}</p>
        <input 
          type="text" 
          placeholder="Class names..." 
          className="mt-2 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      
      <div className="bg-gray-100 p-12 rounded-lg shadow-md mb-16 w-3/4">
        <p className="text-center">Tree diagram goes here eventually</p>
      </div>
      <div className="flex justify-between w-full px-10 mt-10"> {/* Flex container for three boxes */}
  {/* Left Box for Preferred Units */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md w-1/3">
    <p className="text-center">Preferred Units</p>
    <input 
      type="number" 
      placeholder="Enter preferred units" 
      className="mt-4 p-2 border border-gray-300 rounded w-full"
    />
  </div>

  {/* Right Box 1 */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md w-1/3 ml-4"> {/* Add margin-left for spacing */}
    <p className="text-center">Class Schedule</p>
    {/* Add any input or content here */}
  </div>

  {/* Right Box 2 */}
  <div className="bg-gray-100 p-6 rounded-lg shadow-md w-1/3 ml-4"> {/* Add margin-left for spacing */}
    <p className="text-center">professors options w/ RMP</p>
    {/* Add any input or content here */}
  </div>
</div>
<div>
  <p>
    Harry is awesome
  </p>
</div>

    </main>
  );
}

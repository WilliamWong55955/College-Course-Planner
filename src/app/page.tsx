"use client";
import React, { useState } from 'react';
import { db } from "~/server/db";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Dropdown open state
  const [selectedMajor, setSelectedMajor] = useState<string>(''); // Selected major state
  const [boxHeight, setBoxHeight] = useState(750); // Dynamic height for the boxes
  const [classes, setClasses] = useState<string[]>([]); // Store selected classes
  const [availableClasses, setAvailableClasses] = useState<string[]>(["MATH 324", "CSC 340", "CSC 317", "MATH 130", "CSC 300GW", "CSC 110C"]); // Available classes
  const [recommendedClasses, setRecommendedClasses] = useState<string[]>([  "MATH 324", "CSC 340", "CSC 317", "MATH 130", "CSC 300GW", "CSC 110C"  ]); // Store  classes for roadmap
  
  interface Semester {
    name: string;
    classes: string[];
  }
  const [semesters, setSemesters] = useState<Semester[]>([{ name: 'Semester 1', classes: [] }]); // Initial state


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

  // Handle drag start
  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, className: string) => {
    event.dataTransfer.setData("text/plain", className); // Store the class name to be dragged
  };

    // Allow dropping by preventing default behavior
  const handleDragOver = (event: React.DragEvent<HTMLUListElement>) => {
    event.preventDefault();
  };

  const addSemester = () => {
    const newSemester = { name: `Semester ${semesters.length + 1}`, classes: [] }; // Create new semester
    setSemesters(prevSemesters => [...prevSemesters, newSemester]); // Add to semesters
  };
  
  const deleteSemester = (index: number) => {
    setSemesters(prevSemesters => prevSemesters.filter((_, i) => i !== index)); // Remove semester
  };
  
  // Handle drop into user's schedule from available classes
  const handleDropToSelectedSemester = (event: React.DragEvent<HTMLDivElement>, semesterIndex: number) => {
    event.preventDefault();
    const className = event.dataTransfer.getData("text/plain"); // Get the class name from the drag data
  
    // Check if semesterIndex is within bounds
    if (semesterIndex >= 0 && semesterIndex < semesters.length) {
      // Check if the class is available
      if (availableClasses.includes(className)) {
        setAvailableClasses(prevClasses => prevClasses.filter(cls => cls !== className)); // Remove from available classes
        setSemesters(prevSemesters => {
          const updatedSemesters = [...prevSemesters];
          updatedSemesters[semesterIndex].classes.push(className); // Add to the selected semester's class list
          return updatedSemesters;
        });
      } 
    }
  };
  
  // Handle drop back to available classes
  const handleDropToAvailable = (event: React.DragEvent<HTMLDivElement>, semesterIndex: number) => {
    event.preventDefault();
    const className = event.dataTransfer.getData("text/plain"); // Get the class name from the drag data

    if (semesterIndex >= 0 && semesterIndex < semesters.length) {
      setAvailableClasses(prevClasses => [...prevClasses, className]); // Add back to available classes
      setSemesters(prevSemesters => {
        return prevSemesters.map(semester => ({
          ...semester,
          classes: semester.classes.filter(cls => cls !== className) // Remove class from each semester
        }));
      });
    }
  };


  //FIXME make compatible with semesters
  // Add selected class to the schedule and remove it from available classes
  const addClassToSchedule = (className: string) => {
    setClasses(prevClasses => [...prevClasses, className]);
    setAvailableClasses(prevClasses => prevClasses.filter(cls => cls !== className)); // Remove selected class
  };

  // Add selected class from schedule back to available classes and remove it from schedule
  const makeClassAvailable = (className: string) => {
    setClasses(prevClasses => prevClasses.filter(cls => cls !== className)); // Remove from user's schedule
    setAvailableClasses(prevClasses => [...prevClasses, className]); // Add back to available classes
  };


  return (
    <main className="flex flex-col items-center pt-10 space-y-8">
      {/* Major selection box */}
      <div className="bg-gray-100 p-12 rounded-lg shadow-md" style={{ width: '500px' }} >
        <div className="flex flex-col items-center">
          <p className="text-center">{"What's your major?"}</p>

          {/* Dropdown Menu */}
          <div className="relative mt-4">

            {/* Button to select major */}
            <button onClick={toggleDropdown} className="bg-blue-500 text-white px-4 py-2 rounded">
              {selectedMajor || "Select Major"}
            </button>

            {isOpen && (
              <ul className="absolute bg-white shadow-md mt-1 rounded border border-gray-300 z-10 w-full">
                {["Computer Science", "Business Administration", "Biology"].map(major => (
                  <li key={major} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleMajorSelect(major)}>
                    {major}
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
      </div>

      {/* Side-by-Side Boxes with Shared Height */}
      <div className="flex space-x-4" style={{ width: '1000px' }}>

        

        {/* Left hand side boxes and elements*/}
        <div className="bg-gray-100 p-12 rounded-lg shadow-md w-1/2 flex flex-col items-center" style={{ height: `${boxHeight}px` }}>
          
          {/* Box for "your Schedule"*/}
          <div className="bg-gray-100 p-4 rounded-lg w-1/2 flex flex-row flex-col items-center" style={{ width: '80%', height: '80px' }}>
            <p>Your Schedule:</p>
          </div>

          {/* user schedule box 

          <div className="bg-gray-100 p-4 rounded-lg shadow-md" style={{ width: '90%' }} onDragOver={handleDragOver} onDrop={handleDropFromSelected}>
            <ul className="mt-2 flex flex-wrap justify-center">
              {classes.map((className, index) => (
                <li key={index} className="text-center mx-2" draggable onDragStart={(event) => handleDragStart(event, className)} onClick={() => makeClassAvailable(className)}>  
                  {className}
                </li>))}
            </ul>
          </div>
          
          */}
          
          {/* user schedule box : semester edition */}
          <div className="flex flex-wrap justify-center" style={{ width: '100%' }}>

            {semesters.map((semester, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4" style={{ width: '90%' }} onDragOver={(event) =>handleDragOver} onDrop={(event) => handleDropToSelectedSemester(event, index)}>
                <h3 className="font-bold">{`Semester ${index + 1}`}</h3>
                
                <ul className="mt-2 flex flex-wrap justify-center">
                  {semester.classes.map((className, classIndex) => (
                    <li key={classIndex} className="text-center mx-2" draggable onDragStart={(event) => handleDragStart(event, className)} onClick={() => makeClassAvailable(className)}>
                      {className}
                    </li>))}
                </ul>

                <button onClick={() => deleteSemester(index)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded">
                  Delete Semester
                </button>

              </div>
            ))}
          </div>


          <button onClick={() => addSemester()} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Add Semester
          </button>

          {/* Available classes box */}


          <h3 className="font-bold">Available Classes:</h3>

          <div className="bg-gray-100 p-4 rounded-lg shadow-md" style={{ width: '80%'}} onDragOver={(event) =>handleDragOver} onDrop={(event) => handleDropToAvailable(event, index)}>
            <ul className="mt-2 flex flex-wrap justify-center">
              {availableClasses.map((className, index) => (
                <li key={index} className="text-center mx-2" draggable onDragStart={(event) => handleDragStart(event, className)} 
                  onClick={() => addClassToSchedule(className)}
                   // Updated call
                  >  
                  {className}
                </li>))}
            </ul>
          </div>


        </div>

          {/* Right Box */}
          <div className="bg-gray-100 p-12 rounded-lg shadow-md w-1/2 flex flex-col items-center" style={{ height: `${boxHeight}px` }}>
            
          {/* Box for "Recommended"*/}
          <div className="bg-gray-100 p-4 rounded-lg w-1/2 flex flex-row flex-col items-center" style={{ width: '80%', height: '80px' }}>
            <p>Recommended Schedule for:</p>
            <p>{selectedMajor}</p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-md" style={{ width: '80%'}} >
            <ul className="mt-2 flex flex-wrap justify-center">
              {recommendedClasses.map((className, index) => (
                <li key={index} className="text-center mx-2" >  
                  {className}
                </li>))}
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}

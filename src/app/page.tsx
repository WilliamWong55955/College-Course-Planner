"use client";
import React, { useState } from 'react';
import { db } from "~/server/db";

export default function HomePage() {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Dropdown open state
  const [selectedMajor, setSelectedMajor] = useState<string>(''); // Selected major state
  const [boxHeight, setBoxHeight] = useState(750); // Dynamic height for the boxes
  const [availableClasses, setAvailableClasses] = useState<string[]>(["MATH 324", "CSC 340", "CSC 317", "MATH 130", "CSC 300GW", "CSC 110C"]); // Available classes
  const [recommendedClasses, setRecommendedClasses] = useState<string[]>([  "MATH 324", "CSC 340", "CSC 317", "MATH 130", "CSC 300GW", "CSC 110C"  ]); // Store  classes for roadmap
  


  class Semester {
    classes: string[];
  
    constructor() {
      this.classes = [];
    }
  
    addClass(className: string) {
      if (!this.classes.includes(className)) {
        this.classes.push(className);
      }
    }
    removeClass(className: string) {
      this.classes = this.classes.filter(cls => cls !== className);
    }
  }

  const [semesters, setSemesters] = useState<Semester[]>([new Semester()]); // Initial state
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState<number>(0); // Set to 0 for the first semester

  // Toggle dropdown open/close state
  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  // Handle major selection and close the dropdown
  const handleMajorSelect = (major: string) => {
    setSelectedMajor(major);
    setIsOpen(false);
  };

  // Increment/ decrement box height by a specified amount
  const incrementHeight = (incrementAmount: number) => {
    setBoxHeight(prevHeight => prevHeight + incrementAmount);
  };

  const decrementHeight = (decrementAmount: number) => {
    setBoxHeight(prevHeight => prevHeight - decrementAmount);
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
    const newSemester = new Semester(); // Create a new Semester instance
    setSemesters(prevSemesters => [...prevSemesters, newSemester]); // Add the new instance to semesters
    setCurrentSemesterIndex(semesters.length); // Update the current semester index
  };
  
  
  const deleteSemester = (index: number) => {
    setSemesters(prevSemesters => {
      // Get the classes from the semester to be deleted
      const classesToReturn = prevSemesters[index].classes;
      
      // console.log("Deleting semester index:", index);
      // console.log("Current semester index before deletion:", currentSemesterIndex);


      // Return the updated semesters without the deleted one
      const updatedSemesters = prevSemesters.filter((_, i) => i !== index);

      // Return the classes back to available classes
      setAvailableClasses(prevClasses => {
        const uniqueClasses = classesToReturn.filter(cls => !prevClasses.includes(cls)); // Only keep unique classes
        return [...prevClasses, ...uniqueClasses]; // Return the updated available classes
      });
      
        if (updatedSemesters.length > 0){
          setCurrentSemesterIndex(updatedSemesters.length - 1 );
        }else{
          setCurrentSemesterIndex(-1)
        }

      // console.log("Current index after deletion:", index);
      // console.log("Current semester index after deletion:", currentSemesterIndex);
      // console.log("Updated semesters after deletion:", updatedSemesters);

      return updatedSemesters; // Return updated semesters
    });
  };
  
  // Handle drop into user's schedule from available classes
  const handleDropToSelectedSemester = (event: React.DragEvent<HTMLDivElement>, semesterIndex: number) => {
    event.preventDefault();
    const className = event.dataTransfer.getData("text/plain");
  
    if (semesterIndex >= 0 && semesterIndex < semesters.length) {
      if (availableClasses.includes(className)) {
        setAvailableClasses(prevClasses => prevClasses.filter(cls => cls !== className));
        setSemesters(prevSemesters => {
          const updatedSemesters = [...prevSemesters];
          updatedSemesters[semesterIndex].addClass(className); // Use the class method
          
          return updatedSemesters;
        });
      }else{


          // for (let i = 0; i < semesters.length; i++) {
          //   for (let j = 0; i < semesters.length; i++) {
          //     if(semesters[i][j] === className)
          //   }
          // }
          setSemesters(prevSemesters => {
            return prevSemesters.map((semester, index) => {
              if (index === semesterIndex) {
                // If it's the target semester, add the class
                const updatedSemester = new Semester(); // Create a new instance for the updated semester
                updatedSemester.classes = [...semester.classes, className]; // Add the class
                return updatedSemester; // Return the updated semester
              } else {
                // If it's not the target semester, remove the class if it exists
                const updatedSemester = new Semester(); // Create a new instance for the semester
                updatedSemester.classes = semester.classes.filter(cls => cls !== className); // Remove the class
                return updatedSemester; // Return the updated semester
              }
            });
          });
        }
      }
  };
  
  
  // Handle drop back to available classes
  const handleDropToAvailable = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const className = event.dataTransfer.getData("text/plain"); // Get the class name from the drag data

    if (!availableClasses.includes(className)) {
      setAvailableClasses(prevClasses => [...prevClasses, className]); // Add class to available classes
      setSemesters(prevSemesters => {
        return prevSemesters.map(semester => ({
          ...semester,
          classes: semester.classes.filter(cls => cls !== className) // Remove class from each semester
        }));
      });
    } else {
      console.warn(`Class "${className}" is already in the available classes.`);
    }
  };

  //AFTER DRAGGING CLASSES FROM CLASS BANK TO CLASS BANK< THINGS BREAK

  // Add selected class from schedule back to available classes and remove it from schedule
  const addClassToAvailable = (className: string, semesterIndex: number) => {
    setSemesters(prevSemesters => {
      const updatedSemesters = [...prevSemesters];
      updatedSemesters[semesterIndex].removeClass(className); // Use the class method
      return updatedSemesters;
    });
    
    // Add the class back to available classes only if it doesn't already exist
    setAvailableClasses(prevClasses => {
      if (!prevClasses.includes(className)) {
        return [...prevClasses, className];
      }
      return prevClasses; // Return previous state if the class already exists
    });
  };
  
  // Add selected class to the schedule and remove it from available classes
  const addClassToSchedule = (className: string) => {
    if (semesters.length === 0) {
      // If no semesters exist, create a new one
      addSemester(); // Call the function to add a new semester
    }
    

    if (currentSemesterIndex >= 0 && currentSemesterIndex < semesters.length) { // Ensure a current semester is selected
      setSemesters(prevSemesters => {
        const updatedSemesters = [...prevSemesters];
        updatedSemesters[currentSemesterIndex].addClass(className); // Add to the current semester
        return updatedSemesters;
      });
      setAvailableClasses(prevClasses => prevClasses.filter(cls => cls !== className)); // Remove selected class
    }
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
          
          {/* user schedule box : semester edition */}
          <div className="flex flex-wrap justify-center" style={{ width: '100%' }}>

            {/* display array of semester boxes */}
            {semesters.map((semester, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md mb-4" style={{ width: '90%' }} 
              onDragOver={ handleDragOver} onDrop={(event) => handleDropToSelectedSemester(event, index)}>
                <h3 className="font-bold">{`Semester ${index + 1}`}</h3>


                {/* wich with their own classes */}
                <ul className="mt-2 flex flex-wrap justify-center">
                  {semester.classes.map((className, classIndex) => (
                    <li key={classIndex} className="text-center mx-2" draggable 
                      onDragStart={(event) => handleDragStart(event, className)} onClick={() => addClassToAvailable(className, index)}>
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

          <div className="bg-gray-100 p-4 rounded-lg shadow-md" style={{ width: '80%'}} onDragOver={handleDragOver}
          onDrop={handleDropToAvailable}>
            <ul className="mt-2 flex flex-wrap justify-center">
              {availableClasses.map((className, index) => (
                <li key={index} className="text-center mx-2" draggable onDragStart={(event) => handleDragStart(event, className)} onClick={() => addClassToSchedule(className)}
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

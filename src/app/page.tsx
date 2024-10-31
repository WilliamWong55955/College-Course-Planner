"use client"

import React, { useState, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { PlusCircle, MinusCircle, Edit2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

// Mock data
const majors = [
  { id: 'cs', name: 'Computer Science' },
  { id: 'ee', name: 'Electrical Engineering' },
]

const courses = {
  cs: [
    { id: 'cs101', name: 'Introduction to Programming' },
    { id: 'cs201', name: 'Data Structures' },
    { id: 'cs301', name: 'Algorithms' },
    { id: 'cs401', name: 'Database Systems' },
    { id: 'cs501', name: 'Artificial Intelligence' },
  ],
  ee: [
    { id: 'ee101', name: 'Circuit Analysis' },
    { id: 'ee201', name: 'Digital Logic Design' },
    { id: 'ee301', name: 'Signals and Systems' },
    { id: 'ee401', name: 'Electromagnetic Fields' },
    { id: 'ee501', name: 'Control Systems' },
  ],
}

const recommendedRoadmap = {
  cs: [
    { semester: 1, courses: ['cs101'] },
    { semester: 2, courses: ['cs201'] },
    { semester: 3, courses: ['cs301', 'cs401'] },
    { semester: 4, courses: ['cs501'] },
  ],
  ee: [
    { semester: 1, courses: ['ee101'] },
    { semester: 2, courses: ['ee201'] },
    { semester: 3, courses: ['ee301', 'ee401'] },
    { semester: 4, courses: ['ee501'] },
  ],
}

type Course = { id: string; name: string }
type Semester = { id: string; name: string; courses: Course[] }

const semesterSuggestions = [
  'Fall 2024', 'Winter 2024', 'Spring 2025', 'Summer 2025',
  'Fall 2025', 'Winter 2025', 'Spring 2026', 'Summer 2026'
]

export default function Component() {
  const [selectedMajor, setSelectedMajor] = useState<string | undefined>()
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 'semester1', name: '', courses: [] },
    { id: 'semester2', name: '', courses: [] },
    { id: 'semester3', name: '', courses: [] },
    { id: 'semester4', name: '', courses: [] },
  ])
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [completedCourses, setCompletedCourses] = useState<Course[]>([])
  const draggedCourse = useRef<{ course: Course, source: string } | null>(null)

  const handleMajorChange = (majorId: string) => {
    setSelectedMajor(majorId)
    setAvailableCourses(courses[majorId as keyof typeof courses])
    setCompletedCourses([])
    setSemesters([
      { id: 'semester1', name: '', courses: [] },
      { id: 'semester2', name: '', courses: [] },
      { id: 'semester3', name: '', courses: [] },
      { id: 'semester4', name: '', courses: [] },
    ])
  }

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, course: Course, source: string) => {
    draggedCourse.current = { course, source }
    e.dataTransfer.setData('text/plain', course.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    if (draggedCourse.current) {
      const { course, source } = draggedCourse.current

      if (source === targetId) return

      // Remove course from source
      if (source === 'availableCourses') {
        setAvailableCourses(prev => prev.filter(c => c.id !== course.id))
      } else if (source === 'completedCourses') {
        setCompletedCourses(prev => prev.filter(c => c.id !== course.id))
      } else {
        setSemesters(prev => prev.map(sem => 
          sem.id === source ? { ...sem, courses: sem.courses.filter(c => c.id !== course.id) } : sem
        ))
      }

      // Add course to target
      if (targetId === 'availableCourses') {
        setAvailableCourses(prev => [...prev, course])
      } else if (targetId === 'completedCourses') {
        setCompletedCourses(prev => [...prev, course])
      } else {
        setSemesters(prev => prev.map(sem => 
          sem.id === targetId ? { ...sem, courses: [...sem.courses, course] } : sem
        ))
      }

      draggedCourse.current = null
    }
  }

  const handleCourseClick = (course: Course, semesterId: string) => {
    setSemesters(prev => prev.map(sem => 
      sem.id === semesterId ? { ...sem, courses: sem.courses.filter(c => c.id !== course.id) } : sem
    ))
    setAvailableCourses(prev => [...prev, course])
  }

  const addSemester = () => {
    setSemesters(prev => [...prev, { id: `semester${prev.length + 1}`, name: '', courses: [] }])
  }

  const removeSemester = () => {
    if (semesters.length > 1) {
      const lastSemester = semesters[semesters.length - 1]!;
      setAvailableCourses(prev => [...prev, ...lastSemester.courses])
      setSemesters(prev => prev.slice(0, -1))
    }
  }

  const renameSemester = (semesterId: string, newName: string) => {
    setSemesters(prev => prev.map(sem => 
      sem.id === semesterId ? { ...sem, name: newName } : sem
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Planner</h1>
      <Select onValueChange={handleMajorChange}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select your major" />
        </SelectTrigger>
        <SelectContent>
          {majors.map((major) => (
            <SelectItem key={major.id} value={major.id}>{major.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedMajor && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Course Plan</h2>
            <div className="space-x-2">
              <Button onClick={addSemester} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Semester
              </Button>
              <Button onClick={removeSemester} size="sm" variant="outline" disabled={semesters.length <= 1}>
                <MinusCircle className="mr-2 h-4 w-4" />
                Remove Semester
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                {semesters.map((semester, index) => (
                  <div
                    key={semester.id}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, semester.id)}
                    className="mb-4 p-2 bg-secondary rounded"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {semester.name || `Semester ${index + 1}`}
                      </h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">Rename Semester</h4>
                              <p className="text-sm text-muted-foreground">
                                Enter a new name or select from suggestions.
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <Input
                                id={`rename-${semester.id}`}
                                defaultValue={semester.name}
                                onChange={(e) => renameSemester(semester.id, e.target.value)}
                              />
                              <div className="grid grid-cols-2 gap-2">
                                {semesterSuggestions.slice(0, 4).map((suggestion) => (
                                  <Button
                                    key={suggestion}
                                    variant="outline"
                                    size="sm"
                                    className="justify-start"
                                    onClick={() => renameSemester(semester.id, suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {semester.courses.map((course) => (
                      <div
                        key={course.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, course, semester.id)}
                        onClick={() => handleCourseClick(course, semester.id)}
                        className="bg-background p-2 mb-2 rounded cursor-move hover:bg-accent"
                      >
                        {course.name}
                      </div>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Roadmap</CardTitle>
              </CardHeader>
              <CardContent>
                {recommendedRoadmap[selectedMajor as keyof typeof recommendedRoadmap].map((semester) => (
                  <div key={semester.semester} className="mb-4">
                    <h3 className="font-semibold mb-2">Semester {semester.semester}</h3>
                    <ul className="list-disc pl-5">
                      {semester.courses.map((courseId) => (
                        <li key={courseId}>
                          {courses[selectedMajor as keyof typeof courses].find(c => c.id === courseId)?.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 min-h-[100px]"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, 'availableCourses')}
              >
                {availableCourses.map((course) => (
                  <div
                    key={course.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, course, 'availableCourses')}
                    className="bg-secondary p-2 rounded cursor-move"
                  >
                    {course.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Completed Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 min-h-[100px]"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, 'completedCourses')}
              >
                {completedCourses.map((course) => (
                  <div
                    key={course.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, course, 'completedCourses')}
                    className="bg-secondary p-2 rounded cursor-move"
                  >
                    {course.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
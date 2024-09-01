'use client';

import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import { emailExists } from '@/lib/utils';

export default function CreateClassCade() {
  const {user, error, isLoading} = useUser()
  const [name, setName] = useState('');
  const [teachers, setTeachers] = useState<string[]>([]);
  const [newTeacher, setNewTeachers] = useState<string>('');
  const [teacherAddMessage, setTeacherAddMessage] = useState<string>('')
  const [students, setStudents] = useState<string[]>([]);
  const [newStudent, setNewStudent] = useState<string>('');
  const [studentAddMessage, setStudentAddMessage] = useState<string>('')
  const [subject, setSubject] = useState('');
  const [room, setRoom] = useState('');
  const [color, setColor] = useState('#ffffff');
  
  if (isLoading) return <div>...Loading</div>

  if (!user) {
    redirect('/')
}
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
          try {
              // Check email existence for teachers and students
              const teachersValidation = await Promise.all(
                  teachers.map(async (teacher) => {
                      const exists = await emailExists(teacher, () => {});
                      return exists ? teacher : null;
                  })
              );
  
              const studentsValidation = await Promise.all(
                  students.map(async (student) => {
                      const exists = await emailExists(student, () => {});
                      return exists ? student : null;
                  })
              );
  
              // Filter out null values
              const validTeachers = teachersValidation.filter(Boolean) as string[];
              const validStudents = studentsValidation.filter(Boolean) as string[];
  
              // Update state with valid teachers and students
              setTeachers(validTeachers);
              setStudents(validStudents);
  
              // Submit form data
              await fetch('/api/classcades', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ user: user.email, name, teachers: validTeachers, students: validStudents, subject, room, color }),
              });
              alert('ClassCade created successfully');
          } catch (error) {
              console.error('Failed to create ClassCade:', error);
              alert('Failed to create ClassCade');
          }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Teachers:
            <ul>{teachers.map((item) => <li>
                <p>
                    {item}
                </p>
                <button onClick={(e) => {
                  e.preventDefault()
                  setTeachers(teachers.filter(teacher => teacher !== item))
                  }}>X</button>
                </li>
                )}
            </ul>
          <input type="text" value={newTeacher} onChange={(e) => {
                setNewTeachers(e.target.value)
                }
            } />
          <button onClick={(e) => {
            e.preventDefault()
            if (!teachers.includes(newTeacher) && !students.includes(newTeacher) && newTeacher) {
              setTeachers([...teachers, newTeacher])
              emailExists(newTeacher, setTeacherAddMessage)}
            setNewTeachers("")
            }}>Add Teacher</button>
            <p>{teacherAddMessage}</p>
        </label>
      </div>
      <div>
        <label>
          Students:
            <ul>{students.map((item) => <li>
                <p>
                    {item}
                </p>
                <button onClick={(e) => {
                  e.preventDefault()
                  setStudents(students.filter(student => student !== item))
                }
                  }>X</button>
                </li>
                )}
            </ul>
          <input type="text" value={newStudent} onChange={(e) => {
                setNewStudent(e.target.value)
                }
            } />
          <button onClick={(e) => {
            e.preventDefault()
            if (!students.includes(newStudent) && !teachers.includes(newStudent) && newStudent && newStudent !== user.email) {
              console.log(students.includes(newStudent))
              setStudents([...students, newStudent])
              emailExists(newStudent, setStudentAddMessage)}
            setNewStudent("")
            }}>Add Student</button>
            <p>{studentAddMessage}</p>
        </label>
      </div>
      <div>
        <label>
          Subject:
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Room:
          <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} required />
        </label>
      </div>
      <div>
        <label>
          Background Color:
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </label>
      </div>
      <button type="submit">Create ClassCade</button>
    </form>
  );
}

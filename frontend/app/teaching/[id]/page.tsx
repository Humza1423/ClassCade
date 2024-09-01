"use client"
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { ClassCadeMaterial, Assessment, ClassCade } from '@/lib/utils';
import { useParams } from "next/navigation";
import styles from './teaching.module.css';
import Material from '@/app/components/Material';
import { emailExists } from '@/lib/utils';

const page = () => {
    const params = useParams();
    const { user, isLoading } = useUser();
    const [ClassCadeState, setClassCade] = useState<ClassCade | null>(null);
    const [ClassCadeMaterialState, setClassCadeMaterial] = useState<ClassCadeMaterial[] | null>(null);
    const [AssessmentState, setAssessmentState] = useState<Assessment[] | null>(null);
    const [tab, setTab] = useState<string>("classroom");
    const [newTeacher, setNewTeacher] = useState<string>('');
    const [teacherAddMessage, setTeacherAddMessage] = useState<string>('');
    const [newStudent, setNewStudent] = useState<string>('');
    const [studentAddMessage, setStudentAddMessage] = useState<string>('');
    const { id } = params;

  useEffect(() => {
    if (user) {
      const fetchClassCade = async () => {
        try {
          const response = await fetch(`/api/GetClassCades/${id}`,
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "GET"
          })
          .then((res) => res.json())
          .then(async (res) => {
            { 
              const { classCade, classCadeMaterial, Assessments } = res
              console.log("classCadeMaterial: ", classCadeMaterial)
              await setClassCade(classCade[0]);
              await setClassCadeMaterial(classCadeMaterial)
              await setAssessmentState(Assessments)
            }
          })

          
        } catch (error) {
          console.error('Failed to fetch ClassCades:', error);
        }
      };

      fetchClassCade();
    }
  }, [user]);


  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const exists = await emailExists(newTeacher, setTeacherAddMessage);
    if (exists) {
        await fetch(`/api/add_teacher/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ teacher: newTeacher }),
        });
        setNewTeacher('');
        setTeacherAddMessage('Teacher added successfully');
    }
};

const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const exists = await emailExists(newStudent, setStudentAddMessage);
    if (exists) {
        await fetch(`/api/add_student/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student: newStudent }),
        });
        setNewStudent('');
        setStudentAddMessage('Student added successfully');
    }
};

  return (
    <main>
        <nav>
            <button onClick={() => setTab('classroom')}>Classroom</button>
            <button onClick={() => setTab('people')}>People</button>
            <button onClick={() => setTab('material')}>Materials/Assessments</button>
        </nav>
        {tab === "classroom" && ClassCadeState && 
            <div>
                <div
                key={ClassCadeState.id}
                style={{ backgroundColor: ClassCadeState.css_styles }}
                className={styles.classcade}
                >
                <h2>{ClassCadeState.name}</h2>
                <p>Teachers: {ClassCadeState.teacher_ids}</p>
                <p>Subject: {ClassCadeState.subject}</p>
                <p>Room: {ClassCadeState.room}</p>
                </div>
                <input type="text" placeholder='Add Comment'/>
                <form action={`/api/new_material/${id}`} method='POST'>
                    <input type="text" placeholder='Title' name='Title'/>
                    <textarea placeholder='Description' name='Description'/>
                    <input type="text" placeholder='Links' name='Links'/>
                    <input type="submit" value="Add Material"/>
                </form>
                <form action={`/api/new_assessment/${id}`} method='POST'>
                    <input type="text" placeholder='Title' name='Title' required />
                    <textarea placeholder='Description' name='Description' required></textarea>
                    <input type="text" placeholder='Links' name='Links' />
                    <input type="date" placeholder='Due Date' name='due_date' required />
                    <select name='assessment_type' required>
                        <option value='summative'>Summative</option>
                        <option value='formative'>Formative</option>
                    </select>
                    <select name='assignment_type' required>
                        <option value='project'>Project</option>
                        <option value='lab'>Lab</option>
                        <option value='essay'>Essay</option>
                        <option value='test'>Test</option>
                        <option value='exam'>Exam</option>
                        <option value='quiz'>Quiz</option>
                        <option value='presentation'>Presentation</option>
                        <option value='other'>Other</option>
                    </select>
                    <input type="submit" value="Add Assignment" />
                </form>
                <Material ClassCadeMaterialState={ClassCadeMaterialState} Assessment={AssessmentState}/>
            </div>
        }
    
        {tab === "people" && ClassCadeState && 
            <div>
                <h2>Teachers</h2>
                <ul>
                    {ClassCadeState.teacher_ids.split(',').map((teacher) => <li key={teacher}>{teacher}</li>)}
                </ul>
                <h2>Students</h2>
                <ul>
                    {ClassCadeState.student_ids.split(',').map((student) => <li key={student}>{student}</li>)}
                </ul>
                <form onSubmit={handleAddTeacher}>
                    <input
                        type="text"
                        value={newTeacher}
                        onChange={(e) => setNewTeacher(e.target.value)}
                        placeholder="Add Teacher Email"
                        required
                    />
                    <button type="submit">Add Teacher</button>
                    <p>{teacherAddMessage}</p>
                </form>
                <form onSubmit={handleAddStudent}>
                    <input
                        type="text"
                        value={newStudent}
                        onChange={(e) => setNewStudent(e.target.value)}
                        placeholder="Add Student Email"
                        required
                    />
                    <button type="submit">Add Student</button>
                    <p>{studentAddMessage}</p>
                </form>
            </div>
        }
        {tab === "material" && <Material ClassCadeMaterialState={ClassCadeMaterialState} Assessment={AssessmentState}/>}
    </main>
  )
}

export default page
"use client"
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { ClassCadeMaterial, Assessment, ClassCade } from '@/lib/utils';
import { useParams } from "next/navigation";
import styles from './enrolled.module.css';
import MaterialStudent from '@/app/components/MaterialStudent';

const page = () => {
    const params = useParams();
    const { user, isLoading } = useUser();
    const [ClassCadeState, setClassCade] = useState<ClassCade | null>(null);
    const [ClassCadeMaterialState, setClassCadeMaterial] = useState<ClassCadeMaterial[] | null>(null);
    const [AssessmentState, setAssessmentState] = useState<Assessment[] | null>(null);
    const [tab, setTab] = useState<string>("classroom");
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
                <MaterialStudent ClassCadeMaterialState={ClassCadeMaterialState} Assessment={AssessmentState}/>
            </div>
        }
    
        {tab === "people" && ClassCadeState && 
            <div>
                <h2>Teachers</h2>
                <ul>
                    {ClassCadeState.teacher_ids.split(',').map((teacher) => <li>{teacher}</li>)}
                </ul>
                <h2>Students</h2>
                <ul>
                    {ClassCadeState.student_ids.split(',').map((student) => <li>{student}</li>)}
                </ul>
            </div>
        }
        {tab === "material" && <MaterialStudent ClassCadeMaterialState={ClassCadeMaterialState} Assessment={AssessmentState}/>}
    </main>
  )
}

export default page
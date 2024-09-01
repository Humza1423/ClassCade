"use client"
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { StudentAssessment, Assessment, ClassCade } from '@/lib/utils';
import { useParams } from "next/navigation";
import styles from './enrolled.module.css';
import MaterialStudent from '@/app/components/MaterialStudent';

const page = () => {
    const params = useParams();
    const { user, isLoading } = useUser();
    const [AssessmentState, setAssessmentState] = useState<StudentAssessment | null>(null);
    const { id } = params;
    
    useEffect(() => {
        if (user) {
          const fetchClassCade = async () => {
            try {
              const response = await fetch(`/api/get_student_assessment`,
              {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: "POST",
                    body: JSON.stringify({condition: `id`, value: id})
              })
              .then((res) => res.json())
              .then(async (res) => {
                { 
                  const { Assessment } = res
                  await setAssessmentState(Assessment[0])
                  console.log(AssessmentState)
                }
              })
              
            } catch (error) {
              console.error('Failed to fetch assessment:', error);
            }
          };
    
          fetchClassCade();
        }
      }, [user]);
    
        if (!AssessmentState) return <div>Loading...</div>;
  return (
    <main>
        <h1>Assessment</h1>
        <h2>Student: {AssessmentState.student_email}</h2>
        <p>Submission Links: {AssessmentState.submission}</p>
        <p>Date Submitted: {AssessmentState.submission_date}</p>
        <form action={`/mark_assessment/${id}`} method="POST">
            <label>Mark:</label>
            <input type="number" max='100' min='0' placeholder='Mark' name='Mark'/>
            <input type="hidden" value={AssessmentState.assessment_id} name='assessmentId'/>
            <button type="submit">Mark Assessment</button>
        </form>
    </main>
  )
}

export default page
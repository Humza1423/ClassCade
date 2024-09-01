"use client"
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { StudentAssessment, Assessment, ClassCade } from '@/lib/utils';
import { useParams } from "next/navigation";
import Link from 'next/link';

const page = () => {
    const params = useParams();
    const { user, isLoading } = useUser();
    const [AssessmentsState, setAssessmentsState] = useState<StudentAssessment[] | null>(null);
    const [Assignments, setAssignments] = useState<Assessment[] | null>(null);
    const { id } = params;
    
    useEffect(() => {
        if (user && user.email) {
          const fetchClassCade = async () => {
            try {
              const response = await fetch(`/api/get_student_assessment`,
              {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  method: "POST",
                    body: JSON.stringify({condition: `student_email`, value: user.email})
              })
              .then((res) => res.json())
              .then(async (res) => {
                { 
                  const { Assessment } = res
                  await setAssessmentsState(Assessment)
                  console.log(AssessmentsState)
                }
              })
              
            } catch (error) {
              console.error('Failed to fetch assessment:', error);
            }
            if (AssessmentsState) {
                const UserAssignments = AssessmentsState.map((assessment) => {assessment.assessment_id})
                console.log(AssessmentsState)
            try {
                const response = await fetch(`/api/get_assessment/multiple_args`,
                {
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    method: "POST",
                      body: JSON.stringify({condition: `assessment_id`, value: UserAssignments})
                })
                .then((res) => res.json())
                .then(async (res) => {
                  { 
                    const { assessments } = res
                    await setAssignments(assessments)
                    console.log("Assignments: ", Assignments)
                  }
                })
                
              } catch (error) {
                console.error('Failed to fetch assessment:', error);
              }
            }
          };
            
    
          fetchClassCade();
        }
      }, [user]);
    
        if (!AssessmentsState) return <div>Loading...</div>;
  return (
    <div>
        <Link href="">Gaming Time!</Link>
    </div>
  )
}

export default page
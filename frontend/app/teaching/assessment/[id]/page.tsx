"use client"
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { StudentAssessment, Assessment, ClassCade } from '@/lib/utils';
import { useParams } from "next/navigation";
import Link from 'next/link';

const page = () => {
    const params = useParams();
    const { user } = useUser();
    const [AssessmentsState, setAssessmentsState] = useState<StudentAssessment[] | null>(null);
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
                body: JSON.stringify({condition: `assessment_id`, value: id})
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
      };

      fetchClassCade();
    }
  }, [user]);

  return (
    <main>
        {AssessmentsState && AssessmentsState.map((assessment) => <div>
          <Link href={`/teaching/marking/${assessment.id}`}>
            <h2>Student: {assessment.student_email}</h2>
            <p>{assessment.submission}</p>
            <p>Date Submitted: {assessment.submission_date}</p>
          </Link>
        </div>)}
    </main>
  )
}

export default page
"use client"
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { ClassCadeMaterial, Assessment, ClassCade } from '@/lib/utils';
import { useParams } from "next/navigation";

const page = () => {
    const params = useParams();
    const { user, isLoading } = useUser();
    const [AssessmentState, setAssessmentState] = useState<Assessment | null>(null);
    const { id } = params;

  useEffect(() => {
    if (user) {
      const fetchClassCade = async () => {
        try {
          const response = await fetch(`/api/get_assessment`,
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

  if (!AssessmentState?.classcade_id || !user?.email) return <div>Loading</div>;
  return (
    <main>
        <form action={`/submit_assessment/${id}`} method='POST'>
            <textarea name="submissions" placeholder='submissions' />
            <input type="submit" value="Submit" />
            <input type="hidden" value={AssessmentState.classcade_id} name='classId'/>
            <input type="hidden" value={user.email} name='email'/>
        </form>
    </main>
  )
}

export default page
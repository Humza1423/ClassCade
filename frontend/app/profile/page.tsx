"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { StudentAssessment, Assessment } from '@/lib/utils';
import { useParams } from "next/navigation";
import Link from 'next/link';

interface markState {
    mark: number|null;
    title: string;
    assessment_type: 'summative' | 'formative';
    assignment_type: 'project' | 'lab' | 'essay' | 'test' | 'exam' | 'quiz' | 'presentation' | 'other';
}

const Page = () => {
  const params = useParams();
  const { user, isLoading } = useUser();
  const [AssessmentsState, setAssessmentsState] = useState<StudentAssessment[] | null>(null);
  const [Assignments, setAssignments] = useState<Assessment[] | null>(null);
  const [markState, setMarkState] = useState<markState[] | null>(null);
  const { id } = params;

  useEffect(() => {
    if (user && user.email) {
      const fetchClassCade = async () => {
        try {
          const response = await fetch(`/api/get_student_assessment`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify({ condition: `student_email`, value: user.email }),
          });

          const res = await response.json();
          const { Assessment } = res;

          setAssessmentsState(Assessment);
          console.log('Assessments : ', Assessment);

          if (Assessment && Assessment.length > 0) {
            const UserAssignments = Assessment.map((assessment: StudentAssessment) => assessment.assessment_id);
            console.log('UserAssignments: ', UserAssignments);

            const assignmentsResponse = await fetch(`/api/get_assessment/multiple_args`, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              method: "POST",
              body: JSON.stringify({ condition: `id`, values: UserAssignments }),
            });

            const assignmentsRes = await assignmentsResponse.json();
            const { assessments } = assignmentsRes;

            await setAssignments(assessments);
          }
        } catch (error) {
          console.error('Failed to fetch assessment:', error);
        }
      };

      fetchClassCade();
    }
  }, [user]);

  useEffect(() => {
    const updateMarkState = async () => {
        if (Assignments && AssessmentsState) {
            const newMarkState = Assignments.map((assignment: Assessment) => {
                const studentAssessment = AssessmentsState.find((a: StudentAssessment) => a.assessment_id === assignment.id);
                return {
                mark: studentAssessment?.mark || null,
                title: assignment.title,
                assessment_type: assignment.assessment_type,
                assignment_type: assignment.assignment_type,
                };
            });
            console.log('newMarkState: ', newMarkState);
            setMarkState(newMarkState);
            console.log('JSON: ', JSON.stringify(markState))
        }
    }
  updateMarkState();
}, [Assignments, AssessmentsState]);

  if (!AssessmentsState || !Assignments) return <div>Loading...</div>;
  else if (Assignments && Assignments.length > 0) {
    console.log('Assignmentstest20: ', Assignments);
    console.log('Assignmentstest22: ', AssessmentsState);
  };

  return (
    <div>
        {markState &&
            <div>
                {markState.map((assignment: markState, index: number) => <div key={index}>
                <h2>{assignment.title}</h2>
                    <label>Mark: {assignment.mark}</label>
                    <h3>Assessment Type: {assignment.assignment_type}</h3>
                    <h3>Assignment Type: {assignment.assessment_type}</h3>
            </div>)}
            <form action="http://192.168.2.66:5000/update_stats" method='POST'> // This is the URL of the backend server. Change 192.168.2.66 to your own IP address. Leave the :5000. It should be http://(your IP address):5000/update_stats
                <input type="submit" value={'Gaming Time!'}/>
                <input type="hidden" name='stats' value={JSON.stringify(markState)}/>
            </form>
        </div>
        }
    </div>
  );
};

export default Page;

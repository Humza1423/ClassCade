export interface ClassCade {
    id: number;
    name: string;
    teacher_ids: string;
    student_ids: string;
    subject: string;
    room: string;
    css_styles: string;
  }

export interface ClassCadeMaterial {
    id: number;
    date_created: string;
    title: string;
    description: string;
    links: string;
    classcade_id: number;
}

export interface Assessment {
    id: number;
    date_created: string;
    title: string;
    description?: string; 
    links?: string; 
    due_date: string; 
    submission_date?: string; 
    submissions?: string; 
    assessment_type: 'summative' | 'formative';
    assignment_type: 'project' | 'lab' | 'essay' | 'test' | 'exam' | 'quiz' | 'presentation' | 'other';
    mark?: number; 
    classcade_id: number;
}

export interface StudentAssessment {
    id: number;
    student_email: string;
    assessment_id: number;
    mark: number | null;
    submission: string;
    submission_date: string;
}

export const emailExists = async (email: string, setMessage: (value: string) => void) => {
    try {
        const response = await fetch("/api/emailexists", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({email})
        })
        const { verifiedMessage, unverifiedMessage, error } = await response.json()
        if (verifiedMessage) {
            console.log(verifiedMessage)
            setMessage(verifiedMessage)
            return true
        }  else if (unverifiedMessage) {
            setMessage(unverifiedMessage)
            console.log(unverifiedMessage)
            return false
        }  else if (error) {
          setMessage(error.message)
          return false
      }
    } catch (error) {
        console.log(error)
        setMessage("An error occured")
        return false
    }
}

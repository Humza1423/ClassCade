"use client"

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface ClassCade {
  id: number;
  name: string;
  teachers: string;
  subject: string;
  room: string;
  css_styles: string;
}

export default function Home() {
  const { user, isLoading } = useUser();
  const [classCadesAsStd, setClassCadesAsStd] = useState<ClassCade[]>([]);
  const [classCadesAsTch, setClassCadesAsTch] = useState<ClassCade[]>([]);

  useEffect(() => {
    if (user) {
      const fetchClassCades = async () => {
        try {
          const response = await fetch('/api/GetClassCades',
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify({user: user.email})
          })
          .then((res) => res.json())
          .then(async (res) => {
            { 
              const { classCadesAsTeacher, classCadesAsStudent } = res
              console.log("classCadesAsTeacher: ", classCadesAsTeacher)
              console.log("classCadesAsStudent: ", classCadesAsStudent)
              await setClassCadesAsTch(classCadesAsTeacher);
              await setClassCadesAsStd(classCadesAsStudent)
            }
          })

          
        } catch (error) {
          console.error('Failed to fetch ClassCades:', error);
        }
      };

      fetchClassCades();
    }
  }, [user]);
  

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      {!user ? (
        <a href="/api/auth/login">Sign in to ClassCade</a>
      ) : (
        <div>
          {classCadesAsTch && classCadesAsTch.map((classCade) => (
            <div
              key={classCade.id}
              style={{ backgroundColor: classCade.css_styles }}
              className={styles.classcade}
            >
              <h2>{classCade.name}</h2>
              <p>Teachers: {classCade.teachers}</p>
              <p>Subject: {classCade.subject}</p>
              <p>Room: {classCade.room}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

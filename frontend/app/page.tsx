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
  const [classCades, setClassCades] = useState<ClassCade[]>([]);

  useEffect(() => {
    if (user) {
      console.log(user)
      const fetchClassCades = async () => {
        try {
          const response = await fetch('/api/classcades',
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              method: "GET",
              body: JSON.stringify({user: user.email})
          });
          const data = await response.json();
          setClassCades(data);
          console.log(classCades)
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
          {classCades && classCades.map((classCade) => (
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

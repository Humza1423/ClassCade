'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      {!user ? <a href="/api/auth/login">Sign in to ClassCade</a> : 
      <div>
      </div>
      }
    </main>
  );
}

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}

export const BASEURL = "http://localhost:8000";
"use client";

import Link from 'next/link';
import { useState } from 'react';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

const emptyForm: RegisterFormData = {
  username: '',
  email: '',
  password: '',
};

export default function RegisterForm() {
  const [loginFormData, setLoginFormData] = useState<RegisterFormData>(emptyForm);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="p-10 flex flex-col gap-y-8">
      <h1 className="font-bold text-3xl text-center">Register</h1>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <input value={loginFormData.username}
          onChange={(e) => setLoginFormData({ ...loginFormData, username: e.target.value })}
          placeholder="Username"
          type="text"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <input value={loginFormData.email}
          onChange={(e) => setLoginFormData({ ...loginFormData, email: e.target.value })}
          placeholder="Email"
          type="text"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <input
          value={loginFormData.password}
          onChange={(e) => setLoginFormData({ ...loginFormData, password: e.target.value })}
          placeholder="Password"
          type="password"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <button type="submit" className="rounded-lg bg-blue-900 text-white text-base font-bold p-3">
          Register
        </button>
      </form>
      <span className="text-center">Already own an account? <Link href="/login" className="text-blue-900 font-bold">Login</Link></span>
    </div>
  );
}
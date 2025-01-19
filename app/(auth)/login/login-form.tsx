"use client";

import Link from 'next/link';
import { useState } from "react";

export type LoginFormData = {
  username_email: string;
  password: string;
};

const emptyForm: LoginFormData = {
  username_email: "",
  password: "",
};

export default function LoginForm() {
  const [loginFormData, setLoginFormData] = useState<LoginFormData>(emptyForm);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="p-10 flex flex-col gap-y-8">
      <h1 className="font-bold text-3xl text-center">Login</h1>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <input value={loginFormData.username_email}
          onChange={(e) => setLoginFormData({ ...loginFormData, username_email: e.target.value })}
          placeholder="Username or email"
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
          Login
        </button>
      </form>
      <span className="text-center">Still not own an account? <Link href="/register" className="text-blue-900 font-bold">Register</Link></span>
    </div>
  );
}

"use client";

import { Role } from "@/app/common/enums";
import Link from "next/link";
import { useState } from "react";

type RegisterFormData = {
  username: string;
  full_name: string;
  role: Role;
  email: string;
  password: string;
};

const emptyForm: RegisterFormData = {
  username: "",
  email: "",
  password: "",
  full_name: "",
  role: Role.USER,
};

export default function RegisterForm() {
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>(emptyForm);

  async function handleSubmit() {

  }

  return (
    <div className="p-10 flex flex-col gap-y-8">
      <h1 className="font-bold text-3xl text-center">Register</h1>
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <input
          name="full_name"
          value={registerFormData.full_name}
          onChange={(e) => setRegisterFormData({ ...registerFormData, full_name: e.target.value })}
          placeholder="Full name"
          type="text"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <input
          name="username"
          value={registerFormData.username}
          onChange={(e) => setRegisterFormData({ ...registerFormData, username: e.target.value })}
          placeholder="Username"
          type="text"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <input
          name="email"
          value={registerFormData.email}
          onChange={(e) => setRegisterFormData({ ...registerFormData, email: e.target.value })}
          placeholder="Email"
          type="text"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <input
          name="password"
          value={registerFormData.password}
          onChange={(e) => setRegisterFormData({ ...registerFormData, password: e.target.value })}
          placeholder="Password"
          type="password"
          required
          className="border rounded-lg min-w-[400px] text-base p-2"
        />
        <button type="submit" className="rounded-lg bg-blue-900 text-white text-base font-bold p-3">
          Register
        </button>
      </form>
      <span className="text-center">
        Already own an account?{" "}
        <Link href="/login" className="text-blue-900 font-bold">
          Login
        </Link>
      </span>
    </div>
  );
}

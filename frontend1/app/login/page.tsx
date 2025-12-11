"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import "./login.css";
import { signup, login } from "@/services/user";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm({ ...signupForm, [name]: value });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signup(signupForm);
      debugger;
      alert(res.message);
      if (res.success) setActiveTab("login");
    } catch (err: any) {
      console.error(err);
      alert("Signup failed");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(loginForm);
      debugger;
      if (res.success) {
      
        localStorage.setItem("token", res.token);
        alert("Login successful");
      } else {
        alert(res.message || "Login failed");
      }
       router.push("/");
    } catch (err: any) {
      console.error(err);
      alert("Login failed");
    }
  };

  

  return (
    <div className="form">
      <ul className="tab-group">
        <li className={activeTab === "signup" ? "tab active" : "tab"}>
          <button type="button" onClick={() => setActiveTab("signup")}>
            Sign Up
          </button>
        </li>
        <li className={activeTab === "login" ? "tab active" : "tab"}>
          <button type="button" onClick={() => setActiveTab("login")}>
            Log In
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === "signup" && (
          <div id="signup">
            <h1>Sign Up for Free</h1>
            <form onSubmit={handleSignupSubmit}>
              <div className="top-row">
                <div className="field-wrap">
                  <label className={signupForm.username ? "active" : ""}>
                    User Name<span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={signupForm.username}
                    onChange={handleSignupChange}
                    required
                    autoComplete="off"
                  />
                </div>

               
              </div>

              <div className="field-wrap">
                <label className={signupForm.email ? "active" : ""}>
                  Email Address<span className="req">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleSignupChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="field-wrap">
                <label className={signupForm.password ? "active" : ""}>
                  Set A Password<span className="req">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleSignupChange}
                  required
                  autoComplete="off"
                />
              </div>

              <button type="submit" className="button button-block">
                Get Started
              </button>
            </form>
          </div>
        )}

        {activeTab === "login" && (
          <div id="login">
            <h1>Welcome Back!</h1>
            <form onSubmit={handleLoginSubmit}>
              <div className="field-wrap">
                <label className={loginForm.email ? "active" : ""}>
                  Email Address<span className="req">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="field-wrap">
                <label className={loginForm.password ? "active" : ""}>
                  Password<span className="req">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  autoComplete="off"
                />
              </div>

              <p className="forgot">
                <a href="#">Forgot Password?</a>
              </p>

              <button type="submit" className="button button-block">
                Log In
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

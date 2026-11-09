"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const inputClassName =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-3.5 pl-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand/70 focus:bg-white/[0.06] focus:ring-2 focus:ring-brand/30"

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    }

    await handleSignIn({
      email: data.email,
      password: data.password,
    })
  }

  const handleSignIn = async (data: {
    email: string
    password: string
  }) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    if (error) console.error("Sign in failed:", error)
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to keep track of your applications and saved roles."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-brand-soft underline-offset-4 hover:text-white hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-manrope text-sm font-medium text-white/80"
          >
            Email address
          </label>
          <div className="relative">
            <Mail
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40"
              strokeWidth={1.75}
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="password"
              className="font-manrope text-sm font-medium text-white/80"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="font-manrope text-xs font-medium text-brand-soft underline-offset-4 hover:text-white hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40"
              strokeWidth={1.75}
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              className={`${inputClassName} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 text-white/40 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-brand-soft/70"
            >
              {showPassword ? (
                <EyeOff className="size-4" strokeWidth={1.75} />
              ) : (
                <Eye className="size-4" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2.5 font-manrope text-sm text-white/70 select-none">
          <input
            type="checkbox"
            name="rememberMe"
            className="size-4 accent-brand"
          />
          Remember me for 30 days
        </label>

        <Button
          type="submit"
          className="mt-1 h-11 w-full rounded-xl bg-brand font-manrope text-base font-semibold text-white hover:bg-brand-soft"
        >
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}

export default SignInPage

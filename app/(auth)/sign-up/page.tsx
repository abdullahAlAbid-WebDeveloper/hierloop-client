"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Eye, EyeOff, Lock, Mail, User, Users } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const inputClassName =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-3.5 pl-10 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand/70 focus:bg-white/[0.06] focus:ring-2 focus:ring-brand/30"

type UserRole = "seeker" | "recruiter" | "admin"

const SignUpPage = () => {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      role: String(formData.get("role") ?? "seeker") as UserRole,
      acceptedTerms: formData.get("acceptedTerms") === "on",
    }

    await handleSignUp({
      name: data.fullName,
      email: data.email,
      password: data.password,
      role: data.role,
    })
  }

  const handleSignUp = async (data: {
    name: string
    email: string
    password: string
    role: UserRole
  }) => {
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      callbackURL: "/", // An optional URL to redirect to after the user signs up.
    })
    if (!error) {
      router.refresh();
      router.push("/")
    }

    if (error) console.error("Sign up failed:", error)
  }

  return (
    <AuthShell
      title="Create your account"
      description="Join HireLoop and start applying to roles that fit you."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-brand-soft underline-offset-4 hover:text-white hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="fullName"
            className="font-manrope text-sm font-medium text-white/80"
          >
            Full name
          </label>
          <div className="relative">
            <User
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40"
              strokeWidth={1.75}
            />
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              required
              className={inputClassName}
            />
          </div>
        </div>

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
          <label
            htmlFor="role"
            className="font-manrope text-sm font-medium text-white/80"
          >
            I am a
          </label>
          <div className="relative">
            <Users
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40"
              strokeWidth={1.75}
            />
            <select
              id="role"
              name="role"
              defaultValue="seeker"
              required
              className={`${inputClassName} cursor-pointer appearance-none pr-10 [&>option]:bg-neutral-900 [&>option]:text-white`}
            >
              <option value="seeker">Job seeker</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-white/40"
              strokeWidth={1.75}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-manrope text-sm font-medium text-white/80"
          >
            Password
          </label>
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
              autoComplete="new-password"
              placeholder="Create a password"
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

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="font-manrope text-sm font-medium text-white/80"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/40"
              strokeWidth={1.75}
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter your password"
              required
              className={inputClassName}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 font-manrope text-sm leading-relaxed text-white/70 select-none">
          <input
            type="checkbox"
            name="acceptedTerms"
            required
            className="mt-0.5 size-4 shrink-0 accent-brand"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-brand-soft underline-offset-4 hover:text-white hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-brand-soft underline-offset-4 hover:text-white hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button
          type="submit"
          className="mt-1 h-11 w-full rounded-xl bg-brand font-manrope text-base font-semibold text-white hover:bg-brand-soft"
        >
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}

export default SignUpPage

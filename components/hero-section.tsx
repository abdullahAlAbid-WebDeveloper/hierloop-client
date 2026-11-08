import Image from "next/image"
import Link from "next/link"
import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"

const stats = [
  { value: "50K", label: "Active Jobs", icon: BriefcaseBusiness },
  { value: "12K", label: "Companies", icon: Building2 },
  { value: "2M", label: "Job Seekers", icon: Users },
  { value: "97%", label: "Satisfaction Rate", icon: Star },
] as const

const trending = ["Product Designer", "AI Engineering", "Dev-ops Engineer"]

export function HeroSection() {
  return (
    <section className="relative -mt-20 overflow-hidden pt-20 lg:-mt-[98px] lg:pt-[98px]">
      {/* Hero backdrop: globe + glow + edge fades */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-120px] left-1/2 h-[720px] w-[1100px] max-w-none -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.28),rgba(92,83,254,0)_70%)] blur-2xl" />
        <Image
          src="/Images/globe.png"
          alt=""
          width={1440}
          height={1882}
          priority
          className="absolute top-0 left-1/2 w-[980px] max-w-none -translate-x-1/2 opacity-95 select-none sm:w-[1200px] lg:w-[1440px]"
        />
        <div className="absolute inset-x-0 bottom-0 h-[440px] bg-gradient-to-t from-[#010103] via-[#010103]/85 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#010103] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#010103] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-[60px] lg:pb-[72px]">
        <div className="mx-auto flex w-full max-w-[784px] flex-col items-center gap-8 pt-[88px] sm:gap-10 sm:pt-[140px] lg:gap-12 lg:pt-[176px]">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <div className="flex w-full max-w-[549px] items-center">
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-r from-transparent to-white/30"
              />
              <div className="mx-1 flex shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 backdrop-blur-sm sm:gap-4 sm:px-6">
                <Sparkles className="size-5 text-brand-soft" strokeWidth={1.75} />
                <span className="font-space-mono text-sm whitespace-nowrap text-white sm:text-lg lg:text-xl">
                  50,000+ new jobs this month
                </span>
              </div>
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-l from-transparent to-white/30"
              />
            </div>

            <div className="flex flex-col items-center gap-4">
              <h1 className="text-center font-manrope text-[40px] leading-[1.1] font-bold tracking-[-0.02em] text-white sm:text-5xl lg:text-[56px] lg:leading-[64px]">
                Find Your Dream Job Today
              </h1>
              <p className="max-w-[640px] text-center font-manrope text-base leading-relaxed text-white/70 sm:text-lg lg:max-w-[784px] lg:text-xl">
                HireLoop connects top talent with world-class companies. Browse
                thousands of curated opportunities and land your next role —
                faster.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-6">
            <form
              action="/jobs"
              className="flex w-full flex-col gap-2 rounded-2xl border border-white/20 bg-[#101010] p-2 sm:flex-row sm:items-center sm:gap-1"
            >
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:h-12">
                <Search
                  className="size-5 shrink-0 text-white/60"
                  strokeWidth={1.75}
                />
                <span className="sr-only">Job title, skill or company</span>
                <input
                  type="search"
                  name="q"
                  placeholder="Job title, skill or company"
                  className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/60"
                />
              </label>

              <span
                aria-hidden
                className="mx-2 hidden h-6 w-px shrink-0 bg-white/20 sm:block"
              />

              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 sm:h-12">
                <MapPin
                  className="size-5 shrink-0 text-white/60"
                  strokeWidth={1.75}
                />
                <span className="sr-only">Location or Remote</span>
                <input
                  type="text"
                  name="location"
                  placeholder="Location or Remote"
                  className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/60"
                />
              </label>

              <Button
                type="submit"
                aria-label="Search jobs"
                className="h-12 w-full shrink-0 rounded-xl bg-brand px-4 text-white hover:bg-brand-soft sm:w-12 sm:px-0"
              >
                <Search className="size-5" strokeWidth={2} />
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <span className="font-manrope text-sm text-white/80 sm:text-base">
                Trending Positions
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {trending.map((term) => (
                  <Link
                    key={term}
                    href={`/jobs?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-white/10 bg-[#1a1a1b] px-3 py-1.5 text-xs text-white/90 transition-colors outline-none hover:border-brand/60 hover:bg-brand/15 hover:text-white focus-visible:ring-2 focus-visible:ring-brand-soft/60 sm:text-sm"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[180px] sm:mt-[240px] lg:mt-[358px]">
          <p className="mx-auto max-w-[600px] text-center font-instrument text-2xl leading-[1.3] font-medium text-white/70 sm:max-w-[720px] sm:text-[32px] lg:max-w-[760px] lg:text-[40px]">
            Assisting over 15,000 job seekers find their dream positions.
          </p>

          <div className="mx-auto mt-10 grid max-w-[1320px] grid-cols-2 gap-4 sm:mt-12 lg:grid-cols-4 lg:gap-6">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col gap-8 rounded-2xl border border-white/10 bg-gradient-to-t from-[#010102] to-[#313131] p-5 sm:p-6 lg:h-[254px] lg:gap-[72px]"
              >
                <Icon className="size-6 text-white" strokeWidth={1.5} />
                <div className="flex flex-col gap-2 lg:gap-4">
                  <span className="font-jakarta text-4xl leading-none font-semibold text-white sm:text-[44px] lg:text-[56px] lg:leading-[64px]">
                    {value}
                  </span>
                  <span className="font-manrope text-sm text-white/90 sm:text-base lg:text-lg lg:leading-[30px]">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

type AuthShellProps = {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-[calc(100svh-6rem)] items-center justify-center overflow-hidden bg-[#010103] px-4 py-12 text-white sm:px-6 lg:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-160px] left-1/2 h-[540px] w-[820px] max-w-none -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.22),rgba(92,83,254,0)_70%)] blur-2xl" />
        <div className="absolute bottom-[-220px] left-[12%] size-[420px] rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-[8%] bottom-[-180px] size-[360px] rounded-full bg-brand-soft/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <section className="rounded-3xl border border-white/10 bg-[#101010]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8">
          <div className="mb-7 flex flex-col gap-2">
            <h1 className="font-manrope text-2xl font-bold tracking-[-0.01em] text-white sm:text-[28px]">
              {title}
            </h1>
            <p className="font-manrope text-sm leading-relaxed text-white/60">
              {description}
            </p>
          </div>

          {children}

          <p className="mt-7 text-center font-manrope text-sm text-white/55">
            {footer}
          </p>
        </section>
      </div>
    </main>
  )
}

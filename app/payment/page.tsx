import Link from "next/link"
import { ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react"

import { panelClass } from "@/app/components/styles"
import { FREE_APPLICATION_LIMIT } from "@/lib/actions/applications"
import { cn } from "@/lib/utils"
import { PayButton } from "./pay-button"

/** Placeholder plan info — update when the real pricing is ready. */
const PLAN = {
  name: "Pro Plan",
  description: "Unlimited job applications on HireLoop",
  price: 9.99,
  currency: "USD",
}

const INCLUDED = [
  "Unlimited job applications",
  "Priority application review",
  "Cancel anytime",
]

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: PLAN.currency,
  }).format(value)

const PaymentPage = () => {
  const price = formatPrice(PLAN.price)

  return (
    <main className="min-h-svh bg-[#08080a] px-4 py-10 font-inter text-[#ededef] sm:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#a0a0ab] transition-colors hover:text-[#ededef]"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to jobs
        </Link>

        <header className="mt-6">
          <h1 className="text-[28px] leading-tight font-semibold tracking-[-1.5px] text-[#ededef] sm:text-[34px]">
            Complete your payment
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-7 text-[#a0a0ab]">
            You have used all {FREE_APPLICATION_LIMIT} free applications.
            Upgrade to keep applying for new roles.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Payment info */}
          <section className={cn(panelClass, "p-6 sm:p-8")}>
            <h2 className="text-[22px] leading-7 font-semibold tracking-[-1.2px] text-[#ededef]">
              Payment details
            </h2>

            <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#1a1a1f] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-soft">
                    <Sparkles aria-hidden className="size-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-[#ededef]">
                      {PLAN.name}
                    </p>
                    <p className="mt-1 text-sm text-[#a0a0ab]">
                      {PLAN.description}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-base font-semibold text-[#ededef]">
                  {price}
                </p>
              </div>

              <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/[0.07] pt-5">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#a0a0ab]"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/10 text-[#22c55e]">
                      <Check aria-hidden className="size-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#141418] px-5 py-4 text-sm">
              <span className="text-[#a0a0ab]">Free applications used</span>
              <span className="font-medium text-[#ededef]">
                {FREE_APPLICATION_LIMIT} / {FREE_APPLICATION_LIMIT}
              </span>
            </div>

            <p className="mt-6 flex items-center gap-2 text-[13px] text-[#6e6e78]">
              <ShieldCheck aria-hidden className="size-4" />
              Payments are encrypted and processed securely.
            </p>
          </section>

          {/* Order summary */}
          <aside className={cn(panelClass, "h-fit p-6 sm:p-8")}>
            <h2 className="text-[22px] leading-7 font-semibold tracking-[-1.2px] text-[#ededef]">
              Order summary
            </h2>

            <dl className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#a0a0ab]">{PLAN.name}</dt>
                <dd className="font-medium text-[#ededef]">{price}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#a0a0ab]">Tax</dt>
                <dd className="font-medium text-[#ededef]">Calculated later</dd>
              </div>

              <div className="mt-2 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
                <dt className="text-base font-semibold text-[#ededef]">
                  Total
                </dt>
                <dd className="text-base font-semibold text-[#ededef]">
                  {price}
                </dd>
              </div>
            </dl>

            <PayButton amount={price} />

            <p className="mt-4 text-center text-[13px] text-[#6e6e78]">
              Secure checkout powered by Stripe
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage

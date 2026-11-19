"use client"

import { useState } from "react"
import { Lock } from "lucide-react"

/** Pay button. Stripe Checkout will be connected here later. */
export function PayButton({ amount }: { amount: string }) {
  const [message, setMessage] = useState("")

  const handlePay = () => {
    // TODO: create a Stripe Checkout session and redirect the user to it.
    // const res = await fetch("/api/checkout", { method: "POST" })
    // const { url } = await res.json()
    // window.location.href = url
    setMessage("Stripe checkout is not connected yet.")
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handlePay}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-base font-semibold text-white transition-colors hover:bg-brand-soft"
      >
        <Lock aria-hidden className="size-4" />
        Pay {amount}
      </button>

      {message ? (
        <p className="mt-3 text-center text-[13px] text-[#a0a0ab]">{message}</p>
      ) : null}
    </div>
  )
}

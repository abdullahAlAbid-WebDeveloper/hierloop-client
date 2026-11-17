const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const applyToAJob = async (data: Record<string, unknown>) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    return res
      .json()
      .catch(() => ({ error: "Could not submit the application." }))
  }

  return res.json()
}

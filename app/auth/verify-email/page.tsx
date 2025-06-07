'use client'
export const dynamic = "force-dynamic";

import { Suspense } from 'react'
import VerifyEmailPage from './VerifyEmailPageImpl'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  )
} 
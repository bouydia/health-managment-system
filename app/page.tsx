"use client"
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { PasskeyModal } from '@/components/PasskeyModal'
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog'
import PatientForm from '@/components/forms/PatientForm'

export default function Home({searchParams}:SearchParamProps) {
    const isAdmin = searchParams.admin === 'true'

  return (
    <>
      {isAdmin && <PasskeyModal />}
      <div className="flex flex-row h-screen w-full remove-scrollbar  ">
        <div className="flex-1  flex flex-col justify-items-start justify-between  py-5 px-12">
          <div>
            <Image
              src="/assets/icons/logo-full.svg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit"
            />
          </div>
          <div className="max-w-[496px]">
            ''
            <h1 className="header font-bold mb-2">Hi there,...</h1>
            <p className="font-medium text-dark-700 mb-4">
              Get Started with Appointments.
            </p>
            <PatientForm />
          </div>
          <div className="flex justify-between">
            <p className="justify-items-end text-dark-600 font-normal	xl:text-left">
              @carepulse copyright
            </p>
            <Link href="/?admin=true" className="text-green-500 underline">
              Admin
            </Link>
          </div>
        </div>
        <div className="lg:flex-1 relative">
          <Image
            src="/assets/images/onboarding-img.png"
            alt="onboarding-img"
            layout="fill"
            objectFit="cover"
            className="w-full h-full rounded-l-lg side-img"
          />
        </div>
      </div>
    </>
  )
}

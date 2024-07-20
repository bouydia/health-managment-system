'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import { UserFormValidation } from '@/lib/validation'

import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.action'

export enum FormFieldType {
  INPUT = 'input',
  CECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON='skeleton'
}

    

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
 
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  // 2. Define a submit handler.
 async function onSubmit({name,email,phone}: z.infer<typeof UserFormValidation>) {
   setIsLoading(true)
   
    try {
      const userData = { name, email, phone }
      console.log(userData);
     
      const user = await createUser(userData)
      console.log(user);
    
      if (user) router.push(`/patients/${user?.$id}/register`)
   } catch (error) {
      console.log(error);
   }
     setIsLoading(false)

  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          palceholder="John Deo"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          palceholder="JohnDeo@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone Number"
          palceholder="(+212) 61212 1212" 
        />

        <SubmitButton isLoading={isLoading} >Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm

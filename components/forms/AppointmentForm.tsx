'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { datetimeRegex, z } from 'zod'

import { CreateAppointmentSchema, getAppointmentSchema } from '@/lib/validation'
import CustomFormField from '../CustomFormField'
import { Form } from '../ui/form'
import { FormFieldType } from './PatientForm'
import SubmitButton from '../SubmitButton'
import { Doctors } from '@/constant'
import { SelectItem } from '../ui/select'
import { scheduler } from 'timers/promises'
import { createAppointment, updateAppointment } from '@/lib/actions/appointment.action'
import { useRouter } from 'next/navigation'
import { Appointment } from '@/types/appwrite.types'

type AppointmentFormProps = {
  userId: string
  patientId: string
  type: 'create' | 'cancel' | 'schedule',
  appointment?: Appointment
  setOpen:(open:boolean)=>void
}
const AppointmentForm = ({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: AppointmentFormProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // 1. Define your form.
  const AppointmentFormValidation = getAppointmentSchema(type)

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : '',
      schedule: appointment ? new Date(appointment?.schedule) : new Date(Date.now()),
      reason: appointment ? appointment?.reason : '',
      note: appointment ? appointment?.note : '',
      cancellationReason: appointment?.cancellationReason ||  ''
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true)
    let status
    switch (type) {
      case 'schedule':
        status = 'scheduled'
        break
      case 'cancel':
        status = 'cancelled'
        break
      default:
        status = 'pending'
        break
    }
    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        }
        const appointment = await createAppointment(appointmentData)
        if (appointment) {
          form.reset()
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id} `
          )
        }
      } else {
        const appointmentToUpdate = {
          userId,
            appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason:values?.cancellationReason
          },
          type
        }
        const updatedAppointment=await updateAppointment(appointmentToUpdate)
        if (updatedAppointment) {
          setOpen && setOpen(false)
          form.reset()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  let buttonLabel
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment'
      break
    case 'create':
      buttonLabel = 'Create Appointment'
      break
    case 'schedule':
      buttonLabel = 'Schedule Appointment'
      break
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        {type === 'create' && (
          <section className="mb-12 space-y-4">
            <h1 className="header">New appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 second
            </p>
          </section>
        )}
        {type !== 'cancel' && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              palceholder="John Deo"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
            >
              {Doctors.map(doctor => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt="doctor_img"
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment "
                palceholder="ex: Annual montly check-up"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional notes"
                palceholder="ex: Prefer afternoon appointments, if possible"
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy  -  h:mm aa"
            />
          </>
        )}
        {type === 'cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            palceholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          }`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm

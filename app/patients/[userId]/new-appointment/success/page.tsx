import { Button } from "@/components/ui/button"
import { Doctors } from "@/constant"
import { getAppointment } from "@/lib/actions/appointment.action"
import { formatDateTime } from "@/lib/utils"
import { Appointment } from "@/types/appwrite.types"
import Image from "next/image"
import Link from "next/link"

const RequestSuccess = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  
  const appointmentId = (searchParams?.appointmentId as string) || ''
  const appointment = await getAppointment(appointmentId)
   const doctor = Doctors.find(
     doctor => doctor.name === appointment.primaryPhysician
   )
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            className="h-10 w-fit"
            alt="success_img"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p>We will be in thouch shortly to confirm</p>
        </section>
        <section className="request-details">
          <p>Requested appointment detials</p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              width={100}
              height={100}
              className="size-6"
              alt="doctor"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendar"
            />
            <p>{formatDateTime(appointment?.schedule).dateTime}</p>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-bn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New appointment
          </Link>
        </Button>
        <p className="copyright ">© 2024 CarePluse</p>
      </div>
    </div>
  )
}

export default RequestSuccess
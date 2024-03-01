
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Patients talks to serenity',
    description:
      'Serenity AI talks to patient in the initial conversations and saves your time.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Connect With your patients',
    description:
      'The point where AI stops, you connect with your patient and handle them.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Patient Report and Analytics',
    description:
      'Serenity records the patient details cause of problem and summarizes for you.',
    icon: LockClosedIcon,
  },
  {
    name: 'Daily tracking and Updates',
    description:
      'It enables you to track your patients on daily basis and take actions accordingly.',
    icon: ArrowPathIcon,
  },
  
]

export default function Howitworks() {
  return (
    <div className="bg-white py-24 sm:py-32" id='HowitWorks'>
        <div class="flex justify-center">
  <div class="bg-white rounded-lg overflow-hidden shadow-lg">
    <iframe width="790" height="395" src="https://www.youtube.com/embed/5T8ZejODr3g?si=gg8Whtr4WLFUd0EY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  </div>
</div>
<br />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
        
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How it Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
          Designed for individuals with social anxiety, hearing or speech
        impairments, and anyone seeking confidential care.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

/**
  <div class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-gray-600"> Serenity AI talks to patient in the initial conversations and saves your time</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl"> Patient talks to Serenity</dd>
      </div>
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-gray-600">Serenity records the patient details cause of problem and summarizes for you</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Patient Report and Analytics</dd>
      </div>
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-gray-600">It enables you to track your patients on daily basis and take actions accordingly</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Daily tracking and Updates</dd>
      </div>
    </dl>
  </div>
</div>
 */
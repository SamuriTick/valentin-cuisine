import { Container } from "@/components/Container";
import Image from "next/image";
import Link from "next/link";

interface Schedule {
  id: number;
  dayOfWeek?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  description?: string | null;
}

interface ProgramDetailProps {
  program: {
    id: number;
    title: string;
    description?: string | null;
    category: string;
    ageGroup?: string | null;
    price?: string | null;
    instructor?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactWebsite?: string | null;
    imageUrl?: string | null;
    schedules?: Schedule[];
  };
  heroImage: string;
}

// Category colors for visual organization
const categoryColors = {
  "early-years": "bg-pink-600 text-white",
  "martial-arts": "bg-red-600 text-white",
  "education": "bg-blue-600 text-white",
  "fitness": "bg-green-600 text-white",
  "cultural": "bg-purple-600 text-white",
  "default": "bg-primary-600 text-white"
};

const categoryNames = {
  "early-years": "Early Years",
  "martial-arts": "Martial Arts",
  "education": "Education",
  "fitness": "Fitness",
  "cultural": "Cultural",
  "default": "Programme"
};

function getCategoryColor(category: string) {
  return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
}

function getCategoryName(category: string) {
  return categoryNames[category as keyof typeof categoryNames] || category;
}

function formatTime(time: string | null) {
  if (!time) return "";
  try {
    const [h, m = "00"] = time.split(":");
    if (!h) return time;
    const hr = Number.parseInt(h, 10);
    if (Number.isNaN(hr)) return time;
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHour = hr % 12 === 0 ? 12 : hr % 12;
    return `${displayHour}:${m} ${ampm}`;
  } catch {
    return time;
  }
}

export const ProgramDetail = ({ program, heroImage }: ProgramDetailProps) => {
  return (
    <Container className="min-h-[80vh] lg:h-[80vh] lg:overflow-hidden py-3">
      <div className="h-full flex flex-col">
        {/* Back to programs link - compact */}
        <Link
          href="/programs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-2 transition-colors text-sm"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all programmes
        </Link>


        {/* Two-column layout - fills remaining height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 lg:min-h-0">
            {/* Left column - Fixed image */}
            <div className="lg:col-span-5 flex items-start">
              {heroImage && (
                <div className="w-full max-w-[400px] lg:max-w-[550px]">
                  <Image
                    src={heroImage}
                    width={600}
                    height={450}
                    alt={program.title}
                    className="w-full h-auto rounded-lg ring-1 ring-gray-200 shadow-sm bg-white object-contain"
                    style={{ maxHeight: '550px' }}
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Right column - Details */}
            <div className="lg:col-span-7 overflow-y-auto lg:overflow-y-auto">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {/* Title and subtitle */}
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{program.title}</h1>
                  <p className="text-sm text-gray-600">
                    {getCategoryName(program.category)} Programme
                    {program.instructor && ` • Instructor: ${program.instructor}`}
                  </p>
                </div>

                {/* Category and info badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(program.category)}`}>
                    {getCategoryName(program.category)}
                  </span>
                  {program.ageGroup && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {program.ageGroup}
                    </span>
                  )}
                  {program.price && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {program.price}
                    </span>
                  )}
                </div>

                {program.description && (
                  <section className="mb-4">
                    <h2 className="text-base font-semibold mb-2">About this Programme</h2>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{program.description}</p>
                  </section>
                )}

                {program.instructor && (
                  <section className="mb-4">
                    <h3 className="text-base font-semibold mb-1">Instructor</h3>
                    <p className="text-sm text-gray-700">{program.instructor}</p>
                  </section>
                )}

                {program.schedules && program.schedules.length > 0 && (
                  <section className="mb-4">
                    <h3 className="text-base font-semibold mb-2">Schedule</h3>
                    <ul className="space-y-2">
                      {program.schedules.map((schedule) => (
                        <li key={schedule.id} className="rounded bg-gray-50 p-2">
                          {schedule.dayOfWeek && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-sm text-gray-900">{schedule.dayOfWeek}</span>
                              {(schedule.startTime || schedule.endTime) && (
                                <span className="text-sm text-gray-700">
                                  {schedule.startTime ? formatTime(schedule.startTime) : ""}
                                  {schedule.endTime ? ` – ${formatTime(schedule.endTime)}` : ""}
                                </span>
                              )}
                            </div>
                          )}
                          {schedule.description && (
                            <p className="text-gray-600 mt-1 text-xs">{schedule.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Contact Information */}
                {(program.contactEmail || program.contactPhone || program.contactWebsite) && (
                  <section className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h3 className="text-base font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-1 text-sm">
                      {program.contactEmail && (
                        <div>
                          <span className="font-medium text-gray-700">Email: </span>
                          <a
                            href={`mailto:${program.contactEmail}`}
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {program.contactEmail}
                          </a>
                        </div>
                      )}
                      {program.contactPhone && (
                        <div>
                          <span className="font-medium text-gray-700">Phone: </span>
                          <a
                            href={`tel:${program.contactPhone}`}
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {program.contactPhone}
                          </a>
                        </div>
                      )}
                      {program.contactWebsite && (
                        <div>
                          <span className="font-medium text-gray-700">Website: </span>
                          <a
                            href={program.contactWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* CTA */}
                <div className="mt-4 pt-4 border-t">
                  <a
                    href="/contact"
                    className="uppercase inline-flex w-full sm:w-auto items-center justify-center rounded bg-primary-600 px-4 py-2 text-sm text-white font-semibold tracking-wide hover:bg-primary-700 transition-all shadow-md"
                  >
                    Register Interest
                  </a>
                </div>
              </div>
            </div>
        </div>
      </div>
    </Container>
  );
};
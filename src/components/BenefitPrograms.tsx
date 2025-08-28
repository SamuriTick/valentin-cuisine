import OptimizedImage from "@/components/OptimizedImage";
import React from "react";
import { Container } from "@/components/Container";
import { processProgramImage } from "@/lib/image-fallback";
import Link from "next/link";

interface ProgramCard {
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
  schedules?: Array<{
    description?: string | null;
    dayOfWeek?: string | null;
    startTime?: string | null;
    endTime?: string | null;
  }>;
}

interface BenefitProgramsProps {
  title: string;
  description: string;
  contact: string;
  sectionHeading: string;
  programs: ProgramCard[];
  viewAllHref?: string;
}

// Category colors for visual organization
const categoryColors = {
  "early-years": "bg-pink-600",
  "martial-arts": "bg-red-600",
  "education": "bg-blue-600",
  "fitness": "bg-green-600",
  "cultural": "bg-purple-600",
  "default": "bg-primary-600"
};

const categoryNames = {
  "early-years": "Early Years",
  "martial-arts": "Martial Arts",
  "education": "Education",
  "fitness": "Fitness",
  "cultural": "Cultural",
  "default": "Programme"
};

export const BenefitPrograms = (props: Readonly<BenefitProgramsProps>) => {
  const { title, description, contact, sectionHeading, programs, viewAllHref = "#" } = props;

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  };

  const getCategoryName = (category: string) => {
    return categoryNames[category as keyof typeof categoryNames] || category;
  };

  const formatSchedule = (schedules: ProgramCard['schedules']) => {
    if (!schedules || schedules.length === 0) return "Contact for schedule";
    
    const firstSchedule = schedules[0];
    if (firstSchedule?.dayOfWeek && firstSchedule?.startTime) {
      return `${firstSchedule.dayOfWeek}s ${firstSchedule.startTime}${firstSchedule.endTime ? ` - ${firstSchedule.endTime}` : ''}`;
    }
    
    return firstSchedule?.description || "Contact for schedule";
  };

  return (
    <section className="min-h-screen flex items-center py-8 lg:py-16 bg-white">
      <Container className="w-full">
        {/* Centered content column */}
        <div className="max-w-6xl mx-auto">
          {/* Large, centered page title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-4 lg:mb-8">
            {title}
          </h1>

          {/* Multi-paragraph text block, left-aligned */}
          <div className="prose prose-sm lg:prose-lg max-w-none mb-3 lg:mb-6">
            <p className="text-gray-700 leading-relaxed text-left text-sm lg:text-base">
              {description}
            </p>
          </div>

          {/* Contact line, left-aligned */}
          <p className="text-gray-600 text-left mb-4 lg:mb-8 text-xs lg:text-sm">
            {contact}
          </p>

          {/* Big, centered section heading as divider */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-6 lg:mb-8">
            {sectionHeading}
          </h2>

          {/* Dynamic column card grid - adjusts based on number of programs */}
          <div className={`grid gap-4 lg:gap-6 mb-6 lg:mb-8 ${
            programs.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
            programs.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            programs.length <= 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden h-fit">
                {/* Title bar on top with category color */}
                <div className={`${getCategoryColor(program.category)} text-white py-2 lg:py-3 px-3 lg:px-4`}>
                  <h3 className="text-sm lg:text-base font-semibold text-center">
                    {program.title}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs opacity-90">
                      {getCategoryName(program.category)}
                    </span>
                    {program.ageGroup && (
                      <span className="text-xs opacity-90">
                        {program.ageGroup}
                      </span>
                    )}
                  </div>
                </div>

                {/* Compact horizontal image area with overlaid info button */}
                <div className="relative h-32 lg:h-40 bg-gray-200">
                  <OptimizedImage
                    src={program.imageUrl || processProgramImage(null, program.title) || "/img/poster-stayandplay.jpeg"}
                    fill
                    alt={program.title}
                    className="object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                  
                  {/* Small "Info" button overlaid on image */}
                  <Link 
                    href={`/programs/${program.id}`}
                    className={`absolute bottom-2 right-2 ${getCategoryColor(program.category)} hover:opacity-90 text-white px-2 lg:px-3 py-1 lg:py-2 rounded-md text-xs lg:text-sm font-medium transition-opacity shadow-lg uppercase inline-block`}
                  >
                    Info
                  </Link>

                  {/* Price tag if available */}
                  {program.price && (
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1">
                      <span className="text-xs font-semibold text-gray-800">
                        {program.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Compact program details */}
                <div className="p-2 lg:p-3 space-y-2">
                  {/* Description */}
                  {program.description && (
                    <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">
                      {program.description}
                    </p>
                  )}

                  {/* Schedule */}
                  <div className="text-xs lg:text-sm">
                    <span className="font-medium text-gray-700">Schedule: </span>
                    <span className="text-gray-600">{formatSchedule(program.schedules)}</span>
                  </div>

                  {/* Instructor */}
                  {program.instructor && (
                    <div className="text-xs lg:text-sm">
                      <span className="font-medium text-gray-700">Instructor: </span>
                      <span className="text-gray-600">{program.instructor}</span>
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="pt-1 border-t border-gray-100">
                    {program.contactEmail && (
                      <div className="text-xs">
                        <a 
                          href={`mailto:${program.contactEmail}`}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {program.contactEmail}
                        </a>
                      </div>
                    )}
                    {program.contactPhone && (
                      <div className="text-xs">
                        <a 
                          href={`tel:${program.contactPhone}`}
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {program.contactPhone}
                        </a>
                      </div>
                    )}
                    {program.contactWebsite && (
                      <div className="text-xs">
                        <a 
                          href={program.contactWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All button */}
          {viewAllHref && programs.length > 0 && (
            <div className="text-center">
              <a
                href={viewAllHref}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 lg:py-4 lg:px-8 rounded-lg text-sm lg:text-base uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View All Programmes
              </a>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
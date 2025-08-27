import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { BenefitFacilities } from "@/components/BenefitFacilities";
import { BenefitLocation } from "@/components/BenefitLocation";
import { Testimonials } from "@/components/Testimonials";
import Faq from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { SplitBanner } from "@/components/SplitBanner";
import AboutUs from "@/components/AboutUs";
import GoogleMap from "@/components/GoogleMap";
import ProgramSchedule from "@/components/ProgramSchedule";
import { getSettings } from "@/lib/settings";
import { getFeaturedPrograms, getActiveFacilities, getActivePrograms } from "@/lib/actions";
import { processFacilityImage } from "@/lib/image-fallback";
import { generateLocalBusinessStructuredData, generateOrganizationStructuredData } from "@/lib/seo";

export const dynamic = 'force-dynamic';

// Static fallback if no dynamic facilities are available
const fallbackBenefitOne = {
  title: "Modern Facilities for Every Occasion",
  desc: "Our centre offers versatile spaces perfect for community events, fitness classes, children's parties, and group meetings.",
  image: "/img/80-chairs.jpeg",
  bullets: [
    {
      title: "Main Hall (120 capacity)",
      desc: "9.81m × 12.64m space perfect for large events, exercise classes, and community gatherings",
      icon: "■",
    },
    {
      title: "Small Hall (15 capacity)", 
      desc: "4.26m × 6.20m intimate space ideal for small group classes and meetings",
      icon: "▪",
    },
    {
      title: "Kitchen Facilities",
      desc: "Equipped with sink, power outlets, and seating area for catering needs",
      icon: "●",
    },
  ],
};



export default async function Home() {
  const settings = await getSettings();
  
  // Fetch data using server actions
  const featuredPrograms = await getFeaturedPrograms()
  const facilities = await getActiveFacilities(3)
  const activePrograms = await getActivePrograms(1)

  // Create dynamic split banner data
  const splitBannerData = [
    // Programs section
    {
      id: "programs",
      title: "REGULAR PROGRAMMES",
      subtitle: "Weekly activities for all ages and interests",
      description: activePrograms.length > 0 
        ? `Join our vibrant community with programmes including ${activePrograms[0]?.title || 'various activities'}${activePrograms[0]?.ageGroup ? ` for ${activePrograms[0].ageGroup}` : ''}. From fitness classes to educational sessions, there's something for everyone.`
        : "From Stay & Play sessions and fitness classes to martial arts and educational programmes for all ages and interests",
      image: settings.banner_programs_image || "/img/all-programs.jpeg",
      buttonText: "VIEW PROGRAMMES",
      buttonLink: "/programs",
      features: activePrograms.length > 0 ? `${featuredPrograms.length}+ programmes available` : "15+ weekly programmes",
    },
    // Facilities section  
    {
      id: "facilities",
      title: "ROOM HIRE",
      subtitle: "Flexible spaces for your events",
      description: facilities.length > 0
        ? `Our ${facilities.length} professionally managed spaces offer flexible solutions for events, meetings, and community gatherings. ${facilities[0]?.name || 'Main facilities'} available at competitive rates.`
        : "Sustainable facilities with LED lighting and energy-efficient systems, perfect for events, parties, meetings, and community gatherings",
      image: processFacilityImage(facilities.find(f => f.imageUrl)?.imageUrl || null, facilities[0]?.name) || "/img/80-chairs.jpeg",
      buttonText: "BOOK NOW",
      buttonLink: "/facilities",
      features: "Competitive rates available",
    },
  ];

  // Get main hall capacity from facilities data
  const mainHall = facilities.find(f => 
    f.name.toLowerCase().includes('main hall') || 
    f.name.toLowerCase().includes('main') ||
    f.name.toLowerCase().includes('hall')
  )
  const mainHallCapacity = mainHall?.capacity ? mainHall.capacity.toString() : '120'

  // Community stats data using settings and facilities data
  const communityStats = [
    {
      title: settings.residents_served,
      desc: "Residents served in West Acton community",
    },
    {
      title: settings.weekly_programs,
      desc: "Regular groups and programmes per week",
    },
    {
      title: mainHallCapacity,
      desc: "Maximum capacity in our Main Hall",
    },
    {
      title: settings.opening_hours_text,
      desc: settings.opening_hours_details,
    },
  ];

  // Additional stats for extended content
  const extendedStats = [
    {
      title: "35+",
      desc: "Years serving the community",
    },
    {
      title: "1990",
      desc: "Year we started serving the community",
    },
    {
      title: "35+",
      desc: "Years of community service",
    },
    {
      title: "100%",
      desc: "Volunteer-run community organisation",
    },
  ];

  // Format programmes for ProgramSchedule component
  const programScheduleSections = featuredPrograms.length > 0 ? [
    {
      title: "Featured Programmes",
      items: featuredPrograms.slice(0, 6).map((program: any) => ({
        name: program.title,
        subtitle: program.instructor ? `with ${program.instructor}` : undefined,
        description: program.description || undefined,
        schedule: program.schedules.length > 0 
          ? program.schedules.map((s: any) => s.description).filter((desc: any) => desc !== null && desc !== undefined)
          : ["Schedule available upon inquiry"],
        price: program.price || undefined,
        contact: {
          email: program.contactEmail || undefined,
          phone: program.contactPhone || undefined,
          website: program.contactWebsite || undefined
        },
        ageGroup: program.ageGroup || undefined,
        instructor: program.instructor || undefined
      }))
    }
  ] : [];


  // Generate structured data
  const localBusinessData = generateLocalBusinessStructuredData({
    name: settings.site_title,
    description: settings.site_description,
    address: {
      streetAddress: settings.address.split(',')[0] || 'Churchill Gardens',
      addressLocality: 'West Acton',
      addressRegion: 'London',
      postalCode: 'W3 0PG',
      addressCountry: 'GB',
    },
    telephone: settings.contact_phone,
    email: settings.contact_email,
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://westactoncc.org.uk',
    openingHours: ['Mo-Su 07:00-23:00'],
    priceRange: '£-££',
    amenityFeature: [
      'WiFi',
      'Private Parking',
      'Wheelchair Access',
      'Kitchen Facilities',
      'Audio/Visual Equipment',
      'Sound System',
      'LED Lighting'
    ],
    image: [
      processFacilityImage(facilities.find(f => f.imageUrl)?.imageUrl || null, facilities[0]?.name) || '/img/entrance.jpeg'
    ]
  });

  const organizationData = generateOrganizationStructuredData(settings);

  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />

      {/* Hero + Split Banner */}
      <Hero 
        settings={settings} 
        backgroundImage={processFacilityImage(facilities.find(f => f.imageUrl)?.imageUrl || null, facilities[0]?.name) || undefined}
        mainHallCapacity={mainHallCapacity}
      />
      <SplitBanner sections={splitBannerData} />
      
      {/* Community Impact Stats */}
      <Container>
        <SectionTitle
          preTitle="Community Impact"
          title="Serving West Acton Together"
        >
          {settings.site_title} is dedicated to improving wellbeing through education, 
          leisure, and recreational programmes. We work closely with local businesses and community members 
          to create a vibrant, supportive community.
        </SectionTitle>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mt-8 sm:mt-16">
          {communityStats.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-heading font-bold text-primary-600 mb-1 sm:mb-2">
                {item.title}
              </p>
              <p className="text-sm sm:text-base text-gray-800 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* About Us Section */}
      <AboutUs />

      {/* Facilities Benefits */}
      <BenefitFacilities
        title="Modern Facilities for Every Occasion"
        description={`Discover our ${facilities.length > 0 ? facilities.length : 3} professionally managed spaces, offering flexible solutions for events, meetings, fitness classes, and community gatherings. Each facility is maintained to the highest standards with modern amenities.`}
        contact="For bookings and enquiries, please use our contact form"
        sectionHeading="Our Available Spaces"
        facilities={facilities.length > 0 ? facilities.map((facility: any) => ({
          id: facility.id,
          name: facility.name,
          subtitle: facility.subtitle,
          description: facility.description,
          capacity: facility.capacity,
          dimensions: facility.dimensions,
          hourlyRate: facility.hourlyRate,
          features: facility.features,
          imageUrl: processFacilityImage(facility.imageUrl, facility.name)
        })) : [
          {
            id: 1,
            name: "Main Hall",
            subtitle: "Large community space",
            description: "Perfect for events, classes, and gatherings",
            capacity: 120,
            dimensions: "9.81m × 12.64m",
            hourlyRate: 25,
            features: ["Sound system", "Lighting", "Kitchen access"],
            imageUrl: "/img/80-chairs.jpeg"
          },
          {
            id: 2,
            name: "Small Hall", 
            subtitle: "Intimate meeting space",
            description: "Ideal for small groups and workshops",
            capacity: 15,
            dimensions: "4.26m × 6.20m",
            hourlyRate: 15,
            features: ["Projector", "Tables", "Chairs"],
            imageUrl: "/img/entrance.jpeg"
          },
          {
            id: 3,
            name: "Kitchen",
            subtitle: "Catering facilities",
            description: "Fully equipped for event catering",
            capacity: 10,
            dimensions: "Modern layout",
            hourlyRate: 10,
            features: ["Sink", "Power outlets", "Seating area"],
            imageUrl: "/img/poster-stayandplay.jpeg"
          }
        ]}
        viewAllHref="/facilities"
      />
      
      <BenefitLocation
        title="Convenient Location & Access"
        description="Located in Churchill Gardens, West Acton, we're easily accessible by public transport and offer onsite parking. Our central location makes us the perfect hub for West London community activities."
        contact="Find us at Churchill Gardens, West Acton, London W3 0PG"
        sectionHeading="Getting Here"
        image="/img/entrance.jpeg"
        benefits={[
          {
            title: "West Acton Station",
            desc: "Just minutes from West Acton Underground station on the Central line, providing direct access to Central London",
            icon: "●"
          },
          {
            title: "Bus Routes",
            desc: "Served by bus 218 and other local routes for easy access from across London and surrounding areas",
            icon: "●"
          },
          {
            title: "Private On-site Parking",
            desc: "Free private parking available for visitors and event attendees, with disabled access spaces",
            icon: "●"
          }
        ]}
        buttons={[
          {
            label: "Get Directions",
            href: "https://maps.google.com/?q=Churchill+Gardens+West+Acton+London+W3+0PG",
            variant: "primary" as const
          },
          {
            label: "Contact Us",
            href: "/contact",
            variant: "secondary" as const
          }
        ]}
      />

      {/* Featured Programs Preview */}
      {programScheduleSections.length > 0 && (
        <Container className="py-8 sm:py-16">
          <ProgramSchedule
            title="Featured Programmes This Week"
            sections={programScheduleSections}
          />
          <div className="text-center mt-6 sm:mt-8">
            <a
              href="/programs"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Programmes
            </a>
          </div>
        </Container>
      )}

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}

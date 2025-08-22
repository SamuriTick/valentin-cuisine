import { getFacilities, getFacilityGallery } from "@/lib/actions";
import { TextOnlyHero } from "@/components/TextOnlyHero";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { GoogleMap } from "@/components/GoogleMap";
import BookingForm from "@/components/BookingForm";
import { processFacilityImage } from "@/lib/image-fallback";
import { generateSEOMetadata } from "@/lib/seo";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "Facilities & Room Hire",
    description: "Book our modern facilities for events, classes, and gatherings. Main Hall (120 capacity), Small Hall, and fully equipped Kitchen available for hire. Private parking included.",
    url: "/facilities",
    keywords: [
      "hall hire",
      "room rental",
      "venue hire",
      "West Acton facilities",
      "event space",
      "meeting rooms",
      "Main Hall hire",
      "Small Hall rental",
      "kitchen facilities",
      "party venue",
      "conference space",
      "community venue"
    ]
  });
}


// Booking information
const bookingInfo = [
  {
    title: "Online Booking",
    desc: "Use our website contact form to submit your booking request with preferred dates and requirements",
    icon: "💻",
  },
  {
    title: "Contact Form", 
    desc: "Use our website contact form for all booking enquiries and availability requests",
    icon: "📧",
  },
  {
    title: "Booking Enquiries",
    desc: "Submit detailed booking requests through our contact form for prompt response",
    icon: "📞",
  },
];

// Additional facilities
const additionalFacilities = [
  {
    title: "Kitchen Facilities",
    description: "Equipped kitchen with sink, power outlets for kettle, and small seating area for refreshments",
  },
  {
    title: "Private On-site Parking",
    description: "Private parking available for event attendees and regular users",
  },
  {
    title: "Accessibility",
    description: "Ground floor access with facilities suitable for all community members",
  },
  {
    title: "Children's Parties",
    description: "Perfect venue for birthday parties (under 12s only) with safe, supervised environment",
  },
];

// Facility images gallery
const facilityImages = [
  {
    src: "/img/kitchen.jpeg",
    alt: "Kitchen facilities with appliances and seating area",
    title: "Kitchen Facilities"
  },
  {
    src: "/img/entrance.jpeg", 
    alt: "Main entrance to West Acton Community Centre",
    title: "Main Entrance"
  },
  {
    src: "/img/grass-field.jpeg",
    alt: "Outdoor grass field area for activities",
    title: "Outdoor Field"
  },
  {
    src: "/img/playground-1.jpeg",
    alt: "Children's playground equipment",
    title: "Playground Area"
  },
  {
    src: "/img/private-carpark.jpeg",
    alt: "Private parking area for visitors",
    title: "Parking Facilities"
  },
  {
    src: "/img/layout.jpeg",
    alt: "Community centre layout and floor plan",
    title: "Centre Layout"
  }
];

export default async function Facilities() {
  // Fetch facilities and gallery using server actions
  const [facilities, galleryImages] = await Promise.all([
    getFacilities(),
    getFacilityGallery()
  ])


  // Process facilities for card display
  const displayFacilities = facilities.length > 0 ? facilities.map(facility => ({
    id: facility.id,
    name: facility.name,
    subtitle: facility.subtitle || `${facility.capacity || 'Various'} Person Capacity`,
    description: facility.description || "Professional space maintained to high standards.",
    capacity: facility.capacity,
    dimensions: facility.dimensions,
    hourlyRate: facility.hourlyRate,
    features: facility.features || [],
    imageUrl: processFacilityImage(facility.imageUrl, facility.name)
  })) : [
    {
      id: 'main-hall',
      name: "Main Hall",
      subtitle: "120 Person Capacity",
      description: "Spacious hall perfect for large events, parties, weddings, NHS courses, and community gatherings.",
      capacity: 120,
      dimensions: "9.81m × 12.64m",
      hourlyRate: null,
      features: ["Outside paved area access", "Kitchen facilities included", "10 large rectangular tables", "80 chairs included"],
      imageUrl: "/img/80-chairs.jpeg"
    },
    {
      id: 'small-hall',
      name: "Small Hall", 
      subtitle: "15 Person Capacity",
      description: "Intimate space ideal for small group classes, meetings, workshops, and community gatherings.",
      capacity: 15,
      dimensions: "4.26m × 6.20m",
      hourlyRate: null,
      features: ["Perfect for workshops", "Small group meetings", "Regular class sessions", "Comfortable environment"],
      imageUrl: "/img/manager-office.jpeg"
    }
  ];

  // Get hero image from first facility or use default
  const heroImage = displayFacilities.length > 0 ? (displayFacilities[0]?.imageUrl || "/img/80-chairs.jpeg") : "/img/80-chairs.jpeg";

  return (
    <div>
      <TextOnlyHero 
        title="Facilities & Room Hire"
        subtitle="Modern, versatile spaces in the heart of West Acton"
        backgroundImage={heroImage}
      />
      
      {/* Facilities & Booking Section - Two Columns */}
      <Container>
        <div className="py-16">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Facility Cards + Location + Everything You Need */}
            <div className="space-y-8">
              {/* First Two Facility Cards */}
              <div className="space-y-6">
                <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4 uppercase tracking-tight">
                  Our Facilities
                </h2>
                {displayFacilities.slice(0, 2).map((facility) => (
                  <div key={facility.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    {/* Image */}
                    <div className="h-48 bg-gray-100 relative">
                      <img
                        src={facility.imageUrl || "/img/80-chairs.jpeg"}
                        alt={`${facility.name} - Community Centre Facility`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex flex-col mb-3">
                        <h3 className="text-xl font-heading font-bold text-primary-600 mb-2">
                          {facility.name}
                        </h3>
                        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium self-start">
                          Available for Hire
                        </span>
                      </div>
                      
                      <p className="text-primary-600 font-medium text-sm mb-2">{facility.subtitle}</p>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{facility.description}</p>
                      
                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-xs font-medium text-gray-600">Capacity</span>
                          <p className="font-semibold text-gray-900 text-sm">{facility.capacity || 'Various'} people</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-600">Dimensions</span>
                          <p className="font-semibold text-gray-900 text-sm">{facility.dimensions || 'Contact for details'}</p>
                        </div>
                      </div>
                      
                      {/* Features */}
                      {facility.features && facility.features.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Features</h4>
                          <ul className="space-y-1 text-xs text-gray-600">
                            {facility.features.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="w-1 h-1 bg-primary-600 rounded-full mr-2 flex-shrink-0"></span>
                                <span className="leading-tight">{String(feature)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Everything You Need Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4 uppercase tracking-tight">
                  Everything You Need
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Our facilities include additional amenities to ensure your event runs smoothly 
                  and all attendees feel welcome.
                </p>

                <div className="space-y-4">
                  {additionalFacilities.map((facility, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {facility.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {facility.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Section */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4 uppercase tracking-tight">
                  Our Location
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Conveniently located in Churchill Gardens with excellent transport links and parking facilities.
                </p>
                
                <GoogleMap 
                  address="West Acton Community Centre, Churchill Gardens, Acton, London W3 0JN"
                  className="w-full h-64 rounded-lg shadow-md border border-gray-200 mb-4"
                />
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    📍 Churchill Gardens, Acton, London W3 0JN
                  </p>
                  <p className="text-xs text-gray-500">
                    2 min from West Acton Station
                  </p>
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Churchill%20Gardens%2C%20Acton%2C%20London%20W3%200JN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-primary-600 hover:text-primary-800 font-medium text-sm underline"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div>
              <div className="bg-primary-50 rounded-2xl p-6 h-fit sticky top-8">
                <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4 uppercase tracking-tight">
                  Book Your Event
                </h2>
                <p className="text-gray-700 mb-6">
                  Complete the form below and we'll get back to you with availability and pricing
                </p>
                
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Additional Facility Cards (if more than 2) */}
      {displayFacilities.length > 2 && (
        <Container>
          <SectionTitle
            preTitle="Additional Spaces"
            title="More Facilities"
          >
            Explore our additional spaces and amenities for your events.
          </SectionTitle>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 mt-16 space-y-8">
            {displayFacilities.slice(2).map((facility) => (
              <div key={facility.id} className="break-inside-avoid bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-8">
                {/* Image */}
                <div className="h-48 bg-gray-100 relative">
                  <img
                    src={facility.imageUrl || "/img/80-chairs.jpeg"}
                    alt={`${facility.name} - Community Centre Facility`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex flex-col mb-3">
                    <h3 className="text-xl font-heading font-bold text-primary-600 mb-2">
                      {facility.name}
                    </h3>
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium self-start">
                      Available for Hire
                    </span>
                  </div>
                  
                  <p className="text-primary-600 font-medium text-sm mb-2">{facility.subtitle}</p>
                  <p className="text-gray-700 text-sm mb-3 leading-relaxed">{facility.description}</p>
                  
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-xs font-medium text-gray-600">Capacity</span>
                      <p className="font-semibold text-gray-900 text-sm">{facility.capacity || 'Various'} people</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600">Dimensions</span>
                      <p className="font-semibold text-gray-900 text-sm">{facility.dimensions || 'Contact for details'}</p>
                    </div>
                  </div>
                  
                  {/* Features */}
                  {facility.features && facility.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Features</h4>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {facility.features.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-1 h-1 bg-primary-600 rounded-full mr-2 flex-shrink-0"></span>
                            <span className="leading-tight">{String(feature)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      )}

      {/* Photo Gallery */}
      <Container>
        <SectionTitle
          preTitle="Facility Photos"
          title="Take a Visual Tour"
        >
          Explore our facilities through photos showing the main hall, kitchen, 
          outdoor areas, and parking facilities.
        </SectionTitle>

        <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-3 mt-16">
          {galleryImages.length > 0 ? (
            galleryImages.map((image: any) => (
              <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100 relative">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || image.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            facilityImages.map((image, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100 relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {image.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>

      </Container>
    </div>
  );
}
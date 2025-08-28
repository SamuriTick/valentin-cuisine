import { notFound } from "next/navigation";
import { ProgramDetail } from "@/components/ProgramDetail";
import { prisma } from "@/lib/prisma";
import { generateSEOMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import { processProgramImage } from "@/lib/image-fallback";

export const dynamic = 'force-dynamic';

interface ProgramPageProps {
  params: Promise<{
    id: string;
  }>;
}


export async function generateMetadata({ params }: ProgramPageProps) {
  const resolvedParams = await params;
  
  try {
    const program = await prisma.program.findUnique({
      where: { 
        id: parseInt(resolvedParams.id),
        active: true 
      }
    });

    if (!program) {
      return generateSEOMetadata({
        title: "Program Not Found",
        description: "The requested program could not be found.",
        url: `/programs/${resolvedParams.id}`,
      });
    }

    return generateSEOMetadata({
      title: program.title,
      description: program.description || `Learn more about ${program.title} at WACC`,
      url: `/programs/${resolvedParams.id}`,
      keywords: [
        program.title,
        program.category,
        program.ageGroup || "",
        "WACC",
        "community program"
      ].filter(Boolean)
    });
  } catch (error) {
    return generateSEOMetadata({
      title: "Program",
      description: "View program details",
      url: `/programs/${resolvedParams.id}`,
    });
  }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const resolvedParams = await params;
  
  try {
    const program = await prisma.program.findUnique({
      where: { 
        id: parseInt(resolvedParams.id),
        active: true 
      },
      include: {
        schedules: {
          where: { active: true },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!program) {
      notFound();
    }

    const settings = await getSettings();
    const programImage = program.imageUrl || processProgramImage(null, program.title);
    const heroImage = programImage || settings.programs_hero_image || "/img/IMG_1290.jpeg";

    return (
      <div>

        <ProgramDetail 
          program={program}
          heroImage={heroImage}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
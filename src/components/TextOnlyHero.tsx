import { Container } from "@/components/Container";

interface TextOnlyHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export const TextOnlyHero = ({ title, subtitle, backgroundImage }: TextOnlyHeroProps) => {
  return (
    <div 
      className={`text-white relative ${backgroundImage ? 'bg-cover bg-center bg-no-repeat' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-black/60"></div>
      )}
      <Container className="py-16 lg:py-24 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold lg:text-5xl xl:text-6xl mb-6">
            {title}
          </h1>
          <p className={`text-lg lg:text-xl xl:text-2xl ${backgroundImage ? 'text-gray-100' : 'text-indigo-100'}`}>
            {subtitle}
          </p>
        </div>
      </Container>
    </div>
  );
};

export default TextOnlyHero;

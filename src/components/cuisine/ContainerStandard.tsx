interface Props {
  children: React.ReactNode;
  className?: string;
}

export function ContainerStandard({ children, className }: Props) {
  return (
    <div className={`max-w-[1100px] mx-auto px-[clamp(16px,5vw,60px)]${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

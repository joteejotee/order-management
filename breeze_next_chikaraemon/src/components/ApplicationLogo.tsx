import Image from 'next/image';

interface ApplicationLogoProps {
  className?: string;
}

export default function ApplicationLogo({
  className,
}: ApplicationLogoProps): JSX.Element {
  return (
    <Image
      src="/images/logo.png"
      alt="アプリケーションロゴ"
      width={50}
      height={50}
      className={className}
    />
  );
}

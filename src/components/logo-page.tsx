import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoPageProps {
  loading?: boolean;
  overlay?: boolean;
  subtitle?: string;
  title?: string;
}

export default function Page({
  loading = false,
  overlay = false,
  subtitle,
  title = '一个野生的地址生成器',
}: LogoPageProps) {
  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-[1000] flex h-[100dvh] max-h-screen w-screen items-center justify-center p-4 text-white',
        overlay ? 'bg-black/72 backdrop-blur-sm' : 'bg-black'
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-3xl sm:text-4xl md:text-8xl font-bold leading-tight select-none font-serif">
          {title}
        </div>
        {loading && (
          <LoaderCircle className="h-8 w-8 animate-spin text-white/80" />
        )}
        {subtitle && (
          <div className="text-sm md:text-base text-white/75">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

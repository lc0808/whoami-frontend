import { cn } from '../../utils/cn';

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('inline-block animate-spin', className)}>
      <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  );
}

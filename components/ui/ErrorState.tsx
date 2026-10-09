import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = "Đã xảy ra lỗi. Vui lòng thử lại.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      role="alert"
    >
      <div className="rounded-full bg-red-500/10 p-3">
        <AlertCircle className="h-6 w-6 text-red-400" aria-hidden />
      </div>
      <p className="text-sm text-[color:var(--text-secondary)] max-w-xs">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Thử Lại
        </Button>
      )}
    </div>
  );
}

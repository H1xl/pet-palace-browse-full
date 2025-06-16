
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  title = "Ошибка загрузки данных",
  message,
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">
            {message}
          </AlertDescription>
        </Alert>
        {showRetry && onRetry && (
          <div className="mt-4 text-center">
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw size={16} />
              Попробовать снова
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;

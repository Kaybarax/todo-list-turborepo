'use client';

import { Toaster, Toast } from './Toast';
import { useToast } from '../../hooks/use-toast';

export function ToastProvider() {
  const { toasts } = useToast();

  return (
    <Toaster position="bottom-right">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <p className="font-semibold">{title}</p>}
              {description && <p className="text-sm opacity-90">{description}</p>}
            </div>
            {action}
          </Toast>
        );
      })}
    </Toaster>
  );
}

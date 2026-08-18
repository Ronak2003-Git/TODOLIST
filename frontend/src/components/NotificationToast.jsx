import { FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

function NotificationToast({ toast, onDismiss }) {
  if (!toast) return null;
  const Icon = toast.type === 'info' ? FiInfo : FiCheckCircle;
  return (
    <div className={`notification-toast notification-toast--${toast.type || 'success'}`} role="status">
      <Icon aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification"><FiX /></button>
    </div>
  );
}

export default NotificationToast;

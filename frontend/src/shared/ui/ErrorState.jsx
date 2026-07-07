import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-alert-100 bg-alert-100/10 p-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-alert-100/20 text-alert-500">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-alert-500">{message}</p>
      <p className="mt-1 text-xs text-ink-400">Please check your network connection or server status.</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry} className="!py-1.5 !text-xs">
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}

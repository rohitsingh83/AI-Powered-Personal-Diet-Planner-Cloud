const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-3"></div>
      {message && <p className="text-gray-500 text-sm animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;

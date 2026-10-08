// LoadingError.jsx
const LoadingError = ({ resource = "data", isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading {resource}...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load {resource}</h1>
      </div>
    );
  }

  return null;
};

export default LoadingError;

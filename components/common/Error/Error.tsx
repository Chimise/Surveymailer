import React from "react";
import Button from "../../ui/Button";

interface ErrorProps {
  message?: string;
  onRetry: () => void;
}

const Error = ({ message = 'An error occurred, please try again', onRetry }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center">
      <div>{message}</div>
      <Button slim variant="outlined" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};

export default Error;

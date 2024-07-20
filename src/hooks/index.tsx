import { useState } from "react";
import { toast } from "sonner";

export const useFetch = (cbFn: any, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const fn = async (...args: any) => {
    setIsLoading(true);

    try {
      const response = await cbFn(options, args);
      setData(response);
      return true;
    } catch (error: any) {
      toast.error(error.message);
      setIsError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, fn };
};

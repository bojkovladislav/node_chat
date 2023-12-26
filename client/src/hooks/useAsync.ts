import { useState } from "react";

type ReturnData<T> = {
  isLoading: boolean;
  error: string | null;
  executeApiCall: (...args: any[]) => Promise<T>;
};

const useAsync = <T>(initialLoadingState?: boolean): ReturnData<T> => {
  const [isLoading, setIsLoading] = useState<boolean>(
    initialLoadingState !== undefined ? initialLoadingState : true,
  );  
  const [error, setError] = useState<string | null>(null);

  const executeApiCall: ReturnData<T>["executeApiCall"] = async (
    apiCallback: (...args: any[]) => Promise<T> | T,
    ...args: any[]
  ) => {
    try {
      setIsLoading(true);

      const result =
        args.length > 0 ? await apiCallback(...args) : await apiCallback();

      return result;
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, executeApiCall };
};

export default useAsync;

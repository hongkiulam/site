import { useRef, useEffect } from "react";

export const useIsFirstMount = () => {
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  return isFirstMount.current;
};

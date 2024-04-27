import { useEffect } from "react";

const useEnterKeyPressEffect = (ref) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        ref.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [ref]);
};

export default useEnterKeyPressEffect;

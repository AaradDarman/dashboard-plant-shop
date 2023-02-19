import { useState, useEffect } from "react";

const useInfiniteScroll = (elem, callback, isEndOfList = false) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (elem && elem.current) {
      let element = elem.current;
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEndOfList]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const handleScroll = () => {
    if (isEndOfList) return;
    if (
      elem.current.scrollHeight - Math.ceil(elem.current.scrollTop) >
        elem.current.clientHeight ||
      isFetching
    )
      return;
    setIsFetching(true);
  };

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;

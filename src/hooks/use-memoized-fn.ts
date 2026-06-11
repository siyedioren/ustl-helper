/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";

type noop = (this: any, ...args: any[]) => any;

export const useMemoizedFn = <T extends noop>(fn: T) => {
  const fnRef = useRef(fn);
  const memoFn = useRef<noop>();

  fnRef.current = fn;
  if (!memoFn.current) {
    memoFn.current = function (this: unknown, ...args: unknown[]) {
      return fnRef.current.apply(this, args);
    };
  }

  return memoFn.current as T;
};

export const useMemoFn = useMemoizedFn;

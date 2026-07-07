import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Generic async-state hook. Every feature's `application` layer builds on
 * this instead of hand-rolling loading/error/data state per hook.
 *
 * @param {Function} asyncFn - function returning a Promise<data>
 * @param {Array} deps - dependency array; re-runs asyncFn when these change
 * @param {Object} options - { immediate: boolean } default true
 */
export function useAsync(asyncFn, deps = [], options = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

    // Guards against setting state after unmount or after a newer call resolves
  const requestIdRef = useRef(0);

  const execute = useCallback(async (...args) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      if (requestId === requestIdRef.current) {
        setData(result);
      }
      return result;
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err);
      }
      throw err;
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, execute, setData };
}

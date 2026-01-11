import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Overload 1:
 * No initialState provided; value can be undefined; setter accepts undefined to remove.
 */
export function useQueryState(
  name: string,
): [string | undefined, (state?: string) => Promise<void>];

/**
 * Overload 2:
 * initialState provided; value is non-undefined; setter expects a string.
 */
export function useQueryState(
  name: string,
  initialState: string,
): [string, (state: string) => Promise<void>];

/**
 * Implementation: returns a union compatible with both overloads.
 */
export function useQueryState(
  name: string,
  initialState?: string,
):
  | [string | undefined, (state?: string) => Promise<void>]
  | [string, (state: string) => Promise<void>] {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the current search string reactively
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Current value for this param
  const value = useMemo(() => params.get(name) ?? undefined, [params, name]);

  // Base writer that does the URL update logic (string | undefined input)
  const writeParam = useCallback(
    (next?: string): void => {
      const nextParams = new URLSearchParams(location.search);
      const current = nextParams.get(name) ?? undefined;

      // No change? Bail.
      if (next === current) return;

      if (next === undefined || next === '') {
        nextParams.delete(name);
      } else {
        nextParams.set(name, next);
      }

      // Preserve path and hash (important for HashRouter "/#/route")
      navigate(
        {
          pathname: location.pathname,
          search: `?${nextParams.toString()}`,
          hash: location.hash,
        },
        { replace: true },
      );
    },
    [navigate, location, name],
  );

  // Overload 1 setter: accepts string | undefined
  const setOptional: (state?: string) => Promise<void> = useCallback(
    async (next?: string) => {
      writeParam(next);
    },
    [writeParam],
  );

  // Overload 2 setter: accepts string only
  const setStrict: (state: string) => Promise<void> = useCallback(
    async (next: string) => {
      writeParam(next);
    },
    [writeParam],
  );

  // Seed from initialState if provided and missing from URL
  useEffect(() => {
    if (initialState !== undefined && value === undefined) {
      // Fire-and-forget; caller doesn't need to await here
      void setStrict(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialState, value]);

  // Return the tuple that matches the active overload
  if (initialState === undefined) {
    // Overload 1: [string | undefined, (state?: string) => Promise<void>]
    return [value, setOptional];
  } else {
    // Overload 2: [string, (state: string) => Promise<void>]
    return [value ?? initialState, setStrict];
  }
}

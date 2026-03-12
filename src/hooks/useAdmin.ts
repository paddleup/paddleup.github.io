export function useAdmin() {
  const isAdmin = new URLSearchParams(window.location.search).has('admin');
  return { isAdmin };
}

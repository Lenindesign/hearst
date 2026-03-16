export function usePathname() {
  return "/home";
}

export function useRouter() {
  return {
    push: () => {},
    replace: () => {},
    prefetch: () => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
  };
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useParams() {
  return {};
}

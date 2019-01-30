import {useEffect} from 'react';

export default function useEventListener<K extends keyof HTMLElementEventMap>(
  id: string,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
) {
  useEffect(() => {
    const initialElement = document.getElementById(id);
    if (initialElement) {
      initialElement.addEventListener(type, listener);
    }
    return () => {
      const returnElement = document.getElementById(id);
      if (returnElement) {
        returnElement.removeEventListener(type, listener);
      }
    };
  }, []);
}

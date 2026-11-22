import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

type ModalBehaviorOptions = {
  /** The behavior is active only while this is true. */
  isActive: boolean;
  /** The dialog element: focus is kept inside it. Give it `tabIndex={-1}` so clicks inside keep focus there. */
  containerRef: RefObject<HTMLElement | null>;
  /** Element focused on open; falls back to the container. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Element that gets focus back on close; falls back to whatever was focused before opening. */
  getReturnFocusTarget?: () => HTMLElement | null;
  onClose: () => void;
};

const getFocusableElements = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];

/**
 * Shared behavior of modal surfaces (run details drawer, mobile navigation):
 * moves focus inside, keeps Tab within the dialog, closes on Escape,
 * locks page scroll and returns focus when closed.
 *
 * Escape is handled on the document, not on the dialog, so it still works after
 * a click on plain text has moved focus away from the dialog's buttons.
 */
export const useModalBehavior = ({
  isActive,
  containerRef,
  initialFocusRef,
  getReturnFocusTarget,
  onClose,
}: ModalBehaviorOptions) => {
  // Kept in refs so new callback identities on re-render do not re-run the effect
  // (that would steal focus back to the initial element on every render).
  const onCloseRef = useRef(onClose);
  const getReturnFocusTargetRef = useRef(getReturnFocusTarget);
  useEffect(() => {
    onCloseRef.current = onClose;
    getReturnFocusTargetRef.current = getReturnFocusTarget;
  });

  useEffect(() => {
    if (!isActive) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (initialFocusRef?.current ?? containerRef.current)?.focus();

    const trapFocus = (event: KeyboardEvent, container: HTMLElement) => {
      const focusable = getFocusableElements(container);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;
      const isFocusInside = active instanceof Node && container.contains(active);

      if (event.shiftKey && (!isFocusInside || active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!isFocusInside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === 'Tab' && containerRef.current) {
        trapFocus(event, containerRef.current);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      (getReturnFocusTargetRef.current?.() ?? previouslyFocused)?.focus();
    };
  }, [isActive, containerRef, initialFocusRef]);
};

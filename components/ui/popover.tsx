import {
    useState,
    useRef,
    useEffect,
    cloneElement,
    Children,
    ReactElement,
  } from 'react';
  import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    arrow,
    Placement,
  } from '@floating-ui/react';
  
  interface PopoverProps {
    children: ReactElement;
    content: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    arrowClassName?: string;
    placement?: Placement;
  }
  
  export const Popover = ({
    children,
    content,
    className,
    style,
    arrowClassName,
    placement = 'bottom',
  }: PopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const arrowRef = useRef(null);
  
    const {
      refs,
      floatingStyles,
      middlewareData,
      context: { floating },
    } = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
      placement,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(10),
        flip(),
        shift({ padding: 5 }),
        arrow({ element: arrowRef, padding: 5 }),
      ],
    });
  
    // Click outside handler
    useEffect(() => {
      if (!isOpen) return;
  
      const handleClickOutside = (event: MouseEvent) => {
        if (
          !refs.floating.current?.contains(event.target as Node) &&
          !refs.reference.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, refs.floating, refs.reference]);
  
    // Escape key handler
    useEffect(() => {
      if (!isOpen) return;
  
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setIsOpen(false);
      };
  
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);
  
    // Accessibility attributes
    const trigger = Children.only(children);
    const clonedTrigger = cloneElement(trigger, {
      ref: refs.setReference,
      onClick: () => setIsOpen(!isOpen),
      'aria-expanded': isOpen,
      'aria-haspopup': 'dialog',
    });
  
    // Arrow positioning
    const { x: arrowX, y: arrowY } = middlewareData.arrow || {};
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[placement.split('-')[0]] || 'top';
  
    return (
      <>
        {clonedTrigger}
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={{
              position: floating.strategy,
              top: floatingStyles.y ?? 0,
              left: floatingStyles.x ?? 0,
              ...style,
            }}
            className={className}
            role="dialog"
            aria-modal="true"
          >
            {content}
            <div
              ref={arrowRef}
              className={arrowClassName}
              style={{
                position: 'absolute',
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                [staticSide]: '-4px',
              }}
            />
          </div>
        )}
      </>
    );
  };
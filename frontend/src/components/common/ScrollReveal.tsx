import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'fade';

export interface ScrollRevealProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number; // Milliseconds
  duration?: number; // Milliseconds
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: React.ElementType;
}

/**
 * ScrollReveal Component
 * High-performance, hardware-accelerated scroll reveal animation.
 * Smooth 60-120fps with zero layout shifts, optimized for both Desktop and Mobile.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 650,
  threshold = 0.1,
  once = true,
  className = '',
  as: Component = 'div',
  style = {},
  ...rest
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // If reduced motion is requested or server-side, render visible by default
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced || !('IntersectionObserver' in window)) {
        return true;
      }
    }
    return false;
  });

  useEffect(() => {
    if (isVisible && once) return;

    const element = elementRef.current;
    if (!element) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once, isVisible]);

  // CSS Animation classes mapping
  const animationClasses: Record<ScrollAnimationType, string> = {
    'fade-up': 'scroll-reveal-fade-up',
    'fade-down': 'scroll-reveal-fade-down',
    'fade-left': 'scroll-reveal-fade-left',
    'fade-right': 'scroll-reveal-fade-right',
    'zoom-in': 'scroll-reveal-zoom-in',
    'fade': 'scroll-reveal-fade',
  };

  const combinedStyles: React.CSSProperties = {
    ...style,
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <Component
      ref={elementRef}
      className={`scroll-reveal ${animationClasses[animation]} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={combinedStyles}
      {...rest}
    >
      {children}
    </Component>
  );
};

export interface ScrollStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number; // Delay between consecutive items in ms
  animation?: ScrollAnimationType;
  duration?: number;
  threshold?: number;
  className?: string;
  as?: React.ElementType;
}

/**
 * ScrollStagger Component
 * Automatically wraps children in a wave-like sequential reveal animation.
 */
export const ScrollStagger: React.FC<ScrollStaggerProps> = ({
  children,
  staggerDelay = 90,
  animation = 'fade-up',
  duration = 600,
  threshold = 0.1,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            animation={animation}
            delay={index * staggerDelay}
            duration={duration}
            threshold={threshold}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </Component>
  );
};

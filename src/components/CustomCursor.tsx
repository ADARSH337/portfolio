import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    // Set initial positions
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    // GSAP quickTo for 60fps performance
    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    
    const xToRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' });
    const yToRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      xToDot(e.clientX);
      yToDot(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Hover effect listeners
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if target is interactive
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-card') ||
        target.closest('.interactive-card') ||
        target.getAttribute('role') === 'button';

      if (isInteractive) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handleMouseOut = () => {
      document.body.classList.remove('cursor-hover');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-follower" />
    </>
  );
};

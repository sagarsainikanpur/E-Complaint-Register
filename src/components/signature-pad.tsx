"use client";

import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  onChange: (value: string) => void;
  value?: string;
  className?: string;
}

export const SignaturePad = forwardRef<HTMLDivElement, SignaturePadProps>(
  ({ onChange, value, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(!!value);

    const getPosition = (event: MouseEvent | TouchEvent) => {
      if (!canvasRef.current) return null;
      const rect = canvasRef.current.getBoundingClientRect();
      if (event instanceof MouseEvent) {
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
      if (event.touches && event.touches.length > 0) {
        return {
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top,
        };
      }
      return null;
    };
    
    const
     clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }


    const startDrawing = (event: MouseEvent | TouchEvent) => {
      const pos = getPosition(event);
      if (!pos) return;
      const context = canvasRef.current?.getContext('2d');
      if (!context) return;
      
      context.beginPath();
      context.moveTo(pos.x, pos.y);
      setIsDrawing(true);
      if (!hasSigned) setHasSigned(true);
    };

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const pos = getPosition(event);
      if (!pos) return;
      const context = canvasRef.current?.getContext('2d');
      if (!context) return;
      
      context.lineTo(pos.x, pos.y);
      context.stroke();
    };

    const stopDrawing = () => {
      const context = canvasRef.current?.getContext('2d');
      if (!context || !isDrawing) return;
      context.closePath();
      setIsDrawing(false);
      onChange(canvasRef.current?.toDataURL('image/png') || '');
    };

    const handleClear = () => {
      clearCanvas();
      onChange('');
      setHasSigned(false);
    };
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if(!context) return;

        // Set high-DPI scaling
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        context.scale(dpr, dpr);
        
        // Set drawing styles
        context.strokeStyle = '#000';
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        // Redraw initial signature if provided
        if (value) {
          const img = new Image();
          img.onload = () => {
            clearCanvas();
            context.drawImage(img, 0, 0, canvas.width / dpr, canvas.height / dpr);
          };
          img.src = value;
        }


        // Add event listeners
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        
        canvas.addEventListener('touchstart', startDrawing, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            
            canvas.removeEventListener('touchstart', startDrawing);
            canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);
        };
    }, [isDrawing, value]);

    // Prevent scrolling on touch devices while drawing
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const preventScroll = (e: TouchEvent) => {
        if (isDrawing) {
          e.preventDefault();
        }
      };

      canvas.addEventListener('touchmove', preventScroll, { passive: false });
      return () => {
        canvas.removeEventListener('touchmove', preventScroll);
      }

    }, [isDrawing]);


    return (
      <div className={cn("relative w-full", className)} ref={ref}>
        <div className="relative aspect-[2/1] w-full rounded-lg border bg-white touch-none">
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
          />
          {!hasSigned && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-muted-foreground">Draw your signature here</p>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute top-2 right-2"
        >
          <Eraser className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';

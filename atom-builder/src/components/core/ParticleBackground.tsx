'use client';

import React, { useEffect, useRef } from 'react';
import { useGraphicsSettings } from '@/hooks/useGraphicsSettings';

export default function ParticleBackground() {
    const { settings } = useGraphicsSettings();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Only render the canvas if settings are not 'low'
    const shouldRender = settings === 'medium' || settings === 'high';

    useEffect(() => {
        if (!shouldRender || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        
        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() * 1 - 0.5) * 0.2;
                this.speedY = (Math.random() * 1 - 0.5) * 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset particle if it goes off-screen
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };
        init();

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        
        const handleResize = () => {
            setCanvasSize();
            init();
        }

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };

    }, [shouldRender]); // Re-run effect if shouldRender changes

    if (!shouldRender) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-50 opacity-20"
        />
    );
}

import React, { useEffect, useRef } from 'react';

const OceanBackground = ( { children } ) => {
    const canvasRef = useRef( null );

    useEffect( () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext( '2d' );
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // 물방울 클래스
        class Bubble {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.radius = Math.random() * 4 + 2;
                this.speed = Math.random() * 1 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.y -= this.speed;
                if ( this.y < 0 ) {
                    this.y = canvas.height + 50;
                    this.x = Math.random() * canvas.width;
                }
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc( this.x, this.y, this.radius, 0, Math.PI * 2 );
                ctx.fill();
                ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            }
        }

        const bubbles = [];
        for ( let i = 0; i < 80; i++ ) bubbles.push( new Bubble() );

        const animate = () => {
            ctx.fillStyle = 'rgba(13, 90, 162, 0.1)';
            ctx.fillRect( 0, 0, canvas.width, canvas.height );

            ctx.fillStyle = 'linear-gradient(180deg, #1e3a8a 0%, #0c4a6b 50%, #022c47 100%)';
            ctx.fillRect( 0, 0, canvas.width, canvas.height );

            bubbles.forEach( bubble => {
                bubble.update();
                bubble.draw();
            } );

            requestAnimationFrame( animate );
        };
        animate();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener( 'resize', resize );

        return () => window.removeEventListener( 'resize', resize );
    }, [] );

    return (
        <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: -1,
                    width: '100%',
                    height: '100%'
                }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
                {children}
            </div>
        </div>
    );
};

export default OceanBackground;

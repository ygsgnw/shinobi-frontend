import { memo, useRef, useEffect } from 'react';

export const VideoJS = (props) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const { options, onReady } = props;

    useEffect(() => {
        const loadVideoJS = () => {
            
            if (playerRef.current && !playerRef.current.isDisposed()) {
                console.log('disposing', playerRef.current);
                playerRef.current.dispose();
            }
            const videoElement = document.createElement("video-js");
            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = window.videojs(videoElement, options, () => {
                window.videojs.log('player is ready');
                onReady && onReady(player);
            });

            player.on('dispose', () => {
                window.videojs.log('player will dispose');
            });
        }

        if(window.videojs){
            console.log('loaded in window')
            loadVideoJS();
        }
        else{
            const script = document.createElement('script');
            script.src = "https://vjs.zencdn.net/8.16.1/video.min.js";
            script.onload = loadVideoJS;
            document.head.appendChild(script);
        }

        return () => {
            if (playerRef.current && !playerRef.current.isDisposed()) {
              playerRef.current.dispose();
              playerRef.current = null;
            }
        };
    }, []);

    return (
    <div data-vjs-player style={{width: '1006px', height: '500px', position: 'absolute', top: '2px', left: '2px'}}>
        <div ref={videoRef} />
    </div>
    );
}

export default memo(VideoJS);
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Maximize2, Volume2, VolumeX } from 'lucide-react';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
// import useAxiosPublic from './hooks/useAxiosPublic';  // Make sure this hook is correctly defined

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [video, setVideo] = useState(null);  // Initial state as null

  const axiosPublic = useAxiosPublic();  // Hook to get Axios instance

  // Fetch video URL from the server
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosPublic.get('/video');  // Fetch video data from your API
        setVideo(res.data[0].url);  // Set video URL to state
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();  // Trigger fetch when component mounts
  }, [axiosPublic]);  // Dependency array to ensure it only fetches once

  // Extract YouTube video ID from URL (assuming URL is from YouTube)
  const YOUTUBE_VIDEO_ID = video ? video.split('v=')[1] : null;

  useEffect(() => {
    if (!YOUTUBE_VIDEO_ID) return;  // Don't run the script if there's no video ID

    // Load the YouTube Iframe API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: YOUTUBE_VIDEO_ID,  // Use the extracted video ID
        playerVars: {
          autoplay: 0,
          controls: 0,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
        },
        events: {
          onReady: () => setIsPlaying(false),  // Set initial state to paused
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();  // Clean up when the component unmounts
      }
    };
  }, [YOUTUBE_VIDEO_ID]);  // Re-run the effect when video ID changes

  // Play/Pause toggle
  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  // Mute/Unmute toggle
  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div ref={containerRef} className="relative bg-black rounded-lg shadow-xl overflow-hidden">
            <div className="relative aspect-video">
              <div id="youtube-player" className="w-full h-full"></div>

              {/* Play button overlay */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="w-20 h-20 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
                    <Play size={40} className="text-white ml-2" />
                  </div>
                </div>
              )}

              {/* Video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex justify-between items-center">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    <Maximize2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;

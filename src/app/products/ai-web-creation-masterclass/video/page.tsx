'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  SkipBack, 
  SkipForward,
  Settings,
  Download,
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface VideoChapter {
  id: string;
  title: string;
  duration: string;
  startTime: number; // in seconds
  description: string;
  completed?: boolean;
}

interface VideoResource {
  id: string;
  title: string;
  type: 'pdf' | 'zip' | 'txt' | 'link';
  url: string;
  description: string;
  size?: string;
}

const VIDEO_CHAPTERS: VideoChapter[] = [
  {
    id: 'intro',
    title: 'Introduction & What You\'ll Learn',
    duration: '5:30',
    startTime: 0,
    description: 'Overview of the masterclass and what you\'ll achieve by the end',
  },
  {
    id: 'setup',
    title: 'Setting Up Your Development Environment',
    duration: '8:45',
    startTime: 330,
    description: 'Installing necessary tools and preparing your workspace',
  },
  {
    id: 'ai-tools',
    title: 'Essential AI Tools for Web Development',
    duration: '12:20',
    startTime: 855,
    description: 'Deep dive into ChatGPT, Claude, and other AI tools for coding',
  },
  {
    id: 'project-planning',
    title: 'Planning Your AI-Powered Website',
    duration: '10:15',
    startTime: 1595,
    description: 'Strategic planning and architecture with AI assistance',
  },
  {
    id: 'frontend-development',
    title: 'Building the Frontend with AI',
    duration: '18:30',
    startTime: 2210,
    description: 'Creating responsive designs using AI-generated code',
  },
  {
    id: 'backend-integration',
    title: 'Backend Integration & APIs',
    duration: '15:45',
    startTime: 3320,
    description: 'Connecting to databases and external services',
  },
  {
    id: 'deployment',
    title: 'Deployment & Going Live',
    duration: '8:20',
    startTime: 4265,
    description: 'Publishing your website and making it accessible worldwide',
  },
  {
    id: 'monetization',
    title: 'Monetization Strategies',
    duration: '6:45',
    startTime: 4765,
    description: 'How to turn your AI skills into profitable ventures',
  }
];

const VIDEO_RESOURCES: VideoResource[] = [
  {
    id: 'complete-code',
    title: 'Complete Source Code Package',
    type: 'zip',
    url: '/api/downloads/4/resources/source-code.zip',
    description: 'All the code files created during the masterclass',
    size: '2.4 MB'
  },
  {
    id: 'ai-prompts',
    title: 'AI Prompts Collection',
    type: 'pdf',
    url: '/api/downloads/4/resources/ai-prompts.pdf',
    description: 'Complete collection of AI prompts used in the masterclass',
    size: '1.8 MB'
  },
  {
    id: 'deployment-guide',
    title: 'Step-by-Step Deployment Guide',
    type: 'pdf',
    url: '/api/downloads/4/resources/deployment-guide.pdf',
    description: 'Detailed deployment instructions for multiple platforms',
    size: '3.2 MB'
  },
  {
    id: 'bonus-templates',
    title: 'Bonus Website Templates',
    type: 'zip',
    url: '/api/downloads/4/resources/bonus-templates.zip',
    description: '5 additional website templates built with AI',
    size: '8.7 MB'
  }
];

export default function VideoPlayerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentChapter, setCurrentChapter] = useState<VideoChapter | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check access permissions
  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/signin?callbackUrl=/products/ai-web-creation-masterclass/video');
        return;
      }

      try {
        const response = await fetch('/api/user/products');
        const data = await response.json();
        
        const hasProduct = data.products?.includes('4') || session.user?.roles?.includes('admin');
        setHasAccess(hasProduct);
        
        if (!hasProduct) {
          setTimeout(() => {
            router.push('/products/ai-web-creation-masterclass');
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [session, status, router]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
      
      // Update current chapter based on time
      const chapter = VIDEO_CHAPTERS.find((ch, index) => {
        const nextChapter = VIDEO_CHAPTERS[index + 1];
        return video.currentTime >= ch.startTime && 
               (!nextChapter || video.currentTime < nextChapter.startTime);
      });
      
      if (chapter && chapter !== currentChapter) {
        setCurrentChapter(chapter);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentChapter]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (seekTime: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seekTime;
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    setPlaybackRate(rate);
    video.playbackRate = rate;
    setShowSettings(false);
  };

  const jumpToChapter = (chapter: VideoChapter) => {
    handleSeek(chapter.startTime);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading masterclass...</p>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50">
          <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Required</h2>
          <p className="text-gray-300 mb-6">
            You need to purchase the AI Web Creation Masterclass to access this video content.
          </p>
          <Link 
            href="/products/ai-web-creation-masterclass"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            Purchase Masterclass
          </Link>
          <p className="text-sm text-gray-400 mt-4">Redirecting in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Container */}
      <div className="relative">
        {/* Main Video Player */}
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            className="w-full h-full"
            poster="/images/video-poster.jpg"
            preload="metadata"
            onContextMenu={(e) => e.preventDefault()} // Disable right-click
          >
            {/* Video source will be added when you upload the actual video */}
            <source src="/videos/ai-web-creation-masterclass.mp4" type="video/mp4" />
            <track kind="captions" src="/videos/captions.vtt" srcLang="en" label="English" />
            Your browser does not support the video tag.
          </video>

          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="relative">
                <div className="w-full h-1 bg-gray-600 rounded-full">
                  <div 
                    className="h-1 bg-purple-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="absolute inset-0 w-full h-1 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>
                
                <button
                  onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-20 h-1 bg-gray-600 rounded-full appearance-none"
                  />
                </div>

                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Settings Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-purple-400 transition-colors"
                  >
                    <Settings className="w-6 h-6" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg p-2 min-w-32">
                      <div className="text-white text-sm mb-2">Playback Speed</div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-700 ${
                            playbackRate === rate ? 'text-purple-400' : 'text-white'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="text-white hover:text-purple-400 transition-colors">
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Video */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                AI Web Creation Masterclass
              </h1>
              <p className="text-gray-300 mb-4">
                Learn to build professional websites using AI tools like ChatGPT and Claude. 
                This comprehensive masterclass will take you from beginner to advanced in just 60 minutes.
              </p>
              
              {currentChapter && (
                <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-1">Currently Watching:</h3>
                  <p className="text-white font-medium">{currentChapter.title}</p>
                  <p className="text-gray-300 text-sm">{currentChapter.description}</p>
                </div>
              )}
            </div>

            {/* Downloadable Resources */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Downloadable Resources
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VIDEO_RESOURCES.map(resource => (
                  <div key={resource.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{resource.title}</h3>
                      <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                        {resource.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{resource.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{resource.size}</span>
                      <a
                        href={resource.url}
                        className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-500 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chapter Navigation */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Chapters
              </h2>
              <div className="space-y-2">
                {VIDEO_CHAPTERS.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => jumpToChapter(chapter)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentChapter?.id === chapter.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{index + 1}. {chapter.title}</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{chapter.duration}</span>
                      </div>
                    </div>
                    <p className="text-sm opacity-80">{chapter.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Your Progress
              </h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Overall Progress</span>
                  <span className="text-white font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Keep watching to unlock your certificate of completion!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
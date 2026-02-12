'use client';

import { Twitter } from 'lucide-react';

interface ClickToTweetProps {
  text: string;
  url?: string;
  via?: string;
  hashtags?: string[];
  className?: string;
}

export default function ClickToTweet({
  text,
  url,
  via = 'ToolForgeAI',
  hashtags = [],
  className = '',
}: ClickToTweetProps) {
  const handleTweet = () => {
    const tweetUrl = new URL('https://twitter.com/intent/tweet');

    tweetUrl.searchParams.set('text', text);
    if (url) tweetUrl.searchParams.set('url', url);
    if (via) tweetUrl.searchParams.set('via', via);
    if (hashtags.length > 0) tweetUrl.searchParams.set('hashtags', hashtags.join(','));

    // Track click-to-tweet
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click_to_tweet', {
        tweet_text: text,
      });
    }

    window.open(tweetUrl.toString(), 'tweet', 'width=550,height=420');
  };

  return (
    <button
      onClick={handleTweet}
      className={`group relative p-6 border-2 border-blue-500 dark:border-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all ${className}`}
    >
      <div className="flex items-start gap-4">
        <Twitter className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1 text-left">
          <p className="text-gray-900 dark:text-white mb-2 italic">
            &ldquo;{text}&rdquo;
          </p>
          <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
            Click to Tweet
          </span>
        </div>
      </div>
    </button>
  );
}

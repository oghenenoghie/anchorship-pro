// Home hero background. Use Anchorship's own or properly licensed footage only, never another company's video.
// To enable the video: put an MP4 in public/videos/ and set HERO_VIDEO_SRC (e.g. "/videos/hero.mp4"), or set
// NEXT_PUBLIC_HERO_VIDEO_URL to a hosted file. Until then the hero shows the poster image (shown before the video loads,
// and instead of it for visitors who prefer reduced motion); NEXT_PUBLIC_HERO_POSTER_URL overrides it.
const HERO_VIDEO_SRC: string | null = null;
const HERO_POSTER_SRC = "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2000&q=85";
export const heroMedia = { video: process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim() || HERO_VIDEO_SRC, poster: process.env.NEXT_PUBLIC_HERO_POSTER_URL?.trim() || HERO_POSTER_SRC };

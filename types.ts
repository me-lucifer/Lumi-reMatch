export interface Photographer {
  id: string;
  name: string;
  style: string;
  description: string;
  priceRange: string;
  location: string;
  avatar: string;
  portfolio: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
}

export interface MatchResult {
  photographerId: string;
  compatibilityScore: number;
  matchReason: string;
  keyElementsDetected: string[];
}

export interface MoodboardAnalysis {
  colorPalette: string[]; // Hex codes
  vibeKeywords: string[];
  venueType: string;
  lightingStyle: string;
  matches: MatchResult[];
}

export interface AnalysisState {
  isAnalyzing: boolean;
  step: string; // 'uploading' | 'analyzing_colors' | 'detecting_mood' | 'finding_matches' | 'complete'
}

export enum AppView {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  RESULTS = 'RESULTS',
  PROFILE = 'PROFILE',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS'
}
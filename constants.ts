import { Visibility } from './types';

export const APP_NAME = "SocialPulse";

export const MOCK_DELAY = 600; // Simulated network delay in ms

export const DEFAULT_AVATAR = "https://picsum.photos/id/64/200/200";

export const VISIBILITY_OPTIONS = [
  { value: Visibility.PUBLIC, label: 'Public' },
  { value: Visibility.FRIENDS, label: 'Friends Only' },
  { value: Visibility.PRIVATE, label: 'Private' },
];
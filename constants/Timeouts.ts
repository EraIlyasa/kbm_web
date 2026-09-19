export const Timeouts = {
  EXPECT: 30000,
  SHORT: 30000,
  NAVIGATION: 30000,
  PAGE_LOAD: 30000,
  RENDER: 35000,
  ACTION: 30000,
  // small settle delays for animations/processing that have no deterministic UI signal
  SETTLE: 30000,
  TRANSITION: 30000,
  PROCESSING: 30000,
} as const;

export const Timeouts = {
  EXPECT: 5000,
  SHORT: 2000,
  NAVIGATION: 30000,
  PAGE_LOAD: 20000,
  RENDER: 15000,
  ACTION: 10000,
  // small settle delays for animations/processing that have no deterministic UI signal
  SETTLE: 500,
  TRANSITION: 1000,
  PROCESSING: 3000,
} as const;

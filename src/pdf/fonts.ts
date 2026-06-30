import { Font } from '@react-pdf/renderer';

// Register Cairo for Arabic Support
Font.register({
  family: 'Cairo',
  fonts: [
    { src: '/fonts/Cairo-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Cairo-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/Cairo-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/Cairo-Bold.ttf', fontWeight: 700 },
  ],
});

// Register Plus Jakarta Sans for English Support
Font.register({
  family: 'PlusJakartaSans',
  fonts: [
    { src: '/fonts/PlusJakartaSans-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/PlusJakartaSans-Medium.ttf', fontWeight: 500 },
    { src: '/fonts/PlusJakartaSans-SemiBold.ttf', fontWeight: 600 },
    { src: '/fonts/PlusJakartaSans-Bold.ttf', fontWeight: 700 },
  ],
});

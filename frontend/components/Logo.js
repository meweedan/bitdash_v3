import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [platform, setPlatform] = useState(null);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('cash')) {
      setPlatform('cash');
    } else if (hostname.includes('stocks')) {
      setPlatform('stocks');
    } else if (hostname.includes('crypto')) {
      setPlatform('crypto');  
    } else if (hostname.includes('forex')) {
      setPlatform('forex');
    } else if (process.env.NODE_ENV === 'development') {
      const urlPlatform = new URLSearchParams(window.location.search).get('platform');
      setPlatform(urlPlatform);
    }
  }, []);

  const getLogoConfig = () => {
    // Updated dimensions as requested
    const configs = {
      cash: {
        en: { path: '/cash.png', width: 862, height: 304 },
        ar: { path: '/cash-ar.png', width: 862, height: 304 }
      },
      stocks: {
        en: { path: '/stocks.png', width: 862, height: 304 },
        ar: { path: '/stocks-ar.png', width: 862, height: 304 }
      },
      forex: {
        en: { path: '/forex.png', width: 862, height: 304 },
        ar: { path: '/forex-ar.png', width: 862, height: 304 }
      },
      crypto: {
        en: { path: '/crypto.png', width: 862, height: 304 },
        ar: { path: '/crypto-ar.png', width: 862, height: 304 }
      },
      main: {
        en: { path: '/bitdash-logo.png', width: 1080, height: 249 },
        ar: { path: '/bitdash-ar-logo.png', width: 1080, height: 249 }
      }
    };

    const platformKey = platform || 'main';
    return configs[platformKey]?.[isArabic ? 'ar' : 'en'] || configs.main[isArabic ? 'ar' : 'en'];
  };

  // Responsive sizing for perfect fit on mobile and 25% bigger on desktop
  const logoConfig = getLogoConfig();
  
  // Calculate aspect ratio to maintain proportions
  const aspectRatio = logoConfig.width / logoConfig.height;
  
  // Base size (mobile)
  const mobileWidth = "125px";
  const mobileHeight = `${parseInt(mobileWidth) / aspectRatio}px`;
  
  // Desktop size (25% bigger)
  const desktopWidth = `${parseInt(mobileWidth) * 1.6}px`;
  const desktopHeight = `${parseInt(mobileHeight) * 1.6}px`;
  
  // Use breakpoint to switch between mobile and desktop sizes
  const width = useBreakpointValue({ base: mobileWidth, md: desktopWidth });
  const height = useBreakpointValue({ base: mobileHeight, md: desktopHeight });

  return (
    <Box 
      display="block" 
      width={width}
      height={height}
      position="relative"
      overflow="hidden"
    >
      <Image
        src={logoConfig.path}
        alt="Logo"
        fill
        priority={true}
        style={{ 
          objectFit: 'contain',
          objectPosition: isArabic ? 'right center' : 'left center'
        }}
      />
    </Box>
  );
};

export default Logo;
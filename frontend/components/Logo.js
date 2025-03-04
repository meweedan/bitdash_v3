import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Logo = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [platform, setPlatform] = useState(null);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('cash')) {
      setPlatform('cash');
    } else if (hostname.includes('stock')) {
      setPlatform('stock');
    } else if (hostname.includes('fund')) {
      setPlatform('fund');  
    } else if (hostname.includes('trade')) {
      setPlatform('trade');
    } else if (process.env.NODE_ENV === 'development') {
      const urlPlatform = new URLSearchParams(window.location.search).get('platform');
      setPlatform(urlPlatform);
    }
  }, []);

  const getLogoConfig = () => {
    // Dimensions from the screenshots
    const configs = {
      cash: {
        en: { path: '/cash.png', width: 816, height: 289 },
        ar: { path: '/cash-ar.png', width: 701, height: 233}
      },
      stock: {
        en: { path: '/stock.png', width: 878, height: 275 },
        ar: { path: '/stock-ar.png', width: 684, height: 233 }
      },
      trade: {
        en: { path: '/trade.png', width: 878, height: 275 },
        ar: { path: '/trade-ar.png', width: 784, height: 233 }
      },
      fund: {
        en: { path: '/fund.png', width: 878, height: 275 },
        ar: { path: '/fund-ar.png', width: 684, height: 233 }
      },
      main: {
        en: { path: '/bitdash-logo.png', width: 775, height: 285 },
        ar: { path: '/bitdash-ar-logo.png', width: 675, height: 285 }
      }
    };

    const platformKey = platform || 'main';
    return configs[platformKey]?.[isArabic ? 'ar' : 'en'] || configs.main[isArabic ? 'ar' : 'en'];
  };

  // Using the largest width (875px) and height (285px) as reference
  // to create consistent scaling while maintaining proportions
  const CONTAINER_WIDTH = { base: '115px', md: '170px' };
  const CONTAINER_HEIGHT = { base: '50px', md: '50px' };

  const logoConfig = getLogoConfig();

  return (
    <Box 
      display="block" 
      width={CONTAINER_WIDTH}
      height={CONTAINER_HEIGHT}
      position="relative"
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
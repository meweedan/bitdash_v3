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
    // } else if (hostname.includes('work')) {
    //   setPlatform('work');
    } else if (hostname.includes('food')) {
      setPlatform('food');  
    // } else if (hostname.includes('ride')) {
    //   setPlatform('ride');
    } else if (hostname.includes('shop')) {
      setPlatform('shop');
    } else if (process.env.NODE_ENV === 'development') {
      const urlPlatform = new URLSearchParams(window.location.search).get('platform');
      setPlatform(urlPlatform);
    }
  }, []);

  const getLogoConfig = () => {
    // Dimensions from the screenshots
    const configs = {
      cash: {
        en: { path: '/cash.png', width: 916, height: 289 },
        ar: { path: '/cash-ar.png', width: 801, height: 233}
      },
      // work: {
      //   en: { path: '/work.png', width: 778, height: 175 },
      //   ar: { path: '/work-ar.png', width: 784, height: 233 }
      // },
      food: {
        en: { path: '/food.png', width: 978, height: 275 },
        ar: { path: '/food-ar.png', width: 784, height: 233 }
      },
      shop: {
        en: { path: '/shop.png', width: 978, height: 275 },
        ar: { path: '/shop-ar.png', width: 784, height: 233 }
      },
      // ride: {
      //   en: { path: '/ride.png', width: 978, height: 275 },
      //   ar: { path: '/ride-ar.png', width: 784, height: 233 }
      // },
      main: {
        en: { path: '/bitdash-logo.png', width: 875, height: 285 },
        ar: { path: '/bitdash-ar-logo.png', width: 875, height: 285 }
      }
    };

    const platformKey = platform || 'main';
    return configs[platformKey]?.[isArabic ? 'ar' : 'en'] || configs.main[isArabic ? 'ar' : 'en'];
  };

  // Using the largest width (875px) and height (285px) as reference
  // to create consistent scaling while maintaining proportions
  const CONTAINER_WIDTH = { base: '140px', md: '180px' };
  const CONTAINER_HEIGHT = { base: '45px', md: '40px' };

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
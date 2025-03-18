import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { Box, SimpleGrid, useBreakpointValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const Logo = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [platform, setPlatform] = useState(null);
  
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('tazdani')) {
      setPlatform('tazdani'); 
    } else if (hostname.includes('utlubha')) {
      setPlatform('utlubha');
    } else if (process.env.NODE_ENV === 'development') {
      const urlPlatform = new URLSearchParams(window.location.search).get('platform');
      setPlatform(urlPlatform);
    }
  }, []);

  // Updated with accurate dimensions from the specs provided
  const logoConfigs = {
    tazdani: {
      en: { path: '/tazdani.png', width: 1174, height: 520 },
      ar: { path: '/tazdani-ar.png', width: 1134, height: 634 }
    },
    utlubha: {
      en: { path: '/utlubha.png', width: 1174, height: 520 },
      ar: { path: '/utlubha-ar.png', width: 1134, height: 634 }
    },
    main: {
      en: { path: '/bitdash-logo.png', width: 1174, height: 520 },
      ar: { path: '/bitdash-ar-logo.png', width: 1134, height: 634 }
    }
  };

  // Renders a single logo based on current platform
  const renderSingleLogo = () => {
    const platformKey = platform || 'main';
    const logoConfig = logoConfigs[platformKey]?.[isArabic ? 'ar' : 'en'] || logoConfigs.main[isArabic ? 'ar' : 'en'];
    
    // Calculate aspect ratio to maintain proportions
    const aspectRatio = logoConfig.width / logoConfig.height;
    
    // Header logo sizes - updated for better fit in header
    const headerWidth = useBreakpointValue({ base: "150px", md: "200px" });
    const headerHeight = `${parseInt(headerWidth) / aspectRatio}px`;
    
    return (
      <Box 
        display="block" 
        width={headerWidth}
        height={headerHeight}
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

  // Renders all platform logos in a 2x2 grid (for mobile solutions menu)
  const renderLogoGrid = () => {
    const platformOptions = ['tazdani', 'utlubha'];
    
    return (
      <SimpleGrid columns={2} spacing={4} width="100%">
        {platformOptions.map((plat) => {
          const logoConfig = logoConfigs[plat][isArabic ? 'ar' : 'en'];
          const aspectRatio = logoConfig.width / logoConfig.height;
          
          // Fixed dimensions for grid items to ensure consistent layout
          const gridItemWidth = "180px";
          const gridItemHeight = `${parseInt(gridItemWidth) / aspectRatio}px`;
          
          return (
            <Box 
              key={plat}
              width={gridItemWidth}
              height={gridItemHeight}
              position="relative"
              overflow="hidden"
              justifySelf="center"
            >
              <Image
                src={logoConfig.path}
                alt={`${plat} Logo`}
                fill
                style={{ 
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </Box>
          );
        })}
      </SimpleGrid>
    );
  };

  // Conditionally render single logo or grid based on variant prop
  return variant === 'grid' ? renderLogoGrid() : renderSingleLogo();
};

export default Logo;
import { Box, Heading, Container, Text, Stack, useColorMode } from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { keyframes } from '@emotion/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"
import { useTranslation } from 'react-i18next';

const scrollAnimation = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(10px); }
  100% { opacity: 0; transform: translateY(20px); }
`;

const colorChange = keyframes`
  0% { color: #245b84; }    /* Dark Blue-Green */
  14% { color: #36739f; }   /* Medium Blue */
  28% { color: #52a4e1; }   /* Bright Blue */
  42% { color: #67bdfd; }   /* Light Blue */
  56% { color: #70b4e6; }   /* Sky Blue */
  70% { color: #65a6fa; }   /* Electric Blue */
  85% { color: #6a9ce8; }   /* Steel Blue */
  100% { color: #245b84; }  /* Back to Dark Blue-Green */
`;

export default function Hero({ title, subtitle, slogan, scrolldown }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const textColor = isDark ? '#67bdfd' : '#67bdfd';
  const { t } = useTranslation('common');
  
  return (
    <>
    <Analytics />
    <SpeedInsights />
    <Box
      as="section"
      color={textColor}
      height="90vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="3xl" textAlign="center">
        <Stack spacing={{ base: 7, md: 8 }} py={{ base: 360, md: 26 }}>
          <Heading
            fontWeight="bold"
            fontSize={{ base: '2xl', sm: '2xl', md: '5xl' }}
            lineHeight="150%"
            transition="color 1.25s ease"
          >
            <Text
              as="span"
              animation={`${colorChange} 3s infinite linear`}
              sx={{
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                  color: textColor
                }
              }}
            >
            {t('welcome.hero')}
            </Text>
          </Heading>


          <Stack direction="column" spacing={3} align="center">
            <Box
              as={ArrowDownIcon}
              boxSize={10}
              animation={`${scrollAnimation} 4s infinite`}
              color={textColor}
            />
            <Text
              fontSize="lg"
              mt={9}
            >
              {scrolldown}
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Box>
    </>
  );
}
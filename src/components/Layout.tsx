import { ReactNode } from 'react';
import { Box, Container, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaFutbol, FaTrophy, FaChartBar } from 'react-icons/fa';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();

  const navItems = [
    { icon: FaHome, path: '/', label: 'Inicio' },
    { icon: FaUsers, path: '/teams', label: 'Equipos' },
    { icon: FaFutbol, path: '/matches', label: 'Partidos' },
    { icon: FaChartBar, path: '/rankings', label: 'Ranking' },
    { icon: FaTrophy, path: '/results', label: 'Resultados' },
  ];

  return (
    <Box minH="100vh" pb="70px" position="relative">
      {title && (
        <Box
          py={4}
          bg="brand.500"
          color="white"
          textAlign="center"
          position="sticky"
          top={0}
          zIndex={10}
          boxShadow="md"
        >
          <Heading size="lg" fontWeight="extrabold">{title}</Heading>
        </Box>
      )}

      <Container maxW="container.sm" pt={4}>
        {children}
      </Container>

      {/* Mobile navigation bar */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        bg="white"
        boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
        zIndex={10}
      >
        <Flex justify="space-around" py={2}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Stack
                key={item.path}
                as={Link}
                to={item.path}
                spacing={1}
                align="center"
                py={1}
                opacity={isActive ? 1 : 0.6}
                transition="all 0.2s"
                _hover={{ opacity: 1 }}
              >
                <IconButton
                  aria-label={item.label}
                  icon={<item.icon />}
                  variant="ghost"
                  colorScheme={isActive ? "brand" : "gray"}
                  size="md"
                />
                <Text fontSize="xs" fontWeight={isActive ? "bold" : "normal"}>
                  {item.label}
                </Text>
              </Stack>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

export default Layout;
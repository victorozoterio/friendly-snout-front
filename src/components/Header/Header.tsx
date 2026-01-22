import { Box, Button, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ArrowLeft, House, SignOut, UserCircle } from 'phosphor-react';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../routes';

interface HeaderProps {
  children?: ReactNode;
  hideBackButton?: boolean;
}

export const Header = ({ children, hideBackButton = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.AUTH.SIGN_IN);
  };

  return (
    <HStack w='100%' px={10} pt={6} justify='space-between' align='center' minH='5rem'>
      <HStack spacing={2} minH='5rem' align='center'>
        {hideBackButton ? (
          <Box as='img' src={Logo} alt='Logo Focinho Amigo' maxH='5rem' objectFit='contain' />
        ) : (
          <>
            <IconButton
              as={Link}
              to={ROUTES.DASHBOARD.BASE}
              aria-label='Ir para o dashboard'
              icon={<House size={22} />}
              variant='link'
              color='primary'
            />

            <Button
              leftIcon={<ArrowLeft size={18} />}
              variant='link'
              color='primary'
              fontWeight='bold'
              onClick={() => navigate(-1)}
              _hover={{ textDecoration: 'none' }}
            >
              Voltar
            </Button>
          </>
        )}
      </HStack>

      <HStack spacing={3} minH='5rem' align='center'>
        {children}

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Menu do usuário'
            icon={<UserCircle size={40} />}
            variant='link'
            color='primary'
            borderRadius='full'
            _hover={{ color: 'primary' }}
            _active={{ color: 'primary' }}
          />
          <MenuList minW='8rem' p={1} boxShadow='none' border='1px solid' borderColor='gray.200' borderRadius='lg'>
            <MenuItem
              icon={<SignOut size={18} weight='bold' />}
              onClick={handleLogout}
              color='primary'
              borderRadius='md'
              fontWeight='bold'
              _hover={{ bg: 'gray.100' }}
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </HStack>
  );
};

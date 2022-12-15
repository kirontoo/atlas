import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Show,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FiBell, FiChevronDown, FiMenu, FiPlus } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth } from '../auth/firebase';
import { UserActions } from '../store/features/user/userSlice';
import DarkModeToggle from './DarkModeToggle';
import TicketsModalForm from './TicketsModalForm';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const Navbar = ({ onOpen, ...rest }: MobileProps) => {
  const { isOpen, onOpen: onOpenModal, onClose } = useDisclosure();
  let location = useLocation();
  let [breadcrumbItems, setBreadcrumbItems] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setBreadcrumbItems(() => location.pathname.split('/').slice(1));
  }, [location]);

  async function signUserOut() {
    dispatch({ type: UserActions.START_LOADING });
    try {
      await signOut(auth);
      dispatch({ type: UserActions.LOGOUT });
      navigate('/');
    } catch (error) {
      console.error(error);
      // TODO: handle error in a different way
    } finally {
      dispatch({ type: UserActions.END_LOADING });
    }
  }

  return (
    <>
      <TicketsModalForm isOpen={isOpen} onClose={onClose} />
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        justifyContent={{ base: 'space-between', md: 'space-between' }}
        {...rest}
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
        >
          Atlas
        </Text>

        <HStack spacing="2" display={{ base: 'none', md: 'flex' }}>
          <Breadcrumb>
            {breadcrumbItems.map((r: string, index: number) => {
              return (
                <BreadcrumbItem
                  key={r}
                  isCurrentPage={index === breadcrumbItems.length - 1}
                >
                  <BreadcrumbLink textTransform="capitalize">{r}</BreadcrumbLink>
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </HStack>
        <HStack spacing={{ base: '0', md: '2' }}>
          <Show above="md">
            <Button leftIcon={<FiPlus />} size="sm" onClick={onOpenModal}>
              New Ticket
            </Button>
          </Show>
          <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<FiBell />}
          />
          <DarkModeToggle />

          {/* popout menu */}
          <Flex alignItems={'center'}>
            <Menu>
              <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">Justina Clark</Text>
                    <Text fontSize="xs" color="gray.600">
                      Admin
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown />
                  </Box>
                </HStack>
              </MenuButton>
              <MenuList
                bg={useColorModeValue('white', 'gray.900')}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Billing</MenuItem>
                <MenuDivider />
                <MenuItem onClick={signUserOut}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </HStack>
      </Flex>
    </>
  );
};

export default Navbar;

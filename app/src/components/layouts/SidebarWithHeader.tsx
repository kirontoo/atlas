import {
  Box,
  Drawer,
  DrawerContent,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import Navbar from '../Navbar';
import SidebarContent, { LinkItemProps } from '../SidebarContent';

interface SidebarWithHeaderProps {
  links: Array<LinkItemProps>;
  children: ReactNode;
}

export default function SidebarWithHeader({ links, children }: SidebarWithHeaderProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh">
      <SidebarContent
        onClose={() => onClose}
        links={links}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} links={links} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Navbar onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

import NavItem from './NavItem';

interface SidebarProps extends BoxProps {
  onClose: () => void;
  links: Array<LinkItemProps>;
}

export interface LinkItemProps {
  name: string;
  icon: IconType;
  href?: string;
}

const SidebarContent = ({ onClose, links, ...rest }: SidebarProps) => {
  return (
    <Box transition="3s ease" w={{ base: 'full', md: 60 }} pos="fixed" h="full" {...rest}>
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        marginBottom="4"
        justifyContent="space-between"
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.300', 'gray.700')}
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Atlas
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack align="start" spacing="2">
        {links.map((link) => (
          <NavItem key={link.name} {...link}></NavItem>
        ))}
      </VStack>
    </Box>
  );
};

export default SidebarContent;

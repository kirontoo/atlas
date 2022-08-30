import { Flex, FlexProps, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { ReactText } from 'react';
import { IconType } from 'react-icons';

interface NavItemProps extends FlexProps {
  name: string;
  icon?: IconType;
  href?: string;
  active?: boolean;
  heading?: boolean;
  children?: ReactText;
}

const NavItem = ({
  icon,
  name,
  href,
  active,
  heading,
  children,
  ...rest
}: NavItemProps) => {
  return (
    <>
      {heading ? (
        <Text casing="uppercase">
          <Flex align="center" p="2" mx="4" fontWeight="700" {...rest}>
            {name}
          </Flex>
        </Text>
      ) : (
        <Link
          href={href}
          style={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none' }}
          w="full"
        >
          <Flex
            align="center"
            p="2"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            fontWeight="700"
            bg={active ? useColorModeValue('white', 'gray.700') : 'inherit'}
            boxShadow={active ? 'base' : 'none'}
            _active={{
              bg: useColorModeValue('white', 'gray.700'),
              boxShadow: 'base',
              color: useColorModeValue('gray.700', 'white'),
            }}
            _hover={{
              bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            color={active ? 'gray.700' : useColorModeValue('gray.500', 'gray.300')}
            {...rest}
          >
            {icon && (
              <Flex
                color={active ? 'white' : 'primary.main'}
                p="2"
                bg={active ? 'primary.main' : useColorModeValue('white', 'gray.700')}
                mr="4"
                borderRadius={active ? 'md' : 'full'}
                justify="center"
                align="center"
              >
                <Icon fontSize="16" as={icon} />
              </Flex>
            )}
            {children ?? name}
          </Flex>
        </Link>
      )}
    </>
  );
};

export default NavItem;

import {
  Flex,
  FlexProps,
  Icon,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactText } from 'react';
import { IconType } from 'react-icons';
import { NavLink as ReactLink, To } from 'react-router-dom';

interface NavItemProps extends FlexProps {
  name: string;
  icon?: IconType | null;
  href?: To;
  heading?: boolean;
  children?: ReactText;
}

const NavItem = ({ icon, name, href, heading, children, ...rest }: NavItemProps) => {
  let { colorMode } = useColorMode();
  let color = {
    dark: {
      bg: 'gray.700',
      color: 'white',
    },
    light: {
      bg: 'white',
      color: 'gray.700',
    },
  };
  return (
    <>
      {heading ? (
        <Flex align="center" p="2" mx="4" fontWeight="700" {...rest}>
          <Text casing="uppercase">{name}</Text>
        </Flex>
      ) : (
        <Link
          as={ReactLink}
          to={href!}
          textDecoration="none"
          _focus={{ boxShadow: 'none' }}
          w="full"
          end
        >
          {({ isActive }: { isActive: boolean }) => {
            return (
              <Flex
                align="center"
                p="2"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                fontWeight="700"
                bg={
                  isActive
                    ? colorMode == 'dark'
                      ? color.dark.bg
                      : color.light.bg
                    : 'inherit'
                }
                boxShadow={isActive ? 'base' : 'none'}
                _active={{
                  bg: useColorModeValue('white', 'gray.700'),
                  boxShadow: 'base',
                  color: useColorModeValue('gray.700', 'white'),
                }}
                _hover={{
                  bg: useColorModeValue('gray.200', 'gray.700'),
                }}
                color={
                  isActive
                    ? colorMode == 'dark'
                      ? color.dark.color
                      : color.light.color
                    : 'gray.400'
                }
                {...rest}
              >
                {icon && (
                  <Flex
                    color={isActive ? 'white' : 'primary.main'}
                    p="2"
                    bg={
                      isActive
                        ? 'primary.main'
                        : colorMode == 'dark'
                        ? color.dark.bg
                        : color.light.bg
                    }
                    mr="4"
                    borderRadius={isActive ? 'md' : 'full'}
                    justify="center"
                    align="center"
                  >
                    <Icon fontSize="16" as={icon} />
                  </Flex>
                )}
                {children ?? name}
              </Flex>
            );
          }}
        </Link>
      )}
    </>
  );
};

export default NavItem;

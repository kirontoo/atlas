import { Flex, FlexProps, Icon, Link, Text, useColorModeValue } from '@chakra-ui/react';
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
                bg={isActive ? useColorModeValue('white', 'gray.700') : 'inherit'}
                boxShadow={isActive ? 'base' : 'none'}
                _active={{
                  bg: useColorModeValue('white', 'gray.700'),
                  boxShadow: 'base',
                  color: useColorModeValue('gray.700', 'white'),
                }}
                _hover={{
                  bg: useColorModeValue('gray.200', 'gray.700'),
                }}
                color={isActive ? useColorModeValue('gray.700', 'white') : 'gray.400'}
                {...rest}
              >
                {icon && (
                  <Flex
                    color={isActive ? 'white' : 'primary.main'}
                    p="2"
                    bg={
                      isActive ? 'primary.main' : useColorModeValue('white', 'gray.700')
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

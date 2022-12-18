import { Link as ChakraLink } from '@chakra-ui/react';
import React from 'react';
import { Link as ReactLink, To } from 'react-router-dom';
interface LinkProps {
  children: React.ReactNode;
  to: To;
}

// Wrapper link component to take advantage of react router link component and
// also include chakra ui's features
function Link({ children, to, ...props }: LinkProps) {
  return (
    <ChakraLink as={ReactLink} to={to} {...props}>
      {children}
    </ChakraLink>
  );
}

export default Link;

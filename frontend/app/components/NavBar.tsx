import React from 'react';
import Link from 'next/link';

// Define the type for each item in the props array
type NavItem = {
  Link: string;
  Name: string;
};

// Define the type for the props of the NavBar component
type Props = {
  items: NavItem[];
  ContainerStyles: string
  TextStyles: string
};

// Functional component definition
const NavBar: React.FC<Props> = ({ items, ContainerStyles, TextStyles }) => {
  return (
    <div>
      {items.map((item, index) => (
        <Link key={index} href={item.Link}>
          {item.Name}
        </Link>
      ))}
    </div>
  );
};

export default NavBar;

import { AiFillBook, AiFillSetting } from 'react-icons/ai';
import { GiTicket, GiWorld } from 'react-icons/gi';
import { ImHome } from 'react-icons/im';
import { Outlet } from 'react-router-dom';

import SidebarWithHeader from '../../components/layouts/SidebarWithHeader';
import { LinkItemProps } from '../../components/SidebarContent';

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: ImHome, href: '/dashboard' },
  { name: 'Projects', icon: AiFillBook, href: '/dashboard/projects' },
  { name: 'Tickets', icon: GiTicket, href: '/dashboard/tickets' },
  { name: 'Organization', icon: GiWorld, href: '/dashboard/organization' },
  { name: 'User', icon: null, heading: true },
  { name: 'Settings', icon: AiFillSetting, href: '/dashboard/settings' },
];

function Dashboard() {
  return (
    <SidebarWithHeader links={LinkItems}>
      <Outlet />
    </SidebarWithHeader>
  );
}

export default Dashboard;

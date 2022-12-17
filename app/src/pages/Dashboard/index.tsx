import { AiFillBook, AiFillSetting } from 'react-icons/ai';
import { GiTicket, GiWorld } from 'react-icons/gi';
import { ImHome } from 'react-icons/im';
import { Outlet } from 'react-router-dom';

import SidebarWithHeader from '../../components/layouts/SidebarWithHeader';
import { LinkItemProps } from '../../components/SidebarContent';
import {
  dashboardProjectsRoute,
  dashboardRoute,
  dashboardSettingsRoute,
  dashboardTicketsRoute,
} from '../../utils/routes';

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: ImHome, href: dashboardRoute },
  { name: 'Projects', icon: AiFillBook, href: dashboardProjectsRoute },
  { name: 'Tickets', icon: GiTicket, href: dashboardTicketsRoute },
  { name: 'Organization', icon: GiWorld, href: '/dashboard/organization' },
  { name: 'User', icon: null, heading: true },
  { name: 'Settings', icon: AiFillSetting, href: dashboardSettingsRoute },
];

function Dashboard() {
  return (
    <SidebarWithHeader links={LinkItems}>
      <Outlet />
    </SidebarWithHeader>
  );
}

export default Dashboard;

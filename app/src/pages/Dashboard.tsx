import { AiFillBook, AiFillSetting } from 'react-icons/ai';
import { GiTicket, GiWorld } from 'react-icons/gi';
import { ImHome } from 'react-icons/im';

import SidebarWithHeader from '../components/layouts/SidebarWithHeader';
import { LinkItemProps } from '../components/SidebarContent';

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: ImHome },
  { name: 'Projects', icon: AiFillBook },
  { name: 'Tickets', icon: GiTicket },
  { name: 'Organization', icon: GiWorld },
  { name: 'User', icon: null, heading: true },
  { name: 'Settings', icon: AiFillSetting },
];

function Dashboard() {
  return <SidebarWithHeader links={LinkItems}>hi</SidebarWithHeader>;
}

export default Dashboard;

import event from './event';
import parameter from './parameter';
import account from './account';
import access from './access';
import archives from './archives';
import { NavItemType } from 'types/menu';

export const getMenuItems = (isAccessArchives: boolean, isParameterAccess: boolean): { items: NavItemType[] } => {
  const items: NavItemType[] = [event, account, access];

  if (isParameterAccess) {
    items.push(parameter);
  }

  if (isAccessArchives) {
    items.push(archives);
  }

  return { items };
};

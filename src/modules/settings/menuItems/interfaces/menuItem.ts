export interface MenuItem {
  id?: number;
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  subMenu?: boolean;
  canAccess?: boolean;
  dropDown?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  modifications?: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

export interface Order {
  id: string;
  tableId?: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    modifications: string[];
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total: number;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tables: Table[];
  menus: Menu[];
}

export interface Table {
  id: string;
  number: string;
  qrCode: string;
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

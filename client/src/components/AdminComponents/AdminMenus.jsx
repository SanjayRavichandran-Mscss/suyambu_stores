import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Users,
  Boxes,
  Archive,
  Settings,
} from "lucide-react";

const menus = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    key: "customers",
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
  {
    key: "categories",
    label: "Categories",
    icon: Boxes,
    path: "/admin/categories",
  },
  {
    key: "products",
    label: "Products",
    icon: Archive,
    path: "/admin/products",
  },
  {
    key: "orders",
    label: "Orders",
    icon: ShoppingCart,
    path: "/admin/orders",
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

const menuActive = "bg-[#69D84F] text-white shadow font-semibold"; // green highlight

const menuDefault = "text-gray-700 hover:bg-[#E3E8EE] hover:text-[#69D84F]"; // gray hover, green text hover

const AdminMenus = () => (
  <nav className="w-full bg-white flex items-center justify-center gap-6 px-6 py-4 border-b border-[#E3E8EE]">
    {menus.map(({ key, label, icon: Icon, path }) => (
      <NavLink
        key={key}
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-base ${
            isActive ? menuActive : menuDefault
          }`
        }
      >
        <Icon size={20} />
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>
);

export default AdminMenus;

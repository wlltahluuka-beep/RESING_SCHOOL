import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  School,
  Wallet,
  UserPlus,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import logo from "../assets/school.png";
import avatar from "../assets/avatar.png";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Students", icon: GraduationCap, path: "/admin/students" },
  { name: "Teachers", icon: Users, path: "/admin/teachers" },
  { name: "Classes", icon: School, path: "/admin/classes" },
  { name: "Cashiers", icon: Wallet, path: "/admin/cashiers" },
  { name: "Parents", icon: Users, path: "/admin/parents" },
  { name: "Messages", icon: MessageCircle, path: "/admin/messages" },
  { name: "Reports", icon: BarChart3, path: "/admin/reports" },
  { name: "Add Cashier", icon: UserPlus, path: "/admin/add-cashier" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 270,
        minHeight: "100vh",
        background: "#0B1120",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRight: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div>
        <div
          style={{
            padding: 25,
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          <img
            src={logo}
            alt=""
            style={{
              width: 55,
              height: 55,
              borderRadius: 15,
            }}
          />

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
              }}
            >
              RESING ERP
            </h2>

            <small
              style={{
                color: "#94A3B8",
              }}
            >
              School Management
            </small>
          </div>
        </div>

        <div
          style={{
            padding: "10px 18px",
          }}
        >
          {menus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                  padding: "14px 18px",
                  marginBottom: 8,
                  textDecoration: "none",
                  color: "#fff",
                  borderRadius: 15,
                  transition: ".3s",
                  background: isActive
                    ? "linear-gradient(90deg,#6D5DF0,#8B5CF6)"
                    : "transparent",
                })}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div
        style={{
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#111827",
            borderRadius: 18,
            padding: 15,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 15,
          }}
        >
          <img
            src={avatar}
            alt=""
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
            }}
          />

          <div>
            <div
              style={{
                fontWeight: 700,
              }}
            >
              Admin User
            </div>

            <small
              style={{
                color: "#94A3B8",
              }}
            >
              Super Admin
            </small>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            height: 50,
            border: "none",
            borderRadius: 15,
            background: "#EF4444",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
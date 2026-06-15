'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Server, ChevronDown, ChevronRight, ShoppingCart, DollarSign, Users, Activity, ListTodo } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  user: any;
}

export default function Sidebar({ isOpen, user }: SidebarProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: Home },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Tasks', path: '/admin/tasks', icon: ListTodo },
    { 
      label: 'VPS', 
      icon: Server, 
      subItems: [
        { label: 'Dashboard', path: '/admin/vps/dashboard' },
        { label: 'Products', path: '/admin/vps/products' },
        { label: 'Purchases', path: '/admin/vps/purchases' },
        { label: 'Sales', path: '/admin/vps/sales' },
        { label: 'Reminder Queue', path: '/admin/vps/reminders' },
        { label: 'Settings', path: '/admin/vps/settings' }
      ] 
    },
    { 
      label: 'Ecommerce', 
      icon: ShoppingCart, 
      subItems: [
        { label: 'Dashboard', path: '/admin/ecommerce/dashboard' },
        { label: 'Products', path: '/admin/ecommerce/products' },
        { label: 'Order History', path: '/admin/ecommerce/orders' },
        { label: 'Reports', path: '/admin/ecommerce/reports' },
        { label: 'Settings', path: '/admin/ecommerce/settings' }
      ] 
    },
    { 
      label: 'Financials', 
      icon: DollarSign, 
      subItems: [
        { label: 'Reporting', path: '/admin/financials/reporting' }
      ] 
    },
    { 
      label: 'Settings', 
      icon: Settings,
      subItems: [
        { label: 'Users', path: '/admin/settings/users' },
        { label: 'Cron Jobs', path: '/admin/settings/cron' }
      ]
    },
    { 
      label: 'System Audits', 
      icon: Activity,
      subItems: [
        { label: 'Email Queue', path: '/admin/system/emails' },
        { label: 'Notifications', path: '/admin/system/notifications' },
        { label: 'SMTP Config', path: '/admin/system/smtp' }
      ]
    },
  ];

  return (
    <aside 
      className="sidebar glass" 
      style={{ 
        width: isOpen ? '240px' : '64px', 
        padding: isOpen ? '24px 16px' : '24px 8px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease',
        overflow: 'hidden',
        borderRight: '1px solid var(--border)',
        borderRadius: '0'
      }}
    >
      <Link href="/admin" className="logo" style={{ display: 'flex', justifyContent: 'center', padding: '0', background: 'transparent', marginBottom: '0' }}>
        <img 
          src={isOpen ? "/keplerx-logo-color.png" : "/keplerx-favicon.webp"} 
          alt="KeplerX Logo" 
          style={{ width: isOpen ? '160px' : '32px', height: 'auto', transition: 'width 0.3s ease' }} 
        />
      </Link>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = item.path ? pathname === item.path : false;
          const isExpanded = expanded[item.label];
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column' }}>
              {hasSubItems ? (
                <div
                  className="nav-link"
                  title={isOpen ? '' : item.label}
                  onClick={() => isOpen && toggleExpand(item.label)}
                  style={{ 
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    padding: isOpen ? '10px 12px' : '10px',
                    borderRadius: '0',
                    fontSize: '13px',
                    cursor: isOpen ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <item.icon size={18} style={{ minWidth: '18px' }} />
                  {isOpen && (
                    <>
                      <span style={{ whiteSpace: 'nowrap', flex: 1, marginLeft: '12px' }}>{item.label}</span>
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path!}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  title={isOpen ? '' : item.label}
                  style={{ 
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    padding: isOpen ? '10px 12px' : '10px',
                    borderRadius: '0',
                    fontSize: '13px'
                  }}
                >
                  <item.icon size={18} style={{ minWidth: '18px' }} />
                  {isOpen && <span style={{ whiteSpace: 'nowrap', marginLeft: '12px' }}>{item.label}</span>}
                </Link>
              )}

              {/* SubItems rendering */}
              {hasSubItems && isExpanded && isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px', background: 'rgba(0,0,0,0.02)', borderLeft: '1px solid var(--border)', marginLeft: '20px', paddingLeft: '8px' }}>
                  {item.subItems!.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.path}
                      className={`nav-link ${pathname === subItem.path ? 'active' : ''}`}
                      style={{ 
                        padding: '8px 12px',
                        borderRadius: '0',
                        fontSize: '12px',
                        color: pathname === subItem.path ? '#094f56' : 'var(--text-secondary)'
                      }}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

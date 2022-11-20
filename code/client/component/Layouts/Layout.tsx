// import Navbar from './navbar'
// import Footer from './footer'
import React, { useContext, useState } from 'react'
import 'antd/dist/antd.css';
import { Layout, Menu, Button, Dropdown, Select } from 'antd';
import {
  UsergroupAddOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  SnippetsOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  PlusOutlined,
  LogoutOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router'
import { AccountContext } from '../../contexts/accountContext';
import { TenantContext } from '../../contexts/tenantContext';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

export default function AppLayout({ children }: any) {

  const [collapsed, seCollapse] = useState(false);
  const router = useRouter();
  const { accountInfo } = useContext(AccountContext);
  const { setTenantId } = useContext(TenantContext);

  const handleClick = (e: any) => {
    console.log(e);
    router.push(e.key);
  };

  const addNewMenu = [
    { key: '/estimates/create', label: 'Add Estimate' },
    { key: '/invoices/create', label: 'Add Invoice' },
    { key: '/customers/create', label: 'Add Customer' },
    { key: '/items/create', label: 'Add Item' },
    { key: '/taxes/create', label: 'Add Tax' },
  ];

  const settingsMenu = [
    { key: '/settings/create', label: 'Settings' },
    { key: '/users/create', label: 'Users' },
    { key: '/taxes/create', label: 'Taxes' },
  ];

  const accountMenu = [
    { key: '/account', label: 'My Account', icon: <UserOutlined /> },
    { key: '/organizations', label: 'Organization', icon: <ApartmentOutlined /> },
    { key: 'divider1', type: 'divider' },
    { key: 'api/auth/logout', label: 'Logout', icon: <LogoutOutlined /> },
  ];

  return (
    <Layout className="h-screen">
      <Sider collapsible collapsed={collapsed} onCollapse={() => seCollapse(!collapsed)} >
        {
          !collapsed &&
          <div className="logo flex-1 text-center align-middle text-white text-lg font-bold pt-0.5">InvoiceNest.com</div>
        }
        {
          collapsed &&
          <div className="logo flex-1 text-center align-middle text-white text-lg font-bold pt-0.5">IN</div>
        }
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleClick} items={[
          { key: '/', label: 'Dashboard', icon: <PieChartOutlined /> },
          { key: 'divider1', type: 'divider', dashed: true },
          { key: '/invoices', label: 'Invoices', icon: <BookOutlined /> },
          { key: '/estimates', label: 'Estimates', icon: <SnippetsOutlined /> },
          { key: 'divider2', type: 'divider', dashed: true },
          { key: '/customers', label: 'Customers', icon: <UsergroupAddOutlined /> },
          { key: '/items', label: 'Items', icon: <AppstoreOutlined /> },
        ]} />
      </Sider>
      <Layout className="site-layout">
        {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
        <Content className="m-2 h-full">
          <div className="flex justify-between">
            <div>
              <Dropdown menu={{ items: addNewMenu, onClick: handleClick, triggerSubMenuAction: 'click' }} placement="bottomLeft">
                <Button type="primary" shape="circle" size="middle" icon={<PlusOutlined />} />
              </Dropdown>
            </div>
            <div className="flex gap-2">
              {
                accountInfo?.organizations &&
                <div>
                  <Select defaultValue={accountInfo?.organizations[0]?.organizationId} style={{ width: 150 }} onChange={(event) => setTenantId(event)}>
                    {
                      accountInfo?.organizations?.map((org: any) => {
                        return <Option value={org.organizationId} key={org.organizationId}>{org.name}</Option>
                      })
                    }
                  </Select>
                </div>
              }

              <div>
                <Dropdown menu={{ items: settingsMenu, onClick: handleClick, triggerSubMenuAction: 'click' }} placement="bottomRight">
                  <Button type="primary" shape="circle" size="middle" icon={<SettingOutlined />} />
                </Dropdown>
              </div>
              <div>
                <Dropdown menu={{ items: accountMenu, onClick: handleClick, triggerSubMenuAction: 'click' }} placement="bottomRight">
                  <Button type="primary" shape="circle" size="middle"> A </Button>
                </Dropdown>
              </div>
            </div>
          </div>

          <div className="site-layout-background my-4 mx-1 overflow-y-scroll" style={{ 'height': '98%' }} >
            {children}
          </div>
        </Content>
        <Footer className="text-center"></Footer>
      </Layout>
    </Layout>
  )
}

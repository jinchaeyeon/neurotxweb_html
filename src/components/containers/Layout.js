import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const CustomLayout = (props) => {

    return(
        <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">Record</Menu.Item>
            <Menu.Item key="2">Load</Menu.Item>
            <Menu.Item key="3">Export</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider width={250} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['0']}
              defaultOpenKeys={[]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="0">Raw Signal</Menu.Item>

              <SubMenu key="sub1" icon={<LaptopOutlined />} title="Analyze">
                <Menu.Item key="1">Autoregulation</Menu.Item>
                <Menu.Item key="2">Heart rate variability</Menu.Item>
              </SubMenu>

              <SubMenu key="sub2" icon={<LaptopOutlined />} title="Infusion Study">
              <Menu.Item key="3">Signal Sectionizer</Menu.Item>
              <Menu.Item key="4">Parameter Manager</Menu.Item>
                <Menu.Item key="5">AMP,RAP</Menu.Item>
                <Menu.Item key="6">AMP P-line</Menu.Item>
              </SubMenu>

              <SubMenu key="sub3" icon={<UserOutlined />} title="User Management">
                <Menu.Item key="5">Doctors</Menu.Item>
                <Menu.Item key="6">Patients</Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" icon={<NotificationOutlined />} title="License">
                <Menu.Item key="7">License List</Menu.Item>
             
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
            {
                props.children
            }
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
}

export default CustomLayout;
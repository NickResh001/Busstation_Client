import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom"
import "./Style.css"
import { Breadcrumb, Layout as LayoutAntd, Menu, theme } from 'antd';
import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space, Button, Modal, Avatar} from 'antd';

const { Header, Content, Footer } = LayoutAntd;

/**
 * Компонент react для макета страницы. Содежит панель навигации.
 * @param {*} user текущий пользователь системы.
 * @param {*} setUser - метод динамического изменения текщего пользователя системы.
 * @returns 
 */
const Layout = ({ user, setUser }) => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [isModalOpen, setIsModalOpen] = useState(false);
    /**
     * Метод показа модального окна выхода из системы.
     */
    const showModal = () => {
        setIsModalOpen(true);
    };
    /**
     * Метод закрытия модального окна выхода из системы.
     */
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    
    var dropdownItems;
    var navigationItems;
    if(user.isAuthenticated)
    {
        dropdownItems = 
        [
            {
                label: <div>Настройки профиля</div>,
                key: '1',
                icon: <SettingOutlined />,
            },
            {
                type: 'divider',
            },
            {
                label: <Link onClick={showModal}>Выход</Link>,
                key: '3',
            },
        ];
    }
    else
    {
        dropdownItems = 
        [
            { 
                label: <Link to="/register">Регистрация</Link>,
                key: '1',
            },
            { 
                label: <Link to="/login">Вход</Link>,
                key: '2',
            },
        ];
    }

    if(user.userRole == "admin"){
        navigationItems = [
            {
                label: <Link to="/mainpage">Главная</Link>,
                key: "1",
            },
            {
                label: <Link to="/settlements" className='submenu-text'>Города</Link>,
                key: "2",
            }, 
            //{
            //    label: <Link to="/settlementCreate">Создание города</Link>,
            //    key: "3",
            //}, 
            {
                label: <Link to="/regions">Регионы</Link>,
                key: "4",
            }, 
            //{
            //    label: <Link to="/regionCreate">Создание региона</Link>,
            //    key: "5",
            //}, 
        ]
    }
    else{
        navigationItems = [
            {
                label: <Link to="/mainpage">Главная</Link>,
                key: "1",
            },
            {
                label: <Link to="/settlements">Города</Link>,
                key: "3",
            },
            {
                label: <Link to="/regions">Регионы</Link>,
                key: "4",
            },
        ]
    }

    /**
     * Выход из системы.
     * @param {*} event 
     * @returns 
     */
    const logoff = async (event) => {
        
        setIsModalOpen(false)
        event.preventDefault()

        const requestOptions = {
            method: "POST",
        }
        return await fetch("api/account/logoff", requestOptions)
            .then((response) => {
              if (response.status === 200) {
                setUser({ isAuthenticated: false, userName: "" });
              }
              window.location.assign("/settlements");
            })
    }

    return (
        <>
            <LayoutAntd className="layout">
                <Header className="header">
                    <div
                        style={{
                            float: "right",
                            height: "inherit"
                        }}
                    > 
                        <Dropdown
                        menu={{items: dropdownItems,}}
                        trigger={['click']}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space className="space">
                                    <Avatar size={30} className="avatar" icon={<UserOutlined />} />
                                    {user.isAuthenticated ? (
                                        <strong className="common-text">{user.userName}</strong>
                                    ) : (
                                        <strong className="common-text">Гость</strong>
                                    )}
                                </Space>
                            </a>
                        </Dropdown>
                    </div>
                    <Menu
                        className="layout-menu"
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['3']}
                        items={navigationItems}
                    />
                </Header>
                <Content
                    style={{
                        padding: '0 50px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        
                    </Breadcrumb>
                    <div
                        className="site-layout-content"
                        style={{
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    className="footer"
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©2023 Created by Ant UED
                </Footer>
            </LayoutAntd>
            <Modal 
                title="Выход из аккаунта" 
                open={isModalOpen} 
                onOk={logoff} 
                onCancel={handleCancel}
                footer={[
                    <Button onClick={logoff} className='default-button'>
                        Да
                    </Button>,
                    <Button onClick={handleCancel} className='default-button'>
                        Нет
                    </Button>
                ]}
                >
                <p>Вы действительно хотите выйти?</p>
            </Modal>
        </>
        
    );
};
export default Layout;
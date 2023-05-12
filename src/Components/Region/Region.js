import React, { useEffect, useState } from 'react'
import './Style.css'
import { Link } from "react-router-dom"
import { Table, Row, Space, Typography, Button, Modal } from 'antd';
import { Form, Input, Select } from 'antd';
import Column from 'antd/es/table/Column';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

/**
 * Компонент react для просмотра, изменения и удаления регионов.
 * @param {*} regions актуальный список регионов.
 * @param {*} setRegions метод динамического обновления актуального списка регионов.
 * @param {*} user текущий пользователь.
 * @returns 
 */
const Region = ({ regions, setRegions, user }) =>
{
    const [title, setTitle] = useState("");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idForDelete, setIdForDelete] = useState(-1);

    /**
     * Метод для показа модального окна подтверждения удаления.
     * @param {int} value ID города для удаления.
     */
    const showDeleteModal = (value) => {
        setIdForDelete(value);
        setIsDeleteModalOpen(true);
    };
    /**
     * Метод для закрытия модального окна подтверждения удаления.
     */
    const handleDeleteCancel = () => {
        setIdForDelete(-1);
        setIsDeleteModalOpen(false);
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [idForEdit, setIdForEdit] = useState(-1);
    /**
     * Метод для показа модального окна с формой редактирования.
     * @param {int} id текущее значение поля редактируемой сущности.
     * @param {string} title текущее значение поля редактируемой сущности.
     */
    const showEditModal = (id, title) => {
        setIdForEdit(id);
        setTitle(title);
        setIsEditModalOpen(true);
    }
    /**
     * Метод закрытия модального окна с формой редактирования с подтверждением действия редактирования.
     * @returns 
     */
    const handleEditConfirm = async () => {
        setIsEditModalOpen(false);
        const regionDTO = 
        {
            title: title
        }
        const requestOptions =
        {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(regionDTO),
        }
        
        const response = await fetch(`api/Region/${idForEdit}`, requestOptions);

        return await response.json()
            .then((data) => {
                if (response.ok) {
                    setRegions(data);
                }
                setIdForEdit(-1);
                setTitle("");
            }, (error) => console.log(error))
    }

    /**
     * Метод закрытия модального окна с формой редактирования с отменой действия редактирования.
     */
    const handleEditCancel = () => {
        setIdForEdit(-1);
        setTitle("");
        setIsEditModalOpen(false);
    }

    useEffect(() => {
        /**
         * Вызов GET-запроса в Swagger.
         * @returns 
         */
        const getRegions = async () => {
            const requestOptions =
            {
                method: 'GET'
            }
            return await fetch("https://localhost:7082/api/Region", requestOptions)
                .then(Response => Response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        setRegions(data)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
        getRegions()
    }, [setRegions])

    /**
     * Вызов DELETE-запроса в Swagger.
     * @param {int} regionDTOId ID удаляемой сущности.
     * @returns 
     */
    const deleteItem = async (regionDTOId) => {
        handleDeleteCancel()
        const requestOptions =
        {
            method: "DELETE"
        }
        const response = await fetch(`api/Region/${regionDTOId}`, requestOptions);
        return await response.json()
            .then((data) => {
                if (response.ok) {
                    setRegions(data);
                    /* window.location.reload(); */
                }
            }, (error) => console.log(error))
    }
    
    return (
        <React.Fragment>
            <h3 className='header-for-settlements'>
                <span className='common-text'>Список регионов</span>
                {user.userRole == "admin"? (
                    <Button className="primary-button" type="primary">                        
                        <Link to="/regionCreate"><PlusOutlined />Добавить</Link>
                    </Button>
                ) : (
                    <></>
                )}
            </h3>
            <Table dataSource={regions} pagination={{ pageSize: 5}}>
                {user.userRole == "admin" ? (
                    <Column title="ID" dataIndex="regionId" key="regionId">{regions.regionId}</Column>
                ) : ( 
                <></>
                )}
                <Column title="Название" dataIndex="title" key="title">{regions.title}</Column>
                <Column 
                    title=""
                    key="action"
                    width={10}
                    render={(_, regions) => (
                        <Space size="middle">
                            {user.userRole == "admin" ? (
                                <>
                                    <Button className="primary-button" type="primary" htmlType="submit" onClick={() => showEditModal(regions.regionId, regions.title)}>
                                        Изменить
                                    </Button>
                                    <Button type="primary" htmlType="submit" onClick={() => showDeleteModal(regions.regionId)} danger>
                                        <DeleteOutlined />
                                        Удалить
                                    </Button>
                                </>
                            ) : (
                                <></>
                            )}
                        </Space>
                    )}
                />

            </Table>      
            <Modal
                title="Удаление"
                open={isDeleteModalOpen} 
                onOk={() => deleteItem( regions.regionId )} 
                onCancel={handleDeleteCancel}
                footer={[
                    <Button onClick={() => deleteItem( idForDelete )} danger>
                        Да
                    </Button>,
                    <Button onClick={handleDeleteCancel} className='default-button'>
                        Нет
                    </Button>
                ]}
            >
                <span className='common-text'> Вы действительно хотите удалить этот регион?</span>
            </Modal>

            <Modal
                title="Редактирование региона"
                open={isEditModalOpen} 
                onCancel={handleEditCancel}
                footer={[
                    <></>
                ]}
            >
               <Form
                    name="editForm"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 16,}}
                    style={{maxWidth: 600,}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        style={{marginTop: 30}}
                        label="Название"
                        rules={[{
                            required: true,
                            message: 'Введите название региона',
                        },]}
                    >
                        <Input name="title" onInput={e => setTitle(e.target.value)} value={title}/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button className="primary-button" type="primary" htmlType="submit" onClick={() => handleEditConfirm()}>
                            Подтвердить изменения
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>              
        </React.Fragment>
    )
}
export default Region


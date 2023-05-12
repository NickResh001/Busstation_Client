import React, { useEffect, useState } from 'react'
import './Style.css'
import { regionsList } from '../RegionList/RegionList'
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
 * Компонент react просмотра, изменения и удаления городов.
 * @param {*} settlements актуальный список городов.
 * @param {*} setSettlements метод динамического обновления актуального списка городов.
 * @param {*} user текущий пользователь системы.
 * @returns 
 */
const Settlement = ({ settlements, setSettlements, user }) =>
{
    const [title, setTitle] = useState("");
    const [regionFK, setRegionFK] = useState(-1);

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
     * @param {int} regionFK текущее значение поля редактируемой сущности.
     */
    const showEditModal = (id, title, regionFK) => {
        setIdForEdit(id);
        setTitle(title);
        setRegionFK(regionFK);
        setIsEditModalOpen(true);
    }
    /**
     * Метод закрытия модального окна с формой редактирования с подтверждением действия редактирования.
     * @returns 
     */
    const handleEditConfirm = async () => {
        setIsEditModalOpen(false);
        const settDTO = 
        {
            title: title,
            regionFK : regionFK
        }
        const requestOptions =
        {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(settDTO),
        }
        const response = await fetch(`api/Settlement/${idForEdit}`, requestOptions);

        return await response.json()
            .then((data) => {
                if (response.ok) {
                    setSettlements(data);
                }
                setIdForEdit(-1);
                setTitle("");
                setRegionFK("");
            }, (error) => console.log(error))
    }
    /**
     * Метод закрытия модального окна с формой редактирования с отменой действия редактирования
     */
    const handleEditCancel = () => {
        setIdForEdit(-1);
        setTitle("");
        setRegionFK("");
        setIsEditModalOpen(false);
    }

    useEffect(() => {
        /**
         * Вызов GET-запроса в Swagger.
         * @returns 
         */
        const getSettlements = async () => {
            const requestOptions =
            {
                method: 'GET'
            }
            return await fetch("https://localhost:7082/api/Settlement", requestOptions)
                .then(Response => Response.json())
                .then(
                    (data) => {
                        console.log('Data:', data)
                        setSettlements(data)
                    },
                    (error) => {
                        console.log(error)
                    }
                )
        }
        getSettlements()
    }, [setSettlements])

    /**
     * Вызов DELETE-запроса в Swagger
     * @param {int} settlementDTOId ID удаляемой сущности
     * @returns 
     */
    const deleteItem = async (settlementDTOId) => {
        handleDeleteCancel()
        const requestOptions =
        {
            method: "DELETE"
        }
        const response = await fetch(`api/Settlement/${settlementDTOId}`, requestOptions);

        return response.json()
            .then((data) => {
                if (response.ok) {
                    setSettlements(data);
                }
            }, (error) => console.log(error))
    }
    
    return (
        <React.Fragment>
            <h3 className='header-for-settlements'>
                <span className='common-text'>Список городов</span>
                {user.userRole == "admin"? (
                    <Button className="primary-button" type="primary">
                        <Link to="/settlementCreate"><PlusOutlined />Добавить</Link>
                    </Button>
                ) : (
                    <></>
                )}
            </h3>
            <Table dataSource={settlements} pagination={{ pageSize: 5 }}>
                {user.userRole == "admin" ? (
                    <Column title="ID" dataIndex="settlementDTOId" key="settlementDTOId">{settlements.settlementDTOId}</Column>
                ) : (
                    <></>
                )}
                <Column title="Название" dataIndex="title" key="title">{settlements.title}</Column>
                <Column 
                    title="Область" 
                    dataIndex="regionTitle" 
                    key="regionTitle"
                >
                    {settlements.regionTitle}
                </Column>
                <Column 
                    title=""
                    key="action"
                    width={10}
                    render={(_, settlements) => (
                        <Space size="middle">
                            {user.userRole == "admin" ? (
                                <>
                                    <Button className="primary-button" type="primary" htmlType="submit" onClick={() => showEditModal(settlements.settlementDTOId, settlements.title, settlements.regionFK)}>
                                        Изменить
                                    </Button>
                                    <Button type="primary" htmlType="submit" onClick={() => showDeleteModal(settlements.settlementDTOId)}/* onClick={() => deleteItem( settlements.settlementDTOId )} */ danger>
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
                onOk={() => deleteItem( settlements.settlementDTOId )} 
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
                <span className='common-text'> Вы действительно хотите удалить этот город?</span>
            </Modal>

            <Modal
                title="Редактирование города"
                open={isEditModalOpen} 
                /* onOk={() => deleteItem( settlements.settlementDTOId )}  */
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
                            message: 'Введите название города',
                        },]}
                    >
                        <Input name="title" onInput={e => setTitle(e.target.value)} value={title}/>
                    </Form.Item>
                    <Form.Item
                        label="Регион"
                        rules={[{
                            required: true,
                            message: 'Выберите регион',
                        },]}
                    >
                        <Select onChange={setRegionFK} value={regionFK}>
                            {regionsList.map(({ regionId, title }) => (
                                    <option key={regionId} value={regionId}>{title}</option>
                            ))}
                        </Select>
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
export default Settlement


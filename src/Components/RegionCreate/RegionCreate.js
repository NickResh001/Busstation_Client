import React, { useState } from 'react'
import { Form, Input, Select, Modal, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Link } from "react-router-dom"

const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

/**
 * Компонент react для добавления регионов.
 * @param {*} addSettlement метод добавления нового региона в представление.
 * @param {*} user текщуий пользователь системы.
 * @returns 
 */
const RegionCreate = ({ addRegion, user }) =>
{
    const [title, setTitle] = useState("");

    /* const handleSubmit = (e) =>
    {
        e.preventDefault()
        const title = e.target.elements.title.value
        const regionDTO =
        {
            title: title
        }
        const createRegion = async () =>
        {
            const requestOptions =
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regionDTO)
            }
            const response = await fetch("https://localhost:7082/api/Region/",
                requestOptions)
            return await response.json()
                .then((data) =>
                {
                    console.log(data)
                    // response.status === 201 && addBlog(data)
                    if (response.ok)
                    {
                        addRegion(data)
                        //e.target.elements.title.value = ""
                    }
                },
                    (error) => console.log(error)
                )
        }
        createRegion()
    } */
    
    /**
     * Метод подтверждения добавления региона. 
     */
    const buttonCreate = (e) =>
    {
        e.preventDefault()
        const title1 = title
        const regionDTO =
        {
            title: title1
        }
        /**
        * Вызов POST-запроса в Swagger.
        * @returns 
        */
        const createRegion = async () =>
        {
            const requestOptions =
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regionDTO),
            }
            const response = await fetch("api/Region/",
                requestOptions)
            return await response.json()
                .then((data) =>
                {
                    console.log(data)
                    // response.status === 201 && addBlog(data)
                    if (response.ok)
                    {
                        addRegion(data)
                        //e.target.elements.title.value = ""
                    }
                },
                    (error) => console.log(error)
                )
        }
        createRegion()
    }

    return (
        <>
            <React.Fragment>
                <h3 className='header-for-settlements'>
                    <span className='common-text'>Добавление региона</span>
                </h3>
                <Form
                    name="basic"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 16,}}
                    style={{maxWidth: 600,}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        style={{
                            marginTop: 30
                        }}
                        label="Название"
                        rules={[
                            {
                            required: true,
                            message: 'Введите название региона',
                            },
                        ]}
                    >
                        <Input name="title" onInput={e => setTitle(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button className="primary-button" type="primary" htmlType="submit" onClick={buttonCreate}>
                            Создать
                        </Button>
                    </Form.Item>
                    <Button className="link-button" type="link">
                        <Link to="/regions"><ArrowLeftOutlined /> Список регионов</Link>
                    </Button>
                </Form>
                {/* {user.userRole == "admin" ? ( 
                <>
                    <h3>Добавление нового города</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Title: </label>
                            <input type="text" name="title" placeholder="Введите название города" /><br />
                            <label>Введите название области</label>
                            <select name="regionTitle">
                                {regionsList.map(({ regionId, title }) => (
                                    <option key={regionId} value={regionId}>{title}</option>
                                ))}
                            </select><br />
                            <button type="submit">Создать</button>
                        </form>
                </>
                ):(
                    <>
                        
                    </>
                )} */}
            </React.Fragment>
        </>
        
    )
}
export default RegionCreate

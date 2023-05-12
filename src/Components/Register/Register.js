import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button, Checkbox, Form, Input } from 'antd';

const onFinish = (values) => {
    console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

/**
 * Компонент react для регистрации в системе.
 * @param {*} user текущий пользователь системы.
 * @param {*} setUser метод динамического изменения текущего пользователя системы.
 * @returns 
 */
const Register = ({ user, setUser }) => {
    const [errorMessages, setErrorMessages] = useState([])
    const navigate = useNavigate()

    /**
     * Метод регистрации в системе.
     * @param {*} event 
     * @returns 
     */
    const Register = async (event) => {
        event.preventDefault()
        var { email, password, passwordConfirm } = document.forms[0]
        // console.log(email.value, password.value)
        const requestOptions =
        {
            method: "POST",

            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
                passwordConfirm: passwordConfirm.value
            }),
        }
        return await fetch("api/account/register", requestOptions)
            .then((response) => {
                // console.log(response.status)
                if (response.status === 200)
                {
                    setUser({ isAuthenticated: true, userName: "" });
                    window.location.assign("/settlements");
                }
                return response.json()
            })
            .then(
                (data) => {
                    console.log("Data:", data)
                    if (typeof data !== "undefined" &&
                        typeof data.userName !== "undefined") {
                        setUser({ isAuthenticated: true, userName: data.userName })
                        window.location.assign("/settlements");
                    }
                    typeof data !== "undefined" && typeof data.error !== "undefined" && setErrorMessages(data.error)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    /* const renderErrorMessage = () => errorMessages.map((error, index) => <div key={index}>{error}</div>) */
    return (
        <>
            {user.isAuthenticated ? (
                <h3 className="common-text">Пользователь {user.userName} зарегистрирован в системе</h3>
            ) : (
                <>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Адрес эл. почты"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите свою почту',
                                },
                            ]}
                        >
                            <Input name="email" />
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите пароль',
                                },
                            ]}
                        >
                            <Input.Password name="password" />
                        </Form.Item>

                        <Form.Item
                            label="Повторите пароль"
                            rules={[
                                {
                                    required: true,
                                    message: 'Повторно введите пароль',
                                },
                            ]}
                        >
                            <Input.Password name="passwordConfirm" />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button onClick={Register} type="primary" className="primary-button" htmlType="submit">
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                    </Form>
                        <Button className="link-button" type="link">
                            <Link to="/login">Вход</Link>
                        </Button>
                    {/* {renderErrorMessage()} */}
                </>
            )}
        </>
    )
}
export default Register
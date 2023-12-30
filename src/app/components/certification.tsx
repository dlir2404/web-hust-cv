'use client'
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Descriptions } from 'antd';
import {
    Button,
    Modal,
    DatePicker,
    Form,
    Input,
    Checkbox,
    Radio,
    Select,
    message,
    Card,
    Popover,
    Avatar,
    Tabs,
    TabsProps
} from 'antd';
import { MoreOutlined, CheckOutlined, FireOutlined, ReadOutlined, FormOutlined, TagOutlined, EditOutlined, DeleteOutlined, UserOutlined, HomeOutlined, MoneyCollectOutlined, FieldTimeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { SelectProps, DatePickerProps } from 'antd';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '../utils/http';
import moment from 'moment'
const { RangePicker } = DatePicker;



const Certification = () => {
    const [isModalAddCerOpen,setModalAddCerOpen] = useState(false)
    const [isModalEditCerOpen, setModalEditCerOpen] = useState(false)
    const [isModalConfirmDeleteCerOpen, setModalConfirmDeleteCerOpen] = useState(false)
    const [disabledCheckboxCer, setDisabledCheckboxCer] = useState(false)
    const [deleteCer, setDeleteCer] = useState(null)
    const [editCer, setEditCer] = useState<any>({})

    const queryClient = useQueryClient()
    const certificate = useQuery({
        queryKey: ['certificate'],
        queryFn: async () => {
            const userId = await localStorage.getItem('userId');
            try {
                const response = await http.axiosClient.post('/api/profile/certificate/getAll', {personalFileId: userId})
                return response.data
            } catch (error) {

            }
        }
    })

    const addNewCerMutation = useMutation({
        mutationFn: async (values: any) => {
            const userId = await localStorage.getItem('userId');
            values.start = values.start.toISOString();
            const name = values.nameCertificate + '*/' + values.nameOrganize + '*/' + values.start
            const data = await http.axiosClient.post('/api/profile/certificate/add', {name: name, personalFileId: userId})
            return data
        },
        onSuccess: (data, variables, context) => {
            message.success('Thêm chứng chỉ thành công!')
            queryClient.invalidateQueries({ queryKey: ['certificate'] })
        },
        onError: (error: any) => {
            message.error(error.response.data.message)
        }
    })

    const deleteCerMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await http.axiosClient.delete('/api/profile/certificate/' + id)
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Xóa chứng chỉ thành công!')
            queryClient.invalidateQueries({ queryKey: ['certificate']})
        },
        onError: (error: any) => {
            message.error(error.response.data.message)
        }
    })

    const editCerMutation = useMutation({
        mutationFn: async ({ id, values }: any) => {
            values.start = values.start.toISOString();
            const name = values.nameCertificate + '*/' + values.nameOrganize + '*/' + values.start
            const response = await http.axiosClient.put('/api/profile/certificate/' + id, {name: name})
            return response
        },
        onSuccess: (data, variables, context) => {
            message.success('Cập nhật chứng chỉ thành công!')
            queryClient.invalidateQueries({ queryKey: ['certificate']})
        },
        onError: (error: any) => {
            message.error(error.response.data.message)
        }
    })

    const showModalAddCer = () => {
        setModalAddCerOpen(true);
    }
    const cancelModalAddCer = () => {
        setModalAddCerOpen(false);
    }
    const onChangeCheckBoxCer = (checked: any) => {
        // setDisabledCheckboxCer((checked))
    }
    const finishAddCer = (values: any) => {
        setModalAddCerOpen(false);
        addNewCerMutation.mutate(values);
    }

    const cancelModalConfirmDelete = () => {
        setDeleteCer(null)
        setModalConfirmDeleteCerOpen(false);
    }

    const handleDeleteCer = (idCer: any) => {
        setDeleteCer(idCer)
        setModalConfirmDeleteCerOpen(true);
    }
    const finishDeleteCer = () => {
        deleteCerMutation.mutate(deleteCer);
        cancelModalConfirmDelete();
    }
    const cancelModalEditCer = () => {
        setModalEditCerOpen(false);
    }

    const handleEditCer = (infoCer: any) => {
        setEditCer(infoCer);
        setModalEditCerOpen(true);
    }

    const finishEditCer = (values: any) => {
        let id = editCer.id
        editCerMutation.mutate({id, values});
        cancelModalEditCer();
    }
    return(
        <>
            <div>
                <div>
                    <Modal title="Thêm học vấn"
                        open={isModalAddCerOpen}
                        onCancel={cancelModalAddCer}
                        footer={null}
                    >
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={finishAddCer}
                        >
                            <Form.Item
                                label="Tên chứng chỉ"
                                name="nameCertificate"
                                rules={[{ required: true, message: 'Vui lòng nhập tên trường của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Tổ chức"
                                name="nameOrganize"
                                rules={[{ required: true, message: 'Vui lòng nhập tên trường của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Thời gian"
                                name="start"
                                rules={[{ required: true, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" className='bg-blue-600'>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
                <div>
                    <Modal title="Chú ý" 
                        open={isModalConfirmDeleteCerOpen}
                        onCancel={cancelModalConfirmDelete}
                        footer={[
                            <Button onClick={finishDeleteCer} type="primary" htmlType="submit" className='bg-red-600'>Xóa</Button>
                        ]}
                    >
                        <p>Bạn chắc chắn xóa ?</p>
                    </Modal>
                </div>
                <div>
                    {isModalEditCerOpen ? 
                    (<Modal
                        title="Sửa"
                        open={isModalEditCerOpen}
                        onCancel={cancelModalEditCer}
                        footer={null}
                    >
                        <Form
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            style={{ maxWidth: 600 }}
                            onFinish={(values :any) => finishEditCer(values)}
                        >
                            <Form.Item
                                label="Tên chứng chỉ"
                                name="nameCertificate"
                                initialValue={editCer?.name?.split('*/')[0]}
                                rules={[{ required: true, message: 'Vui lòng nhập tên dự án của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Tên tổ chức"
                                name="nameOrganize"
                                initialValue={editCer?.name?.split('*/')[1]}
                                rules={[{ required: true, message: 'Vui lòng nhập tên dự án của bạn!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Thời gian"
                                name="start"
                                initialValue={moment(editCer?.name?.split('*/')[2])}
                                rules={[{ required: true, message: 'Vui lòng chọn mốc thời gian'}]}
                            >
                                <DatePicker picker="month" />
                            </Form.Item>
                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button type="primary" htmlType="submit" className='bg-blue-600'>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>) : ''}
                </div>
                <div>
                    <Card
                        title={
                            <>
                                <p className='font-bold text-3xl'>Chứng chỉ</p>
                            </>
                        }
                        extra={
                            <>
                                <div className='mb-4 mt-2'>
                                    <a onClick={() => showModalAddCer()}><PlusCircleOutlined className='mr-4 text-2xl' /></a>
                                </div>
                            </>
                        }
                        className='w-full mb-4 border-black'
                    >
                        {certificate?.data?.map((info: any) => {
                            return (
                                <Card
                                    key={info.id}
                                    title={
                                        <>
                                            <p className='font-bold text-xl'>{info.name.split('*/')[0]}</p>
                                        </>
                                    }
                                    extra={
                                        <>
                                            <a onClick={() => handleEditCer(info)}><EditOutlined className='mr-8' /></a>
                                            <a onClick={() => handleDeleteCer(info.id)}><DeleteOutlined className='' /></a>
                                        </>
                                    }
                                >
                                    <p className='my-3 text-base'>{info.name.split('*/')[1]}</p>
                                    <p className='my-3 text-base'>{moment(info.name.split('*/')[2]).format('MM/YYYY')}</p>
                                </Card>
                            )
                        })}
                    </Card>
                </div>
            </div>
        </>
    )
}

export default Certification
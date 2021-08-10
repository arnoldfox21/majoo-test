import React from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

class Miniform extends React.Component {

  layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  render(){
    const { data, onChange } = this.props
    
    return (
      <Form {...this.layout} initialValues={{...data, createdAt: moment(data.createdAt)}} name="nest-messages" onFinish={(e)=>onChange({...e, id: data.id })}>
        {/* <Form.Item initialValues={data.id} name={['user', 'name']} label="ID" rules={[{ required: true }]}>
          <Input readOnly />
        </Form.Item> */}
        <Form.Item name={'title'} label="Title">
          <Input />
        </Form.Item>
        <Form.Item name={'description'} label="Description">
          <Input />
        </Form.Item>
        <Form.Item name={'status'} label="Status">
          <Select defaultValue={data.status} style={{ width: 120 }}>
            <Option value={1}>Done</Option>
            <Option value={0}>waiting</Option>
          </Select>
        </Form.Item>
        <Form.Item name={'createdAt'} label="Created At">
          <DatePicker />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Miniform;
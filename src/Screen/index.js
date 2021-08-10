import React from 'react';
import { Table, Button, Drawer, Divider, Typography } from 'antd';
import { get } from 'lodash';
import { MiniForm, Detail } from '../components'
import './style.css';

class toDoList extends React.Component {
  render(){
    const [s, p] = [this.state, this.props]
    // console.log(s)
    return(
      <div className="to-do-list">
        <Typography.Title level={2} type="secondary">Majoo Test</Typography.Title>
        <Button onClick={()=>this.toggle(true)} type="primary" style={{ marginBottom: 16 }}>
          Add New
        </Button>
         
        <Divider/>
        <Table 
          columns={this.columns} 
          loading={s.loading} 
          dataSource={s.data} 
          rowKey={'id'}
          // bordered
        />
        <Drawer
          placement="right"
          closable={false}
          onClose={()=>this.toggle(false)}
          width={500}
          destroyOnClose
          visible={s.visible}
        >
          <MiniForm data={get(s, 'info', {})} setLoading={this.setLoading} onChange={this.onChange} />
        </Drawer>
      </div>
    )
  }
}

export default toDoList;
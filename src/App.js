import moment from 'moment';
import { Button, message } from 'antd';
import { sortBy, cloneDeep } from 'lodash';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import toDoList from './Screen'
import './App.css';
import { RequestV2 } from './Utils';

class Majoo extends toDoList {
  constructor(p){
    super(p)
    this.state = {
      data: [],
      loading: true,
      info: {},
    }
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Title',
        dataIndex: 'title',
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (e) => {
          if(e) return 'Finish'
          return 'Not finished yet'
        }
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        render: (e) => {
          if(e) return moment(e).format('LLL')

          return ''
        }
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (e, s) => {
          return(
            <div>
              <Button 
                type="primary" 
                onClick={()=>{
                  this.setState({ info: s },()=>this.toggle(true))
                }}
                icon={<EditOutlined />} 
                size={'middle'} 
              />
              <Button 
                onClick={()=>{
                    if(s.status) return message.error('Cannot delete data with finish status')
                    this.setState(prev=>({ data: prev.data.filter(e => e.id !== s.id)}
                  ))
                }}
                type="ghost" 
                className="ml-2" 
                icon={<DeleteOutlined />} 
                size={'middle'}>
                Delete
              </Button>
            </div>
          )
        }
      }
    ];
  }

  componentDidMount() {
    this.read()
  }

  onChange=(s)=>{
    this.setLoading(true)
    const data = cloneDeep(this.state.data)
    if(s.id) {
      const i = data.findIndex(e => e.id === s.id)
      data[i] = s
    }
    else {
      const d = sortBy(data, ['id'])
      const id = d[d.length-1].id+1
      
      data.push({...s, id})
    }
    this.setState({ data, visible: false, loading: false, info: {} })
    message.success('Saved')
  }  

  toggle=(visible)=>{
    const state = { visible }
    if(!visible) state.info = {}
    this.setState(state)
  }

  setLoading=(loading)=>{
    this.setState({loading})
  }

  read=()=>{
    RequestV2(
      "get",
      'public',
      'to-do-list',
      {},
      {},
      [],
      (res)=>{
        this.setState({ data: sortBy(res.data, ['createdAt']), loading: false })
      },
      (err) => {
        console.log(err)
      }
    )
  }
}


export default Majoo;

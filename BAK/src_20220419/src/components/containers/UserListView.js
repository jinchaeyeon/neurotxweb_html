import React from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

const columns = [
  {
    title: 'id',
    dataIndex: 'username',
  },
  {
    title: 'email',
    dataIndex: 'email',
  },
  {
    title: 'joined at',
    dataIndex: 'date_joined',
  },
];

/* const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}
 */
class UserListView extends React.Component {
  state = {
    data: [],
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  componentDidMount()
  {
    axios.get("http://localhost:8000/api/v1/user/?format=json").then(res=> {
   
    var ndata = res.data.map(function(obj){ 
      var rObj = {...obj};
      rObj["key"] = obj.username;
      return rObj;
   });
    console.log(ndata);
    this.setState({
        data:ndata
      });
    })
  }
  render() {
    const { data, loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

export default UserListView;
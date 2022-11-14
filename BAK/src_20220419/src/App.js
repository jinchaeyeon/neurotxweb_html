import logo from './logo.svg';
import './App.css';
import CustomLayout from './components/containers/Layout';
import UserListView from './components/containers/UserListView';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App">
        <CustomLayout>
            <UserListView></UserListView>

        </CustomLayout>
    </div>
  );
}

export default App;

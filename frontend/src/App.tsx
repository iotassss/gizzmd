import { Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Docs from './components/Layout/Main/Docs'
import Doc from './components/Layout/Main/Doc' // Doc詳細画面の雛形としてDocCardを仮利用
import DocEdit from './components/Layout/Main/DocEdit'
import DocPreview from './components/Layout/Main/DocPreview'
import MyPage from './components/Layout/Main/MyPage'; // 必要に応じて作成
import Welcome from './components/Welcome';
import DocSearch from './components/Layout/Main/DocSearch'
import Settings from './components/Layout/Main/Settings'
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Docs />} />
          <Route path="docs/" element={<Docs />} />
          <Route path="doc/:uuid" element={<Doc />} />
          <Route path="doc/:uuid/edit" element={<DocEdit />} />
          <Route path="doc/:uuid/preview" element={<DocPreview />} />
          <Route path="doc/" element={<DocSearch />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

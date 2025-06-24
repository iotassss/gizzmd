import React from "react";
import { Link } from "react-router-dom";

const Menu: React.FC = () => (
  <nav>
    <ul>
      <li><Link to="/docs">ドキュメント一覧</Link></li>
      <li><Link to="/doc">ドキュメント詳細</Link></li>
      <li><Link to="/mypage">ユーザー設定</Link></li>
    </ul>
  </nav>
);

export default Menu;

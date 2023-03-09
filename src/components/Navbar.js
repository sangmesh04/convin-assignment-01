import { Menu } from "antd";
import { useState } from "react";
import {
  FileAddOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const items = [
  {
    label: <a href="/addCard">Add Card</a>,
    key: "add",
    icon: <FileAddOutlined />,
  },
  {
    label: <a href="/buckets">Buckets</a>,
    key: "buckets",
    icon: <FolderOpenOutlined />,
  },
  {
    label: <a href="/history">History</a>,
    key: "history",
    icon: <HistoryOutlined />,
  },
];

const Navbar = (props) => {
  const [current, setCurrent] = useState(props.current);
  const onClick = (e) => {
    console.log("click", e);
    setCurrent(e.key);
  };
  return (
    <Menu
      id="navbar"
      style={{ justifyContent: "center" }}
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Navbar;

import { Button, Input, Space, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useMyContext } from "../../hooks/useContext";
import AllowanceList from "../../components/AllowanceList";
import styles from './index.module.scss'
import EditableValue from "../../components/EditableValue";
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const Home = () => {
  const { storage, updateStorage } = useMyContext();
  const { list } = storage;
  const [activeKey, setActiveKey] = useState<string>();
  const [items, setItems] = useState<any[]>([]);
  const newTabIndex = useRef(0);
  const [value, setValue] = useState("");

  const onNameChange = (key: string, name: string) => {
    const groups = list?.groups.map((item: any) => {
      if (item?.key === key) {
        return {
          ...item,
          name
        };
      }
      return item;
    });
    updateStorage("list", {
      ...list,
      key,
      groups,
    });
  }

  useEffect(() => {
    if (list) {
      setActiveKey(list.key);
      setItems(
        list?.groups?.map((item) => ({
          label: <EditableValue value={item.name} onChange={(value) => onNameChange(item.key, value)} />,
          key: item.key,
          children: <AllowanceList key={item.key} keyId={item.key} />,
        }))
      );
    }
  }, [list]);

  const onChange = (newActiveKey: string) => {
    updateStorage("list", {
      ...list,
      key: newActiveKey,
    });
  };

  const add = () => {
    const key = `${Math.random()}+${newTabIndex.current++}`;
    updateStorage("list", {
      ...list,
      key,
      groups: [...list?.groups ?? [], { key, name: value, list: [] }],
    });
    setValue('')
  };

  const remove = (targetKey: TargetKey) => {
    updateStorage("list", {
      ...list,
      groups: list?.groups.filter((item: any) => item.key !== targetKey),
    });
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div className={styles.home}>
      <Space.Compact className={styles.search} style={{ width: "100%" }}>
        <Input
          placeholder="Input a group name to add"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button type="primary" onClick={add} disabled={!value}>
          Add
        </Button>
      </Space.Compact>
      <Tabs
        hideAdd
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    </div>
  );
};

export default Home;

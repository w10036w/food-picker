import React, { useMemo, useState } from "react";
import {
  useGetAllowanceList,
  useGetParticipants,
  useInitialGroup,
} from "../../hooks/useRequest";
import { Button, Input } from "antd";
import styles from "./index.module.scss";
import { useMyContext } from "../../hooks/useContext";
import DateSelect from "../Action";
import Table, { ColumnsType } from "antd/es/table";
import { YOU } from "../../constants";

interface Props {
  keyId: string;
}

const AllowanceList = ({ keyId }: Props) => {
  const { storage, updateStorage } = useMyContext();
  const { list } = storage;
  const [selectedRows, setSelectedRows] = useState<
    { name: string; customer_code: string }[]
  >([]);
  const userList = useMemo(() => {
    return list?.groups
      .find((item: any) => item.key === keyId)
      ?.list?.filter((item: any) => item) || [];
  }, [list]);

  const participants = useGetParticipants(userList) ?? new Map();

  const idList = useMemo(() => {
    return Array.from(participants.keys());
  }, [participants]);

  const allowanceList = useGetAllowanceList(idList);

  const onSearch = (value: string) => {
    if (!value) return;
    const groups = list?.groups.map((item: any) => {
      if (item?.key === keyId) {
        return {
          ...item,
          list: [...new Set([...(item?.list ?? []), value])],
        };
      }
      return item;
    });
    updateStorage("list", {
      ...list,
      groups,
    });
  };

  const onDelete = (key: string) => {
    const groups = list?.groups.map((item: any) => {
      if (item?.key === keyId) {
        return {
          ...item,
          list: item?.list?.filter((item: any) => item !== key),
        };
      }
      return item;
    });
    updateStorage("list", {
      ...list,
      groups,
    });
  }

  const dataSource = allowanceList?.map((item) => ({
    name: participants.get(item.customer_code)?.name ?? "You",
    key: participants.get(item.customer_code)?.key,
    ...item,
  })) ?? [];

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRows(selectedRows);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const request = useInitialGroup(selectedRows.filter(item => item.name !== YOU));

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Code",
      dataIndex: "customer_code",
    },
    {
      title: "Allowance",
      dataIndex: "allowance",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: any) => (
        <div>
          <Button disabled={record.name === YOU} type="link" onClick={() => onDelete(record.key)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <DateSelect onAdd={request} />
      <Table
        rowSelection={rowSelection}
        rowKey={"customer_code"}
        bordered
        size="small"
        columns={columns}
        dataSource={[...dataSource]}
        scroll={{ y: 300 }}
      />
      <div className={styles.footer}>
        Total Allowance{" "}
        {allowanceList?.reduce((prev, curr) => prev + curr.allowance, 0)}
        <Input.Search
          className={styles.search}
          placeholder="add participant"
          allowClear
          onSearch={onSearch}
        />
      </div>
    </div>
  );
};

export default AllowanceList;

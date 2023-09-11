import { Button, DatePicker, DatePickerProps, Tooltip } from "antd";
import React from "react";
import { useMyContext } from "../../hooks/useContext";
import dayjs from "dayjs";
import styles from "./index.module.scss";

const Action = ({ onAdd }: any) => {
  const { date, setDate, vendorCode } = useMyContext();

  const tip = `${
    vendorCode
      ? `Don't forget to select ppl you want group order with, and after page reloaded, 
  pls wait a second for the data update. 
  If page didn't update, pls try reopen this extension and refresh page`
      : "Please go to one restaurant page to make this btn enable."
  }`;

  const onOk = (value: DatePickerProps["value"]) => {
    setDate(dayjs(value));
  };
  return (
    <div className={styles.date}>
      <DatePicker
        value={date}
        showTime
        onOk={onOk}
        allowClear={false}
        format={"YYYY-MM-DD HH:mm"}
      />
      <Tooltip title={tip}>
        <Button
          disabled={!vendorCode}
          type="primary"
          className={styles.btn}
          onClick={onAdd}
        >
          Create group order
        </Button>
      </Tooltip>
    </div>
  );
};

export default Action;

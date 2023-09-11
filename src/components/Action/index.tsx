import { Button, DatePicker, DatePickerProps } from 'antd';
import React from 'react';
import { useMyContext } from '../../hooks/useContext';
import dayjs from 'dayjs';
import styles from './index.module.scss'

const Action = ({ onAdd }: any) => {
  const { date, setDate, vendorCode } = useMyContext()
  
  const onOk = (value: DatePickerProps['value']) => {
    setDate(dayjs(value))
  };
  return (
    <div className={styles.date}>
      <DatePicker value={date} showTime onOk={onOk} allowClear={false} format={'YYYY-MM-DD HH:mm'} />
      <Button disabled={!vendorCode} type='primary' className={styles.btn} onClick={onAdd}>Create group order</Button>
    </div>
  )
}

export default Action;
import React, { KeyboardEventHandler, useEffect, useState } from 'react'
import styles from './index.module.scss';
import KeyInput from '../../components/KeyInput';
import { useMyContext } from '../../hooks/useContext';
import { Button, Input } from 'antd';

const Auth = () => {
  const { updateStorage } = useMyContext();

  const onEnter: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if(event.keyCode === 13) {
      updateStorage('token', event.currentTarget.value);
    }
  }
  
  return (
    <div className={styles.container}>
      <p>Please login foodpanda and keep that tab active</p>
      <Button onClick={() => chrome.tabs.create({ url: 'https://www.foodpanda.sg' })}>Go to foodpanda</Button>
      {/* <Input placeholder='Please input your token and press enter' onPressEnter={onEnter} /> */}
    </div>
  )
}

export default Auth;
import { useEffect, useState } from "react";
import { useMyContext } from "./useContext";
import { getFromStorage } from "../utils";

export const useGetInitial = () => {
  const { updateStorage, setVendorCode } = useMyContext()
  useEffect(() => {
    (async () => {
      const token = await getFromStorage("token");
      const host = await getFromStorage("host");
      const list = await getFromStorage("list");
      updateStorage('list', list ?? {});
      if(token && host?.code) {
        updateStorage('token', token);
        updateStorage('host', host);
        return;
      }
      chrome.tabs.query({ "status": "complete" }, function (tabs) {
        const tab = tabs.find(item => item.url?.startsWith('https://www.foodpanda.sg'));
        const url = tab?.url;
        const id = tab?.id;
        if (url) {
          chrome.cookies.getAll({ url }, (cookie) => {
            const tokenValue = cookie.find(item => item.name === 'token')?.value;
            updateStorage('token', tokenValue || '');
          });
        }
        if (id && !host?.code) {
          chrome.tabs.sendMessage(id, { type: 'RECEIVE' })
          chrome.runtime.onMessage.addListener((message) => {
            const user = message.essential.user
            updateStorage('host', {
              name: `${user.firstName} ${user.lastName}`,
              code: user.code
            })
          })
        }
      });
    })()
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // since only one tab should be active and in the current window at once
      // the return variable should only have one entry
      var activeTab = tabs[0];
      const restId = /^https:\/\/www.foodpanda.sg\/restaurant\/(\w+)/.exec(activeTab.url || '')?.[1]
      if(restId){
        setVendorCode(restId)
      }
    });
  }, [])
}
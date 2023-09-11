import axios from "axios";
import { ADD_PARTICIPANTS, ALLOWANCE, GET_COLLEAGUES, GROUP_INITIATE, VENDOR } from "../constants/url";
import { useEffect, useState } from "react";
import { AllowanceRes } from "../types";
import { useMyContext } from "./useContext";

const getRequestHeaders = (token: string) => {
  return {
    'Authorization': token,
    'X-Fp-Api-Key': 'corporate',
    'X-Pd-Language-Id': '1',
  }
}

const getParticipant = async (query: string, date: string, token: string) => {
  const headers = getRequestHeaders(token)
  const { data } = await axios.get(GET_COLLEAGUES, {
    params: {
      query,
      expedition: 'delivery',
      order_time: date,
      corporate_reference_id: '120050'
    },
    headers
  });
  return data.data;
}

export const useGetParticipants = (list: string[]) => {
  const { date, storage } = useMyContext()
  const { token, host } = storage;

  const [participantMap, setParticipantMap] = useState<Map<string, any>>(new Map([
    [host?.code || '', host?.name || '']
  ]));
  useEffect(() => {
    const map = new Map();
    Promise.all(list.map(async (key) => {
      if (!token) return
      const resp = await getParticipant(key, date.format(), token);
      if (resp) {
        const participant = resp[0];
        const name = `${participant.last_name} ${participant.first_name}`
        map.set(participant.customer_code, { name, key })
        return name
      }
      return;
    })).then(() => {
      setParticipantMap(map)
    })
  }, [date, list])

  return participantMap;
}

export const useGetAllowanceList = (idList: string[]) => {
  const [list, setList] = useState<AllowanceRes[]>([])
  const { date, storage } = useMyContext()
  const { token } = storage;
  useEffect(() => {
    if (!token) return
    if (!idList.length) return
    const headers = getRequestHeaders(token)
    axios.get<{ data: AllowanceRes[] }>(ALLOWANCE, {
      params: {
        fulfilment_time: date.format(),
        participants: idList.join(','),
        vertical: 'restaurants',
        expedition_type: 'delivery',
        company_location_id: '120050'
      },
      headers
    }).then(({ data }) => {
      setList(data?.data);
    })
  }, [idList])

  return list;
}

export const useInitialGroup = (participantMap: { name: string, customer_code: string }[]) => {
  const { storage, vendorCode, date } = useMyContext()
  const { token, host } = storage;
  if (!token) return;
  const headers = getRequestHeaders(token);

  const request = async () => {
    const { data: vendorData } = await axios.get(`${VENDOR}/${vendorCode}`)
    const vendorName = vendorData?.data?.name
    const { data } = await axios.post(GROUP_INITIATE, {
      host,
      vendor: {
        name: vendorName,
        code: vendorCode
      },
      expedition_type: "delivery",
      fulfilment_time: new Date(date.format()).toISOString(),
      fulfilment_time_text: "Delivery ASAP",
      fulfilment_address: "Marina Boulevard, MBFC 3, #13-01 Singapore 018982",
      additional_parameters: {
        address: {
          "id": 31062756,
          "city_id": 1,
          "city": "Singapore",
          "city_name": null,
          "area_id": null,
          "areas": null,
          "address_line1": "Marina Boulevard, MBFC 3, #13-01",
          "address_line2": null,
          "address_line3": null,
          "address_line4": null,
          "address_line5": null,
          "address_other": "#13-01, Marina Boulevard, MBFC 3, Singapore 018982",
          "room": null,
          "flat_number": null,
          "structure": null,
          "building": "MBFC Tower 3",
          "intercom": null,
          "entrance": null,
          "floor": "#13-01",
          "district": null,
          "postcode": "018982",
          "meta": null,
          "company": "OKG",
          "longitude": 103.8544967,
          "latitude": 1.2790221,
          "is_delivery_available": true,
          "delivery_instructions": null,
          "title": null,
          "label": null,
          "formatted_customer_address": "Marina Boulevard, MBFC 3, #13-01 Singapore 018982",
          "campus": "OKG Level 13",
          "corporate_reference_id": 120050,
          "form_id": null,
          "country_code": "SG",
          "created_at": "2023-03-01T08:22:16Z",
          "updated_at": "2023-05-16T10:06:35Z",
          "location_type": "polygon",
          "object_type": "saved address",
          "type": "5",
          "phone_country_code": null,
          "phone_number": null,
          "formatted_address": null,
          "is_same_as_requested_location": null,
          "block": null
        },
        is_order_on_behalf: true
      }
    }, {
      headers
    })

    const groupOrderId = data?.data?.groupie_id;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const id = tabs?.[0].id;
    const groupOrderUrl = tabs?.[0].url;
    if (!id) return
    await chrome.tabs.sendMessage(id, { type: 'GROUP_ID', groupOrderId, groupOrderUrl })

    const reqBody = {
      groupie_id: groupOrderId,
      participants: Array.from(participantMap).map((participant) => {
        return {
          name: participant.name,
          code: participant.customer_code,
        };
      }),
    };

    await axios.post(ADD_PARTICIPANTS, reqBody, { headers })
    chrome.tabs.reload(id);
  }
  return request
}
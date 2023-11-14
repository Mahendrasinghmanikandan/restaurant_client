import { Select, Table, notification } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBookings, updateBookings } from "../api/apiHelper";
import _ from "lodash";
import moment from "moment";


const Booking = () => {
  const [bookingData, setBookingData] = useState([]);

  const fetchData = async () => {
    try {
      const result = await getBookings();
      setBookingData(_.get(result, "data.data", []));
    } catch (err) {
      notification.error({ message: "somthing went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeStatus = async (current, all) => {
    try {
      let formData = {
        id: all._id,
        table_id: all.table_id,
        status: current,
      };
      const result = await updateBookings(formData);
      notification.success({ message: result.data.message });
      fetchData();
    } catch (err) {
      notification.error({ message: "soemthing went wrong" });
    }
  };

  const getOptions = (data) => {
    let options = [
      {
        value: "Booked",
        label: "Booked",
      },
      {
        value: "Checkin",
        label: "Checkin",
      },
      {
        value: "Checkout",
        label: "Checkout",
      },
      {
        value: "Canceled",
        label: "Canceled",
      },
    ];

    switch (data) {
      case "Booked":
        return options.filter((res) => {
          return !["Booked", "Checkout"].includes(res.value);
        });
      case "Checkin":
        return options.filter((res) => {
          return !["Booked", "Checkin", "Canceled"].includes(res.value);
        });
    }
  };

  const columns = [
    {
      title: "S,No",
      dataIndex: "table_name",
      key: "table_name",
      render: (data, _, index) => {
        return <div className="capitalize">{index + 1}</div>;
      },
    },
    {
      title: "Table Name",
      dataIndex: "table_name",
      key: "table_name",
      render: (data) => {
        return <div className="capitalize">{data}</div>;
      },
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Contact Number",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render:(data)=>{
        return moment(data).format("LLLL")
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data, allData) => {
        return data === "Checkout" ? (
          <div className="px-3 py-2 bg-green-600 text-white w-fit rounded-lg">
            {data}
          </div>
        ) : data === "Canceled" ? (
          <div className="px-3 py-2 bg-red-600 text-white w-fit rounded-lg">
            {data}
          </div>
        ) : (
          <Select
            optionFilterProp="children"
            className="!w-[100px]"
            onChange={(e) => handleChangeStatus(e, allData)}
            defaultValue={data}
            options={getOptions(data)}
          />
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex py-4 px-5 justify-between ">
        <Link to="/">
          <div className="secondary_button w-fit justify-end">View Tables</div>
        </Link>
      </div>
      {/* table */}
      <Table dataSource={bookingData} columns={columns} className="pl-5" />
    </div>
  );
};

export default Booking;

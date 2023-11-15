import {
  Button,
  Drawer,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Skeleton,
  Spin,
  Upload,
  notification,
} from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useState, useEffect } from "react";
import { AiOutlineInbox, AiOutlinePlus } from "react-icons/ai";
import { storage } from "../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { createBookings, createTable } from "../api/apiHelper";
import { getTables } from "../api/apiHelper";
import _ from "lodash";
import { Link } from "react-router-dom";

const Home = () => {
  const [tables, setTables] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDrawer, setOperateDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPic, setCurrentPic] = useState("");
  const [currentTable, setCurrentTable] = useState({});
  const [filterData, setFilterData] = useState("All");
  const [form] = Form.useForm();

  const props = {
    name: "file",
    maxCount: 1,
    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
        // firebase work here
        const storageRef = ref(storage, `/files/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(
          storageRef,
          info.file.originFileObj
        );
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => console.log(err),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              let data = url;
              console.log(data);
              setCurrentPic(data);
            });
          }
        );
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleCancel = () => {
    setOpen(false);
    setCurrentPic("");
    setOperateDrawer(false);
    setCurrentTable({});
    form.resetFields();
  };

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      values.table_pic = currentPic;
      const result = await createTable(values);
      setLoading(false);
      notification.success({ message: result.data.message });
      fetchData();
      handleCancel();
    } catch (err) {
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const filterDatas = {
        types: filterData,
      };
      const result = await getTables(JSON.stringify(filterDatas));
      setTables(_.get(result, "data.data", []));
      setLoading(false);
    } catch (err) {
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterData]);

  const handleBookingFinish = async (values) => {
    try {
      setLoading(true);
      let formdata = {
        table_name: _.get(currentTable, "table_name", ""),
        table_id: _.get(currentTable, "_id", ""),
        customer_name: values.customer_name,
        contact: values.customer_contact,
      };
      const result = await createBookings(formdata);
      setLoading(false);
      notification.success({ message: result.data.message });
      fetchData();
      handleCancel();
    } catch (err) {
      console.log(err);
      setLoading(false);
      notification.error({ message: "something went wrong" });
    }
  };

  const handleDrawerClick = (status, res) => {
    if (!status) {
      setCurrentTable(res);
      setOperateDrawer(true);
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="flex py-4 px-5 justify-between ">
          <div className="flex gap-x-5">
            <div
              className="primary_button w-fit"
              onClick={() => {
                setOpen(true);
              }}
            >
              Add Tables
            </div>

            <Select
              placeholder="Select table types"
              optionFilterProp="children"
              className="!w-[100px]"
              onChange={(e) => {
                setFilterData(e);
              }}
              defaultValue={"All"}
              // onSearch={onSearch}
              // filterOption={filterOption}
              options={[
                {
                  value: "All",
                  label: "All",
                },
                {
                  value: false,
                  label: "Available",
                },
                {
                  value: true,
                  label: "Booked",
                },
              ]}
            />
          </div>
          <Link to="/bookings">
            <div className="secondary_button w-fit justify-end">
              View Bookings
            </div>
          </Link>
        </div>
        {/* tables */}
        <div className="center_div flex-wrap justify-start pl-5 gap-x-10 gap-y-10">
          {tables.map((res, index) => {
            return (
              <Skeleton
                key={index}
                loading={loading}
                active
                avatar
                className="w-[300px] h-[400px] rounded shadow-md"
              >
                <div className="w-[300px] h-[400px] rounded shadow-md">
                  <figure className="w-[300px] h-[200px] flex items-center justify-center">
                    <Image
                      className="rounded object-cover h-[200px]"
                      src={res.table_pic}
                      alt=""
                    />
                  </figure>
                  <div className="p-2 flex flex-col gap-y-2 h-[200px]">
                    <h1 className="text-lg capitalize">{res.table_name}</h1>
                    <h1>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Nulla alias cumque accusantium, sit maiores officiis
                      molestiae maxime ipsa fuga dolore.
                    </h1>
                    <div
                      onClick={() => {
                        handleDrawerClick(res.status, res);
                      }}
                      className={`${
                        res.status ? "secondary_button cursor-default" : "primary_button"
                      } w-fit px-2`}
                    >
                      {res.status ? "Booked" : "Book Now"}
                    </div>
                  </div>
                </div>
              </Skeleton>
            );
          })}
        </div>
      </div>

      <Modal
        destroyOnClose
        title="Add New Table"
        open={open}
        footer={false}
        closeIcon={false}
      >
        <Skeleton loading={loading}>
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item
              name="table_name"
              label="Table Name"
              rules={[
                {
                  required: true,
                  message: "Enter the name of the table",
                },
              ]}
            >
              <Input placeholder="Table Name" />
            </Form.Item>
            {currentPic ? (
              <Image src={currentPic} />
            ) : (
              <Form.Item
                name="table_pic"
                rules={[
                  {
                    required: true,
                    message: "Upload the table pic",
                  },
                ]}
                label="Table Pic"
              >
                <Dragger {...props} showUploadList={false}>
                  <p className="ant-upload-drag-icon  center_div">
                    <AiOutlineInbox />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single Strictly prohibited from uploading
                    company data or other banned files.
                  </p>
                </Dragger>
              </Form.Item>
            )}
            <Form.Item className="flex items-center justify-end pt-4">
              <Button onClick={handleCancel} className="secondary_button mr-2">
                Cancel
              </Button>
              <Button htmlType="submit" className="primary_button">
                Add
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </Modal>

      <Drawer
        open={openDrawer}
        width={500}
        destroyOnClose
        title={
          <div className="capitalize">
            Book {_.get(currentTable, "table_name", "")}
          </div>
        }
        closable={false}
      >
        <Skeleton loading={loading}>
          <Form layout="vertical" form={form} onFinish={handleBookingFinish}>
            <Form.Item
              name="customer_name"
              label="Your Name"
              rules={[
                {
                  required: true,
                  message: "Enter Your Name",
                },
              ]}
            >
              <Input placeholder="Your Name" />
            </Form.Item>
            <Form.Item
              name="customer_contact"
              label="Your Contact"
              rules={[
                {
                  required: true,
                  message: "Enter Your Contact",
                },
              ]}
            >
              <Input type="number" placeholder="Your Name" />
            </Form.Item>
            <Form.Item className="flex items-center justify-end pt-4">
              <Button onClick={handleCancel} className="secondary_button mr-2">
                Later
              </Button>
              <Button htmlType="submit" className="primary_button">
                Book Now
              </Button>
            </Form.Item>
          </Form>
        </Skeleton>
      </Drawer>
    </>
  );
};

export default Home;

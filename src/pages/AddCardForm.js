import Navbar from "../components/Navbar";
import { Button, Form, Input, Select, Upload, message, Spin } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import axios from "axios";

const AddCardForm = () => {
  const [prevCards, setPrevCards] = useState({});
  const [options, setOptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [mediaName, setMediaName] = useState("");
  const [update, setUpdate] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();

  const displayMessage = (msg) => {
    messageApi.info(msg);
  };

  const { Option } = Select;

  const normFile = (e) => {
    var file = e.file.name;
    var file_name_array = file.split(".");
    var file_extension = file_name_array[file_name_array.length - 1];
    if (file_extension === "mp4" || file_extension === "mkv") {
      if (Array.isArray(e)) {
        return e;
      }
      return e?.fileList;
    } else {
      displayMessage("Kindly select the file of type 'mp4' or 'mkv'");
    }
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: "${label} is required!",
  };
  /* eslint-enable no-template-curly-in-string */

  const props = {
    name: "file",
    action: "http://localhost:5000/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status === "done") {
        setMediaName(info.fileList[0].response.filename);
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/cards")
      .then((res) => {
        let arr = [];
        setPrevCards(res.data);
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          var keyv = element["id"];
          arr.push(keyv);
          // console.log("tabcontent", tabcontent);
        }
        setOptions(arr);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const onFinish = (values) => {
    options.map(async (tabs) => {
      console.log(tabs);
      await axios
        .delete(`http://localhost:8000/cards/${tabs}`)
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    });

    let newdatavalues = values.card;
    newdatavalues["id"] = new Date().valueOf();
    newdatavalues["media"] = "../../database/media/" + mediaName;
    let newCard = prevCards;
    console.log("prevcards", newCard);
    if (values.card["bucket"] === "-1") {
      let newbucketName = values.card["newBucketName"];
      let dataarr = [];
      dataarr.push(newdatavalues);
      let newbucketCard = {};
      newbucketCard["id"] = newbucketName;
      newbucketCard[newbucketName] = dataarr;
      newCard.push(newbucketCard);
    } else {
      for (let index = 0; index < newCard.length; index++) {
        const element = newCard[index];
        var keyv = element["id"];
        if (keyv === values.card["bucket"]) {
          element[keyv].push(newdatavalues);
        }
        // console.log("tabcontent", tabcontent);
      }
    }

    newCard.map(async (cardobj) => {
      await axios
        .post("http://localhost:8000/cards", cardobj)
        .then(async (res) => {})
        .catch((err) => {
          console.log(err);
        });
    });

    displayMessage("Card added successfully!");
    delay(2500);
    // window.location.reload();
  };
  const antIcon = (
    <LoadingOutlined
      id="loadingSpinner"
      style={{
        fontSize: 24,
        display: "block",
        margin: "20px auto",
      }}
      spin
    />
  );

  if (isLoading) {
    return <Spin indicator={antIcon} />;
  }
  return (
    <>
      <Navbar current="add" />
      {contextHolder}
      <Form
        id="cardform"
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
        }}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["card", "title"]}
          label="Title"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["card", "description"]}
          label="Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item
          name={["card", "bucket"]}
          label="Select bucket"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Select a bucket" allowClear>
            {options.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
            <Option value="-1">Add new</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.card
              ? prevValues.card.bucket !== currentValues.card.bucket
              : ""
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(["card", "bucket"]) === "-1" ? (
              <Form.Item
                name={["card", "newBucketName"]}
                label="New Bucket Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item
          name={["card", "media"]}
          label="Media"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload accept=".mp4, .mkv" {...props} maxCount={1}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            ...layout.wrapperCol,
            offset: 8,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddCardForm;

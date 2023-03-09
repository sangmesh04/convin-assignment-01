import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input } from "antd";
import Navbar from "../components/Navbar";

const EditCard = () => {
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const validateMessages = {
    required: "${label} is required!",
  };

  const onFinish = (values) => {
    console.log(values);
  };

  const params = useParams();
  const [card, setCard] = useState(null);
  const [newTitle, setnewTitle] = useState(null);
  const [newDescription, setnewDescription] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/cards")
      .then((res) => {
        console.log(res.data);
        res.data.map((cards) => {
          if (cards["id"] === params.bucket) {
            cards[params.bucket].map((buck) => {
              if (buck.id === params.id) {
                setCard(buck);
              }
            });
          }
        });
        console.log(card);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateCard = () => {
    if (newTitle) {
      setCard({ ...card, title: newTitle });
    }
    if (newDescription) {
      card["description"] = newDescription;
    }
    setCard(card);
    console.log(card);
  };

  return (
    <>
      <Navbar current="buckets" />
      {card ? (
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
            label="Title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              defaultValue={card.title}
              onChange={(e) => {
                setnewTitle(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea
              defaultValue={card.description}
              onChange={(e) => {
                setnewDescription(e.target.value);
              }}
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              ...layout.wrapperCol,
              offset: 8,
            }}
          >
            <Button type="primary" htmlType="submit" onClick={updateCard}>
              Update
            </Button>
          </Form.Item>
        </Form>
      ) : (
        "not found"
      )}
    </>
  );
};

export default EditCard;

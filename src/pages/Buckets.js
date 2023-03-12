import Navbar from "../components/Navbar";
import {
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  SelectOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Card,
  Image,
  Dropdown,
  Button,
  Modal,
  Form,
  Input,
  Col,
  Spin,
  Row,
  message,
} from "antd";
import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import Video from "../media/4_58480018421637475801678621281427.mkv";

const { Meta } = Card;

const Buckets = () => {
  const [activeTabKey2, setActiveTabKey2] = useState("Education");
  const [newBucket, setNewBucket] = useState("");
  const [prevCards, setPrevCards] = useState({});
  const [options, setOptions] = useState([]);
  const [tabContentList, setTabContentList] = useState({});
  const [tabList, setTabList] = useState([]);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [update, setUpdate] = useState(true);
  const [cardId, setCardId] = useState(null);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const displayMessage = (msg) => {
    messageApi.info(msg);
  };

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleOk = (e) => {
    setLoading(true);
    if (newBucket != "") {
      let newdatavalues = {};
      newdatavalues["id"] = newBucket;
      newdatavalues[newBucket] = [];
      axios
        .post("http://localhost:8000/cards", newdatavalues)
        .then(async (res) => {
          setLoading(false);
          displayMessage("New bucket created successfully!");
          setUpdate(!update);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setOpen(false);
  };
  const handleCancel = (e) => {
    setNewBucket("");
    setOpen(false);
  };
  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };

  const items = [];

  tabList.map((tab) => {
    if (tab.key !== activeTabKey2) {
      items.push({
        key: tab.key,
        label: (
          <a
            onClick={() => {
              moveCard(tab.key);
            }}
            href="#"
          >
            <SelectOutlined /> {tab.tab}
          </a>
        ),
      });
    }
  });

  let arr = [];
  let arr1 = [];
  let tabcontent = {};
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/cards")
      .then((res) => {
        setPrevCards(res.data);
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          var keyv = element["id"];
          arr1.push(keyv);
          arr.push({ key: keyv, tab: keyv });
          var tempArr = res.data[index][keyv];
          tabcontent[keyv] = tempArr;
          // console.log("tabcontent", tabcontent);
        }
        setOptions(arr1);
        let uniq = [
          ...new Map(arr.map((item) => [item["key"], item])).values(),
        ];
        if (uniq.length % 2 == 0) {
          if (
            JSON.stringify(uniq[0]) === JSON.stringify(uniq[uniq.length / 2])
          ) {
            uniq = uniq.slice(0, uniq.length / 2);
          }
        }
        setTabList(uniq);
        setTabContentList(tabcontent);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [update]);

  const deleteCard = (id, bucket) => {
    // setLoading(true);
    prevCards.map(async (tabs) => {
      await axios
        .delete(`http://localhost:8000/cards/${tabs.id}`)
        .then((res) => {
          // console.log("delete", res);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    let newbucketData = [];
    prevCards.map((cards) => {
      if (cards.id === bucket) {
        let temp = [];
        cards[bucket].map((buck) => {
          if (buck.id !== id) {
            temp.push(buck);
          }
        });
        cards[bucket] = temp;
      }
      newbucketData.push(cards);
    });

    console.log(newbucketData);
    newbucketData.map(async (cardobj) => {
      await axios
        .post("http://localhost:8000/cards", cardobj)
        .then((res) => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    });
    displayMessage("Card deleted successfully!");
    delay(2500);
    setUpdate(!update);
    // window.location.reload();
  };

  const addHistory = (card) => {
    axios
      .post("http://localhost:8000/history", card)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const moveCard = (newBucket) => {
    setLoading(true);
    if (cardId !== null) {
      prevCards.map(async (tabs) => {
        await axios
          .delete(`http://localhost:8000/cards/${tabs.id}`)
          .then((res) => {})
          .catch((err) => {
            console.log(err);
          });
      });

      let newbucketData = [];
      let currentCard = {};
      prevCards.map((cards) => {
        if (cards.id === activeTabKey2) {
          let temp = [];
          cards[activeTabKey2].map((buck) => {
            if (buck.id !== cardId) {
              temp.push(buck);
            } else {
              currentCard = buck;
            }
          });
          cards[activeTabKey2] = temp;
        }
        newbucketData.push(cards);
      });

      currentCard["bucket"] = newBucket;
      for (let index = 0; index < newbucketData.length; index++) {
        const element = newbucketData[index];
        var keyv = element["id"];
        if (keyv === newBucket) {
          element[keyv].push(currentCard);
        }
      }
      console.log(newbucketData);
      newbucketData.map(async (cardobj) => {
        await axios
          .post("http://localhost:8000/cards", cardobj)
          .then((res) => {
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      });
      setUpdate(!update);
    }
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
      <Navbar current="buckets" />
      {contextHolder}
      <Card
        style={{
          width: "80%",
          display: "block",
          margin: "20px auto",
        }}
        tabList={tabList}
        activeTabKey={activeTabKey2}
        onTabChange={onTab2Change}
        extra={
          <a onClick={showModal}>
            <FolderAddOutlined /> Add
          </a>
        }
      >
        {
          <Row gutter={8}>
            {tabContentList[activeTabKey2]
              ? tabContentList[activeTabKey2].map((card) => (
                  <Col span={8} key={card.id}>
                    <Card
                      onClick={() => {
                        setCardId(card.id);
                      }}
                      style={{
                        width: 300,
                        margin: 5,
                      }}
                      cover={
                        <>
                          <ReactPlayer
                            width="300px"
                            height="auto"
                            url={Video}
                            controls={true}
                          />
                          {/* <video
                            width="500px"
                            height="500px"
                            controls="controls"
                          >
                            <source
                              src={process.env.PUBLIC_URL + card.media}
                              type="video/mp4"
                            />
                          </video> */}
                          {/* <Image
                            // width={200}
                            onClick={() => {
                              addHistory(card);
                            }}
                            src={card.source}
                          /> */}
                        </>
                      }
                      actions={[
                        <Link to={`/buckets/edit/${card.id}/${activeTabKey2}`}>
                          <EditOutlined key="edit" />
                        </Link>,
                        <DeleteOutlined
                          onClick={() => {
                            deleteCard(card.id, activeTabKey2);
                          }}
                          key="delete"
                        />,
                        <Dropdown
                          menu={{
                            items,
                          }}
                          placement="top"
                        >
                          <Button style={{ border: "none" }}>
                            <EllipsisOutlined key="ellipsis" />
                          </Button>
                        </Dropdown>,
                      ]}
                    >
                      <Meta
                        // avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                        title={card.title}
                        description={card.description}
                      />
                    </Card>
                  </Col>
                ))
              : "Please select any bucket!"}
          </Row>
        }
      </Card>

      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            Add new bucket
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <Form>
          <Form.Item
            name={"bucketname"}
            label="Bucket Name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              value={newBucket}
              onChange={(e) => {
                setNewBucket(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Buckets;

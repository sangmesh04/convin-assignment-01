import { SelectOutlined } from "@ant-design/icons";
import { Card, Image, Col, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

const { Meta } = Card;

const History = () => {
  const [historycard, setHistoryCard] = useState([]);
  const [tabList, setTabList] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/history")
      .then((res) => {
        // console.log(res.data);
        setHistoryCard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const items = [];

  tabList.map((tab) =>
    items.push({
      key: tab.key,
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          <SelectOutlined /> {tab.tab}
        </a>
      ),
    })
  );

  let arr = [];
  useEffect(() => {
    axios
      .get("http://localhost:8000/cards")
      .then((res) => {
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          var keyv = element["id"];
          arr.push({ key: keyv, tab: keyv });
        }
        let uniq = [
          ...new Map(arr.map((item) => [item["key"], item])).values(),
        ];
        if (uniq.length % 2 === 0) {
          if (
            JSON.stringify(uniq[0]) === JSON.stringify(uniq[uniq.length / 2])
          ) {
            uniq = uniq.slice(0, uniq.length / 2);
          }
        }
        setTabList(uniq);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navbar current="history" />
      <Card
        style={{
          width: "80%",
          display: "block",
          margin: "20px auto",
        }}
      >
        {
          <Row gutter={8}>
            {historycard.length
              ? historycard.map((card) => (
                  <Col span={8} key={card.id}>
                    <Card
                      style={{
                        width: 300,
                        margin: 5,
                      }}
                      cover={
                        <>
                          {/* <video width="500px" height="500px" controls="controls">
                          <source
                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            type="video/mp4"
                          />
                        </video> */}
                          <Image
                            // width={200}
                            src={card.source}
                          />
                        </>
                      }
                    >
                      <Meta
                        // avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                        title={card.title}
                        description={card.description}
                      />
                      <br />
                      <br />
                      <i style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                        {card.lastVisited}
                      </i>
                    </Card>
                  </Col>
                ))
              : "No media in this history"}
          </Row>
        }
      </Card>
    </>
  );
};

export default History;

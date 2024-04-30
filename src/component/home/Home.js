import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
  const navigate = useNavigate();
  const [holdApi, setHoldApi] = useState([]);
  const [page, setPage] = useState(20); // track the page for infinite scroll

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    // console.log("is auth is ",isAuthenticated)
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = () => {
    axios
      .get(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=6`)
      .then((res) => {
        setHoldApi((prevData) => [...prevData, ...res.data]);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((err) => {
        console.log("error while fetching the data ", err);
      });
  };

  return (
    <div className="home">
      <h1 className="main-home-header">IMAGES VIA JSONPLACEHOLDER</h1>
      <h1 className="main-home-header">Scroll To LOADDD!!!</h1>
      <div className="home-wrapper">
        <InfiniteScroll
          dataLength={holdApi.length}
          next={fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          className="infinite"
        >
            {holdApi.map((i) => (
              <div key={i.id} className="map-api">
                <img src={i.url} alt="" className="img" />
              </div>
            ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;

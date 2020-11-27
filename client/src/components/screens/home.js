import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../../App";
import { Link } from "react-router-dom";
const Home = () => {
  //var a = 0;
  const [data, setData] = useState([]);
  const [inc, setinc] = useState(0);
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    fetch("https://instagrmbackend.herokuapp.com/post/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    setinc(inc + 1);

    fetch("https://instagrmbackend.herokuapp.com/post/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikePost = (id) => {
    setinc(inc + 1);

    fetch("https://instagrmbackend.herokuapp.com/post/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //   console.log(result)
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("https://instagrmbackend.herokuapp.com/post/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            console.log(result);
            return result;
          } else {
            console.log(item);
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletecomment = (postId, commentId) => {
    console.log("del");
    fetch("https://instagrmbackend.herokuapp.com/post/deletecomment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`https://instagrmbackend.herokuapp.com/post/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };
  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "20px" }}>
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {item.postedBy.name}
              </Link>{" "}
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
              <Link
                to={
                  item.postedBy._id !== state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
              >
                {
                  <img
                    style={{
                      float: "left",
                      height: "35px",
                      width: "30px",
                      borderRadius: "20px",
                      marginRight: "10px",
                    }}
                    src={item.postedBy.pic}
                  />
                }
              </Link>
            </h5>
            <div className="card-image">
              <img style={{ height: "65vh" }} src={item.photo} />
            </div>
            <div className="card-content">
              <i className="material-icons" style={{ color: "red" }}>
                favorite
              </i>
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unlikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6>
                {" "}
                {item.postedBy.name}: {item.title}
              </h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <>
                    <h6 key={record._id}>
                      <span style={{ fontWeight: "500" }}>
                        {record.postedBy.name}:
                        {record.postedBy._id == state._id && (
                          <i
                            onClick={() => {
                              deletecomment(item._id, record._id);
                            }}
                            className="material-icons"
                            style={{
                              float: "right",
                            }}
                            // onClick={() => deletePost(item._id)}
                          >
                            delete
                          </i>
                        )}
                      </span>{" "}
                      {record.text}
                    </h6>
                  </>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

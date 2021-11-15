import MainHeader from "../../components/MainHeader/MainHeader";
import PostsSubHeader from "../../components/PostsSubHeader/PostsSubHeader";
import Post from "../../components/Post/Post";
import CreatePost from "../../components/CreatePost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setToken, getUserInfo } from "../../store/actions";
import styled from "styled-components";
import Masonry from "react-masonry-css";
import "./masonry.css";
import { useHistory } from "react-router-dom";

const PostsPageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Posts = (props) => {
  const [posts, setPosts] = useState("");
  const [rerender, setRerender] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const tokenRedux = useSelector((state) => state.user.token);
  const getTokenSetUserAndPosts = () => {
    const tokenInLocalStorage = localStorage.getItem("motion-auth-token");
    if (tokenInLocalStorage) {
      dispatch(setToken(tokenInLocalStorage));
      dispatch(() => getUserInfo(dispatch, tokenInLocalStorage));
      const url =
        "https://motion-team-php.propulsion-learn.ch/backend/api/social/posts/";
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenInLocalStorage}`,
      });
      const config = {
        headers,
      };
      fetch(url, config)
        .then((res) => res.json())
        .then((data) => setPosts(data));
    } else {
      history.push("/");
    }
  };

  const likePost = (postId) => {
    const url = `https://motion-team-php.propulsion-learn.ch/backend/api/social/posts/toggle-like/${postId}/`;
    const headers = new Headers({
      Authorization: `Bearer ${tokenRedux}`,
    });
    const method = "POST";
    const config = {
      method,
      headers,
    };
    fetch(url, config)
      .then((res) => res.json())
      .then(() => {
        rerenderFunction();
      });
  };

  const deletePost = (postId) => {
    const url = `https://motion-team-php.propulsion-learn.ch/backend/api/social/posts/${postId}/`;
    const headers = new Headers({
      Authorization: `Bearer ${tokenRedux}`,
    });
    const method = "DELETE";
    const config = {
      method,
      headers,
    };
    fetch(url, config).then(() => rerenderFunction());
  };

  const rerenderFunction = () => {
    setRerender(!rerender);
  };

  useEffect(getTokenSetUserAndPosts, [dispatch, history, rerender]);

  const breakpointColumnsObj = {
    default: 2,
    1200: 1,
  };

  return (
    <PostsPageWrapper>
      <MainHeader />
      <PostsSubHeader />
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <CreatePost rerenderFunction={rerenderFunction} />
        {posts
          ? posts.map((post) => (
              <Post
                key={post.id}
                content={post.text_content}
                avatar={post.author.avatar}
                name={`${post.author.first_name} ${post.author.last_name}`}
                created={post.created}
                // photos={post.images[0] ? post.images : null}
                photos={post.images ? post.images : null}
                likesAmmount={post.like_count}
                likedByMe={post.is_liked_by_me}
                id={post.id}
                likePost={likePost}
                deletePost={deletePost}
                username={post.author.username}
                userID={post.author.id}
              />
            ))
          : null}
      </Masonry>
    </PostsPageWrapper>
  );
};

export default Posts;

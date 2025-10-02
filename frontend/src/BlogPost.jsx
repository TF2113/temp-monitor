import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import rehypeRaw from "rehype-raw";
import matter from "gray-matter";

const posts = import.meta.glob("./posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState({ content: "", data: {} });

  useEffect(() => {
    const fileContent = posts[`./posts/${slug}.md`];

    if (!fileContent) {
      setPost({ content: "Post not found.", data: {} });
      return;
    }

    const { content, data } = matter(fileContent || "");
    setPost({ content, data });
  }, [slug]);

  return (
    <div>
      <div className="separator"></div>

      {post.data.title ? (
        <>
          <h2>{post.data.title}</h2>
          <p>
            <em>{new Date(post.data.date).toISOString().split("T")[0]}</em>
          </p>
          <div className="blogContent">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {post.content}
          </ReactMarkdown>
          </div>
        </>
      ) : (
        <p>{post.content}</p>
      )}

      <div className="separator"></div>
    </div>
  );
}

export default BlogPost;

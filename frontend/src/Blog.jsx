import { Link } from "react-router-dom";
import matter from "gray-matter";

const posts = import.meta.glob("./posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function Blog() {
  const blogPosts = Object.entries(posts)
    .map(([filePath, fileContent]) => {
      const slug = filePath.split("/").pop().replace(".md", "");
      const { data } = matter(fileContent || "");
      return { slug, ...data };
    })
    .filter((post) => post.title && post.date);

  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="separator"></div>
      <h2 className="pageTitle">Blog</h2>
      <div className="blogList">
        {blogPosts.map((post) => (
          <div key={post.slug} style={{ marginBottom: "0.5em" }}>
            <Link to={`/blog/${post.slug}`}>
              ({post.date}) - {post.title}
            </Link>
          </div>
        ))}
      </div>

      <div className="separator"></div>
    </div>
  );
}

export default Blog;

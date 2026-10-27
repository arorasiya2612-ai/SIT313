import { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import QuestionForm from "../QuestionForm";
import ArticleForm from "../ArticleForm";

function NewPost() {
  const [postType, setPostType] = useState("Question");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [abstract, setAbstract] = useState("");
  const [articleText, setArticleText] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  // Clear all form fields when switching post type
  const handlePostTypeChange = (type) => {
    setPostType(type);
    setTitle("");
    setDescription("");
    setAbstract("");
    setArticleText("");
    setTags("");
    setMessage("");
  };

  // Validate the form and handle submission
  const handlePost = () => {
    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    let error = "";

    if (!title.trim()) {
      error = "Please enter a title.";
    } else if (tagList.length > 3) {
      error = "You can add a maximum of 3 tags.";
    } else if (
      postType === "Question" &&
      !description.trim()
    ) {
      error = "Please describe your problem.";
    } else if (
      postType === "Article" &&
      !abstract.trim()
    ) {
      error = "Please enter an abstract.";
    } else if (
      postType === "Article" &&
      !articleText.trim()
    ) {
      error = "Please enter the article text.";
    }

    if (error) {
      setMessage(error);
      window.alert(error);
      return;
    }

    const successMessage =
      `Your ${postType.toLowerCase()} has been submitted successfully!`;

    setMessage(successMessage);
    window.alert(successMessage);
  };

  return (
    <>
      <Header />

      <main className="new-post-page">
        <h1>Create a Post</h1>

        <div className="post-type-selector">
          <label>Select Post Type:</label>

          <label>
            <input
              type="radio"
              name="postType"
              value="Question"
              checked={postType === "Question"}
              onChange={() => handlePostTypeChange("Question")}
            />
            Question
          </label>

          <label>
            <input
              type="radio"
              name="postType"
              value="Article"
              checked={postType === "Article"}
              onChange={() => handlePostTypeChange("Article")}
            />
            Article
          </label>
        </div>

        {postType === "Question" && (
          <QuestionForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            tags={tags}
            setTags={setTags}
            onPost={handlePost}
            message={message}
          />
        )}

        {postType === "Article" && (
          <ArticleForm
            title={title}
            setTitle={setTitle}
            abstract={abstract}
            setAbstract={setAbstract}
            articleText={articleText}
            setArticleText={setArticleText}
            tags={tags}
            setTags={setTags}
            onPost={handlePost}
            message={message}
          />
        )}
      </main>

      <Footer />
    </>
  );
}

export default NewPost;

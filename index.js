const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let data=null;
let dbPath=path.join(__dirname,"digitalmarketing.db")

const databaseAndServerInitialization = async () => {
    try {
      data = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
  
      app.listen(3001, () => {
        console.log(`Server running at ${dbPath}`);
      });
    } catch (error) {
      console.log(`Database Error ${error.message}`);
    }
  };
  databaseAndServerInitialization();

  app.post("/blogs/", async (request, response) => {
    const { imageUrl, outerTitle, outerAuthorDate, outerDescription, innerTitle, innerDescription } = request.body;
    const addBlogsQuery = `
    INSERT INTO blogs(imageUrl, outerTitle, outerAuthorDate, outerDescription, innerTitle, innerDescription)
    VALUES(
        '${imageUrl}',
        '${outerTitle}',
        '${outerAuthorDate}',
        '${outerDescription}',
        '${innerTitle}',
        '${innerDescription}'
    )
`;    try {
        const blogAddedArray = await data.run(addBlogsQuery);
        console.log(blogAddedArray, "blog added");
        response.send("Blog added successfully");
    } catch (error) {
        console.error("Error adding blog:", error.message);
        response.status(500).send("Internal Server Error");
    }
});

app.get('/blogs/',async(request,response)=>{
  const showBlogsQuery=`
  SELECT * FROM blogs 
  `
  const showBlogsArray=await data.all(showBlogsQuery);
  console.log(showBlogsArray,'blogs array ----')
  response.send(showBlogsArray);
})
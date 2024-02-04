const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { request } = require("https");

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

app.delete('/blogs/:id/',async(request,response)=>{
  const {id}=request.params
  const deleteBlogsQuery=
  `
  DELETE FROM blogs 
  WHERE id=${id}
  `
  const deleteBlogsArr=await data.run(deleteBlogsQuery)
  response.send("Blogs deleted Successfully");
})

app.get('/blogs/:id',async(request,response)=>{
  const{id}=request.params
  const getBlogsQuery=`
  SELECT * FROM blogs 
  WHERE id=${id}
  `

  const getBlogsArr=await data.get(getBlogsQuery);
  response.send(getBlogsArr);
})

app.post('/services/', async (request, response) => {
  try {
    const {
      icon,
      serviceType,
      serviceOuterDescription,
      serviceLandingImage,
      serviceLandingHeading,
      serviceLandingPara,
      serviceCardHeading,
      serviceCardPara,
      serviceInnerHeading,
      serviceInnerPara
    } = request.body;

    const postServicesQuery = `
      INSERT INTO services(icon, serviceType, serviceOuterDescription, serviceLandingImage, serviceLandingHeading, serviceLandingPara, serviceCardHeading, serviceCardPara, serviceInnerHeading, serviceInnerPara)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await data.run(postServicesQuery, [
      icon,
      serviceType,
      serviceOuterDescription,
      serviceLandingImage,
      serviceLandingHeading,
      serviceLandingPara,
      serviceCardHeading,
      serviceCardPara,
      serviceInnerHeading,
      serviceInnerPara
    ]);

    console.log("Added successfully");
    response.send("Added Successfully");
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).send("Internal Server Error");
  }
});

app.get('/services/',async(request,response)=>{
  const getServicesQuery=`
  SELECT * FROM services
  `
  const getServicesArray=await data.all(getServicesQuery)
  response.send(getServicesArray)
})

app.get('/services/:id',async(request,response)=>{
  const {id}=request.params

  const getServiceQuery=`
  SELECT * FROM services
  WHERE id=${id}
  `
  const getServiceArray=await data.get(getServiceQuery)
  response.send(getServiceArray)
})

app.post('/contact/',async(request,response)=>{
  const{name,emailAddress,message}=request.body 

  const contactQuery=`
  INSERT INTO contact(name,emailAddress,message)
  VALUES(
    '${name}',
    '${emailAddress}',
    '${message}'
  )
  `;

  const contactArray=await data.run(contactQuery)
  console.log(contactArray)
  response.send("Contact Added Successfully")
})

app.get('/contact/',async(request,response)=>{
  const contactGetQuery=`
  select * from contact 
  `
  const contactAllArray=await data.all(contactGetQuery)
  response.send(contactAllArray);
})
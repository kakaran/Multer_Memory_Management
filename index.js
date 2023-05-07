const mongoose = require("mongoose");
const express = require("express");
const app = express();
const multer = require("multer");

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://0.0.0.0:27017/karan", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  age: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    data : Buffer,
    contentType : String,
    Name : String
  },
});

const Stuent = new mongoose.model("Student", studentSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/StudentAdd", upload.single("image"), async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const image = req.file;
    console.log(req.body, req.file);
    console.log(image);
    const studentData = await Stuent(req.body);

    if(image){
        studentData.image.data  = image.buffer;
        studentData.image.contentType = image.mimetype;
        studentData.image.Name = image.originalname;
    }

    await studentData.save();
    return res.send({message : "Data hase been Created",sucess : true, data : studentData });

  } catch (error) {
    console.log(error);
  }
});

app.listen(8000, (err) => {
  if (!err) {
    console.log("Server start 8000");
  }
});

// const createDocument = async () =>{
//     try {
//         const studentDetail = new Stuent({
//             name :"Karan Kapoor",
//             course:"BCA",
//             age : 23
//         })
//          const result  = await studentDetail.save();
//          console.log(result);
//     } catch (error) {
//       console.log(error)
//     }
// }

// createDocument();

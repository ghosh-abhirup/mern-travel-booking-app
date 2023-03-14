const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const mime = require("mime-types");
require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtsecret = process.env.SECRET_KEY;
const bucket = "travel-booking-app";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

mongoose.connect(process.env.MONGODB_URL);

// var db = mongoose.connection;

// db.on("error", () => {
//   console.log("Unable to connect to DB");
// });

// db.once("open", () => {
//   console.log("Connection successful");
// });

// s3 image upload
const uploadToS3 = async (path, originalFilename, mimetype) => {
  const client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const ext = originalFilename.split(".")[1];
  const newFileName = Date.now() + `.${ext}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFileName,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );

  return `https://${bucket}.s3.amazonaws.com/${newFileName}`;
};

app.get("/test", (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  res.json("Hello world");
});

// Registering user
app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(newUser);
  } catch (e) {
    res.status(422).json(e);
  }
});

// user login
app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtsecret,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("Password not ok");
    }
  } else {
    res.json("User not found");
  }
});

// Keep logged in
app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtsecret, {}, async (err, data) => {
      const user = await User.findById(data.id);
      res.json(user);
    });
  } else {
    res.json(null);
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// upload image
app.post("/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName,
  });

  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );

  res.json(url);
});

// Uploading files from device
const photosMiddleware = multer({ dest: "/tmp" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];

    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

// Adding new place
app.post("/places", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const {
    title,
    address,
    addedPhoto,
    desc,
    perks,
    checkIn,
    checkOut,
    guest,
    extraInfo,
    price,
  } = req.body;

  const { token } = req.cookies;

  try {
    if (token) {
      jwt.verify(token, jwtsecret, {}, async (err, data) => {
        if (err) throw err;

        const newPlace = await Place.create({
          owner: data.id,
          title,
          address,
          photos: addedPhoto,
          desc,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuest: guest,
          price,
        });

        res.json(newPlace);
      });
    }
  } catch (e) {
    res.status(422).json(e);
  }
});

// getting list of places
app.get("/places", (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtsecret, {}, async (err, data) => {
    if (err) throw err;

    const { id } = data;
    res.json(await Place.find({ owner: id }));
  });
});

// Editing existing place
app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { id } = req.params;

  res.json(await Place.findById({ _id: id }));
});

// Update
app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhoto,
    desc,
    perks,
    checkIn,
    checkOut,
    guest,
    extraInfo,
    price,
  } = req.body;

  jwt.verify(token, jwtsecret, {}, async (err, data) => {
    if (err) throw err;

    const placeDoc = await Place.findById(id);
    if (data.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhoto,
        desc,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest: guest,
        price,
      });

      await placeDoc.save();
      res.json("ok");
    }
  });
});

// get all places
app.get("/all-places", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  res.json(await Place.find());
});

// get place by id
app.get("/travel/:id", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { id } = req.params;

  res.json(await Place.findById(id));
});

// do booking
app.post("/booking", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { checkInTime, checkoutTime, numGuests, placeId, userId, totalFees } =
    req.body;

  try {
    const bookingData = await Booking.create({
      checkInDate: checkInTime,
      checkOutDate: checkoutTime,
      guest: numGuests,
      placeId,
      userId,
      totalPrice: totalFees,
    });

    res.json(bookingData);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get my bookings
app.get("/my-bookings/:id", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { id } = req.params;
  try {
    const myBookingData = await Booking.find({ userId: id });
    res.json(myBookingData);
  } catch (e) {
    res.status(422).json(e);
  }
});

// delete my booking
app.delete("/cancelBooking/:id", async (req, res) => {
  mongoose.connect(process.env.MONGODB_URL);
  const { id } = req.params;

  try {
    await Booking.deleteOne({ _id: id });
    res.json("Done");
  } catch (e) {
    res.status(422).json(e);
  }
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Listening to port 8000");
});

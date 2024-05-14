import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { createServer } from "http";  // Changed from "node:http"
import router from "./routes/index";
import { PrismaClient } from '@prisma/client';
import { Server, Socket } from "socket.io";

dotenv.config();

const app = express();
const server = createServer(app);

// init middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Connect to the database
const prisma = new PrismaClient();

// router
app.use("", router);

//socket io
export const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on("connection", (socket: Socket) => {
  socket.on('join', (data) => {
    socket.join(data)
  });
  socket.on('message', (data) => {
    io.to(data.roomId).emit('get-message', data)
  });
  socket.emit('message', 'A new client has connected');
});

// Error handling middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send("Something went wrong!");
// });

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log('Starting server...');
  try {
      await prisma.$connect();
      console.log(`Server is running on port ${port}`);
  } catch (error) {
      console.error('Error connecting to the database', error);
  }
});


export default server
import express, { Request, Response } from "express";
import mongoose, { Schema, Types } from "mongoose";
import dotenv from 'dotenv'
// import connectDB from "./config/database";
//import { specs, swaggerUi } from './swagger';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


dotenv.config();
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT

async function connectDB(): Promise<void> {
  try {
   const dbUrl = process.env.MONGO_URI || ''  
    await mongoose.connect(dbUrl);
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Database connection failed. Exiting now...', error);
    process.exit(1);
  }
}
 connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript and MongoDB!");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

interface IHobbies  {
  name: string;
  year: number;
  passionLevel: 'low' | 'medium' | 'high' | 'very-high';
}

const hobbiesSchema = new Schema<IHobbies>({
  name: { type: String, required: true },
  passionLevel: { type: String, required: true , enum: ['low', 'medium', 'high', 'very-high']},
  year: { type: Number, required: true },
});


const Hobbies = mongoose.model<IHobbies>('Hobbies', hobbiesSchema);

interface IUser {
  name: string;
  hobbies: Types.ObjectId[]; // Array of references to hobbies
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobbies' }],
});

const User = mongoose.model<IUser>('User', userSchema);


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's name
 *                 example: John Doe
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ObjectId of the hobbies associated with the user
 *                   example: 6123446b55916978982136a8
 *     responses:
 *       200:
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing the reason for the failure
 *                   example: User already exists
 */
app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, hobbies } = req.body;
    // Check if the email already exists
    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, hobbies });
    res.json(user);
  
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Failed to create user' });
  }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with their associated hobbies
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response with an array of users and their associated hobbies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserWithHobbies'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing the reason for the failure
 *                   example: Failed to fetch users
 */
app.get('/users', async (_: Request, res: Response) => {
  try {
    const users = await User.find().populate('hobbies');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a specific user by their ID along with their associated hobbies
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *         example: 61234c6f55916978982135ab
 *     responses:
 *       200:
 *         description: Successful response with the user details and associated hobbies
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserWithHobbies'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating that the user was not found
 *                   example: User not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message describing the reason for the failure
 *                   example: Failed to fetch the user
 */
app.get('/users/:userId', async (req: Request, res: Response) => {
  try {
     console.log("user", req.params.userId)
    const user = await User.findById(req.params.userId).populate('hobbies');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the user' });
  }
});


app.post('/users/:userId/hobbies', async (req: Request, res: Response) => {
  try {
    const { name, year, passionLevel } = req.body;
    const user = await User.findById(req.params.userId);
    console.log(name)
    console.log(year)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newHobby: IHobbies = { name, year, passionLevel };
    console.log(user)
    const hobby = await Hobbies.create(newHobby);

    user.hobbies.push(hobby._id); // Add the ObjectId of the new hobby to the user's hobbies array

    // Save the updated user object
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Failed to add hobby' });
  }
});

app.put('/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the user' });
  }
});

app.delete('/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the user' });
  }
});


app.post('/hobbies', async (req: Request, res: Response) => {
  try {
    const hobby = await Hobbies.create(req.body);
    res.json(hobby);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create hobby' });
  }
});

// Read all hobbies
app.get('/hobbies', async (_: Request, res: Response) => {
  try {
    const hobbies = await Hobbies.find();
    res.json(hobbies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hobbies' });
  }
});

// Read a specific hobby by ID
app.get('/hobbies/:hobbyId', async (req: Request, res: Response) => {
  try {
    const hobby = await Hobbies.findById(req.params.hobbyId);
    if (!hobby) {
      return res.status(404).json({ error: 'Hobby not found' });
    }
    res.json(hobby);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the hobby' });
  }
});

// Delete a hobby by ID
app.delete('/hobbies/:hobbyId', async (req: Request, res: Response) => {
  try {
    const hobby = await Hobbies.findByIdAndDelete(req.params.hobbyId);
    if (!hobby) {
      return res.status(404).json({ error: 'Hobby not found' });
    }
    res.json({ message: 'Hobby deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the hobby' });
  }
});




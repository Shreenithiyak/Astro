import express from 'express'
import { DashBoardInfo, handel, handeller, getAllUsers, getUserById, updateUser, deleteUser, getCurrentUser } from '../condroller/jwtcontroller.js'
import { checkToken } from '../middleware/jwtmid.js'


const routes =express.Router()

routes.post("/register",handel)
routes.post("/login",handeller)
routes.get('/dashboard',checkToken,DashBoardInfo)
routes.get('/me',checkToken,getCurrentUser)

// CRUD Operations
routes.get("/users", checkToken, getAllUsers)
routes.get("/users/:id", checkToken, getUserById)
routes.put("/users/:id", checkToken, updateUser)
routes.delete("/users/:id", checkToken, deleteUser)


export default routes
//http://localhost:5000/api/webtoken/insert
//http://localhost:5000/api/webtoken/login
//http://localhost:5000/api/webtoken/dashboard


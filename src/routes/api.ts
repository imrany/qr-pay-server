import express from "express"
import { getUser, deleteUser, getUsers, loginUser, protectUser, registerUser, updateUser } from "../controllers/user"
const router=express.Router()

router.post("/auth/sign_up",registerUser)
router.post("/auth/sign_in",loginUser)
router.get("/users/:phone_number",protectUser,getUser)
// router.get("/users",protectUser,getUsers)
router.patch("/users/:phone_number",protectUser,updateUser)
router.delete("/users/:phone_number",protectUser,deleteUser)

export default router

import express from "express"
import { getUser, deleteUser, getUsers, loginUser, protectUser, registerUser, updateUser } from "../controllers/user"
const router=express.Router()

router.post("/auth/register",registerUser)
router.post("/auth/login",loginUser)
router.get("/accounts/:phone_number",protectUser,getUser)
// router.get("/accounts",protectUser,getUsers)
router.patch("/accounts/:phone_number",protectUser,updateUser)
router.delete("/accounts/:phone_number",protectUser,deleteUser)

export default router

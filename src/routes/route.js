const express= require("express")
const router = express.Router()
const AuthorController=require ("../controllers/authorController")
const BlogController=require ("../controllers/blogsController")

const mid=require("../middleware/auth")



router.post ("/authors",AuthorController.createAuthor)
router.post ("/blog",mid.authentication,BlogController.createBlog)
router.get("/getBlogsData",mid.authentication ,BlogController.getblogs)
router.put("/updateBlogsData",mid.authentication,mid.authorization ,BlogController.updateBlog)
router.delete("/deleteBlog",mid.authentication,mid.authorization ,BlogController.deleteUser)
router.delete("/deleteSpecific",mid.authentication,mid.authorization ,BlogController.deleteSpecificItem)

router.post("/login",AuthorController.login)


module.exports=router;
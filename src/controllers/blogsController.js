const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const { send } = require("express/lib/response")

//CREATEBLOG-
const createBlog = async function (req, res) {
    try {
        let authorId = req.body.authorId
        let data = req.body

        if (!authorId) return res.send('The request is not valid as the author details are required.')

        let author = await authorModel.findById(authorId)
        if (!author) return res.send('The request is not valid as no author is present with  given author id')

        let createdBlog = await blogModel.create(data)
        res.send({ data: createdBlog })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

//GETBLOG-

const getblogs = async function (req, res) {

    try {
        if (req.query.category || req.query.authorId || req.query.tags || req.query.subcategory) {
            let obj = {};
            if (req.query.category) {
                obj.category = req.query.category
            }
            if (req.query.authorId) {
                obj.authorId = req.query.authorId;
            }
            if (req.query.tags) {
                obj.tags = req.query.tags
            }
            if (req.query.subcategory) {
                obj.subcategory = req.query.subcategory
            }
            // obj.isDeleted = false
            // obj.isPublished = true
            let data = await blogModel.find(obj).populate("authorId")
            // res.send(data)
            if (data.length == 0) {
                return res.status(404).send({ status: false, msg: "no blogs " });
            } else {
                res.status(200).send({ status: true, message: "Successfully fetched all blogs", data: data })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



//UPDATEBLOG-

const updateBlog = async function (req, res) {

    try {
        let blogId = req.query.blogId;
        let blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exists" });
        }
        let updatedBlog = await blogModel.updateMany({ _id: blogId }, {
            title: req.body.title, body: req.body.body, tags: req.body.tags, isPublished: true,
            publishedAt: Date.now(), subCategory: req.body.subCategory
        }, { new: true })

        res.status(200).send({ status: true, data: updatedBlog });
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

//DELETEBLOG-

const deleteUser = async function (req, res) {

    try {
        let blogId = req.query.blogId;
        let blog = await blogModel.findById(blogId);

        if (!blog) {
            res.status(401).send("No such blog exists");
        }
        let deletedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true } });
        return res.status(201).send({ status: true, data: deletedBlog });
    }

    catch (err) { res.status(500).send({ msg: "Error", error: err.message }) }
};


const deleteSpecificItem = async function (req, res) {
    try {
        category = req.query.category 
        authorId=req.query.authorId
        tags=req.query.tags
        subcategory=req.query.subcategory
        if (category || authorId || tags || subcategory) {

                let b = {};
                if (category) {
                    b.category = req.query.category
                }
                if (authorId) {
                    b.authorId = req.query.authorId;
                }
                if (tags) {
                    b.tags = req.query.tags
                }
                if (subcategory) {
                    b.subcategory = req.query.subcategory
                }
                if (published) {
                    b.isPublished = req.query.isPublished
                }
                let result = await blogModel.findOne(b);

                if (result[0].authorId == req.query.authorId) {
                    let deleteData = await blogModel.updateMany({isDeleted:false}, { isDeleted: true,deletedAt: new Date() });
                    if (deleteData) {
                        res.status(200).send({ status: true, msg: "Blog has been deleted" });
                    } else {
                        res.status(404).send({ status: false, msg: "No such blog exist" });
                    }
                } else {
                    res.status(404).send({ status: false, msg: "You are not a valid author to delete this blog according to conditions mentioned" })
                }

                } 
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Something went wrong", Error: err });
    }
}



module.exports.updateBlog = updateBlog
module.exports.deleteUser = deleteUser
module.exports.createBlog = createBlog
module.exports.getblogs = getblogs
module.exports.deleteSpecificItem=deleteSpecificItem
const AuthorModel = require("../models/authorModel")
const emailValidator = require('express-validator')
const jwt=require('jsonwebtoken');


const createAuthor = async function (req, res) {
    try {
        let author = req.body
        const { email } = req.body

        const verifyEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(author.email)) ? true : false

        if (!verifyEmail) {
            return res.status(400).send({ msg: "email not valid" })
        } else {
            let authorCreated = await AuthorModel.create(author)
            res.status(200).send({ data: authorCreated })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



const login=async function(req,res){
    try{

        let email = req.body.email;
        let password=req.body.password;
        let author= await AuthorModel.findOne({email:email,password:password})

        if(!author){
            return res.status(404).send("email and password not correct")
        }

        let token = jwt.sign({authorId:author._id.toString()},"tujliman");
        res.setHeader("x-api-key",token)
        // res.status(200).send(token)
        res.status(200).send({status:"author logged in",token:token})

    }catch(err){
        return res.status(500).send({msg:err.message})
    }

}

module.exports.createAuthor = createAuthor
module.exports.login=login
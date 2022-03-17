const jwt = require("jsonwebtoken");


const authentication=async function (req,res,next) {
    try{
        let token=req.headers["x-api-key"];
        if(!token){
            return res.send("token is not present")
        }
        else {
            let decodedtoken= jwt.verify(token, "tujliman")
            console.log(decodedtoken.authorId)
            if (!decodedtoken) return res.status(401).send({status: false, msg: "token is invalid"})
            next();
        }

    }catch(err){
        return res.status(500).send(err.message)
    }
  }

const authorization=async function (req,res,next) {
    try{

        let token = req.headers['x-api-key'];
        if(!token){
            return res.status(404).send("token is not correct");
        }

        let decodeToken = jwt.verify(token,"tujliman")
        let aID= req.query.authorId;
        let dID = decodeToken.authorId;
        if(aID != dID){
            return res.status(402).send("author not allowed")
        }
        else{
            next();
        }
    }catch(err){
        return res.status(500).send({msg:err.message})
    }
  }

  module.exports.authentication=authentication;
  module.exports.authorization=authorization
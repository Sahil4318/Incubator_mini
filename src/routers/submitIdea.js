const express = require('express')
const submitIdea = require('../models/submitIdea')
const auth = require('../middleware/auth')
const multer=require('multer');
const router = new express.Router()


router.post('/submitIdea', auth , async (req,res) =>{
    const {email , groupName , leaderName, synopsis , abstract } =req.body;
    if(!email || !groupName || !leaderName || !abstract)
    {
        return res.status(422).json({error: "Please add all the fields"});
    }
    const submitidea= new submitIdea({
        email,
        groupName,
        leaderName,
        abstract,
        synopsis,
        owner:req.stu._id
    })
    submitidea.save().then(result => {
        res.json({submitidea: result})
    }) .catch(error => {
        console.log(error)
    })

})

router.get('/allideas' ,async (req,res) =>{
    try{
        const submitidea= await submitIdea.find().populate('owner');
        res.send(submitidea);
    }catch(e)
    {
        res.status(404).send(e);
    }
})

router.get('/getmyidea' ,auth ,async(req,res) =>{
    try{
       const submitidea= await submitIdea.find({owner: req.stu.id}).populate('owner');
       res.send(submitidea)
    }catch(e)
    {
        res.status(404).send(e);
    }
})
router.patch('/updatemyidea', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['groupName', 'email', 'leaderName', 'synopsis', 'abstract']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try{
        //const tasks=await task.findById(req.params.id);
        const submitidea=await submitIdea.findOne({ owner:req.stu._id});
        //const tasks= await task.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true })
        
        if(!submitidea)
        {
            return res.status(404).send();
        }


        updates.forEach((update) => submitidea[update]=req.body[update])

        await submitidea.save();
        res.send(submitidea);
    }catch(e)
    {
        res.status(400).send(e);
    }
})

router.delete('/deleteidea', auth , async(req,res) =>{
    try{
        await submitIdea.deleteOne({owner:req.stu._id});
        res.send();
    } catch(e)
    {
        res.status(400).send(e);
    }

})

module.exports = router

// const upload=multer({
//     limits:{
//         fileSize:10000000
//     },
//     fileFilter(req ,file ,cb)
//     {
//         if(!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/))
//         {
//             return cb(new Error('Please Upload An Image'))
//         }

//         cb(undefined, true);
//     }
// })

// router.post('/submitIdea', auth ,upload.single('synopsis'),async (req ,res) =>{
//         const submitidea=new submitIdea({
//             owner: req.stu._id,
//             synopsis: req.file.buffer,
//             email: req.body.email,
//             groupName: req.body.groupName,
//             leaderName:req.body.leaderName,
//             abstract:req.body.abstract,
            
//         })

//         await submitidea.save();
//         res.send();
// },(error ,req,res,next) =>{
//     res.status(400).send({error: error.message})
// })

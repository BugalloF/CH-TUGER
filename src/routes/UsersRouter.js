const { Router } = require('express');
const {Client,Booking} = require('../db.js');
const router = Router();
// cONSULTO USUARIOS, TODOS VIENEN CON LAS RESERVAS QUE HICIERON
router.get('/',async(req,res,next)=>{
    try {
        let allUsers= await Client.findAll({
            include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }]
        })

        res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
})
// Detalle de usuario específico.
router.get('/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
        let allUsers= await Client.findAll({
            where:{id},
            include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }]
        })

        res.status(200).json(allUsers)
    } catch (error) {
        next(error)
    }
})

router.post('/',async(req,res,next)=>{
    try {
        const {name,email,phone}=req.body
        let register={
            name,
            email,
            phone
        }
        await Client.create(register)
        res.status(200).json(register)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
        let find= await Client.findByPk(id)
        await find.destroy()
        res.status(204).send('Deleted')
    } catch (error) {
        next(error)
    }
})

module.exports=router
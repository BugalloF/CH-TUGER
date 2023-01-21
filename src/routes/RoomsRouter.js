const { Router } = require('express');
const {Room,Booking} = require('../db.js');
const router = Router();
const {Op} = require("sequelize");
const {check_availability,check_date} = require('../utils/checkdate')
router.get('/',async(req,res,next)=>{
    try {
        const {enter,exit,beds,has_fridge,bathrooms} = req.query
        // Está consultando los cuartos disponibles según fecha o simplemente los cuartos en general?
        if(enter && exit){
            if (check_date(enter,exit)== false) return res.status(400).send(`Bad request. Check your entry and exit date...`)
            
            if(beds && has_fridge && bathrooms){
                var allRooms= await Room.findAll({ 
                    where:{bathrooms,has_fridge,beds},
                    include:[{
                    model:Booking,
                    attributes:['arrival_date','departure_date','status']
                }],

            })
            }
            else{
                var allRooms= await Room.findAll({ include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }],

        })}
            
      
            // Verifico que la brecha de entrada y salida no concuerde con alguna de las reservas previas de la habitación En caso de que la reserva tenga estatus eliminada también estaría disponible para reservar.
            let check_entry= allRooms.map(el=>{
                if (el.bookings.length>0){
                    return el.bookings.map(element=>{
                        
                        if (check_availability(element.arrival_date,element.departure_date,enter) == true || element.status == 'Eliminated'){
                            return el
                        }
                        else return 0
                    })
                }
                else return el
            })
    
            let check_exit= allRooms.map(el=>{
                if (el.bookings.length>0){
                    return el.bookings.map(element=>{
                        
                        if (check_availability(element.arrival_date,element.departure_date,exit ) == true || element.status == 'Eliminated'){
                            return el
                        }
                        else return 0
                    })
                }
                else return el
            })
            let check= check_entry.map((el,index)=>{
                console.log(el);
                if(el[0] == check_exit[index][0] && el !== 0) return el
                else return 0
            })
            console.log(check);
    
            let availability=check.filter(el=>el!=0)
       
            if(availability.length == 0) return res.status(200).send('No rooms available with this filters...')
            res.status(200).json(availability)
        }
        else{
            // Si no hay query de enter y exit, entonces simlpemente devuelvo todos los cuartos.
            var all= await Room.findAll({ 
                include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }],

        })
        res.status(200).json(all)
        }

    } catch (error) {
        next(error)
    }
})

router.get('/availability/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
        // Brecha en la cual se consulta disponibilidad
        const {enter,exit} = req.query
        if (check_date(enter,exit)== false) return res.status(400).send(`Bad request. Check your entry and exit date...`)

        // Busco el cuarto a reservar. Incluyo las reservas que tiene éste previamente
        let room_to_book= await Room.findAll({
            where:{
                id,
            },
            include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }]
        })
        // Verifico que la brecha de entrada y salida no concuerde con alguna de las reservas previas de la habitación
        let check_entry= room_to_book.map(el=>{
            // console.log(check_availability(el.bookings[0].arrival_date,el.bookings[0].departure_date,enter),'logg');
            if (check_availability(el.bookings[0].arrival_date,el.bookings[0].departure_date,enter) == true){
                return el
            }
            else return 0
        })

        let check_exit=room_to_book.map(el=>{
            if (check_availability(el.bookings[0].arrival_date,el.bookings[0].departure_date,exit) == true){
                return el
            }
            else return 0
        })
        
        if(check_exit.includes(0) || check_entry.includes(0)) return res.status(400).send(`This room it's already booked on this date.`)
        res.status(200).json(room_to_book)
    } catch (error) {
        next(error)
    }
})

router.get('/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
   
        let room= await Room.findAll({
            where:{
                id,
            },
            include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }]
        })


        res.status(200).json(room)
    } catch (error) {
        next(error)
    }
})



router.post('/',async(req,res,next)=>{
    try {
        const {beds,bathrooms,has_fridge}=req.body
        let register={
            beds,
            bathrooms,
            has_fridge
        }
        await Room.create(register)
        res.status(200).json(register)
    } catch (error) {
        next(error)
    }
})

router.put('/:id',async(req,res,next)=>{
    try {
        const {beds,bathrooms,has_fridge}=req.body
        const {id} = req.params
        let newData={
            beds,
            bathrooms,
            has_fridge
        }
        let found=await Room.findByPk(id)

        let updated= await found.update(newData)

        res.status(200).json(updated)
    } catch (error) {
        next(error)
    }
})


router.delete('/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
        let find= await Room.findByPk(id)
        await find.destroy()
        res.status(204).send('Deleted')
    } catch (error) {
        next(error)
    }
})
module.exports=router
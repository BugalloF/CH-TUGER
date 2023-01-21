const { Router } = require('express');
const {Booking,Room,Client} = require('../db.js');
const router = Router();
const {check_availability,check_date} = require('../utils/checkdate')
router.get('/',async(req,res,next)=>{
    try {
        //Podemos filtrar por estado de reserva
        const {status} = req.query
        if(status){
        var allBooks= await Booking.findAll({
            where:{status},    
            include:[
                {
                    model:Client,
                    attributes:['name','email'],
                
                },
                {
                    model:Room,
                    attributes:['beds','bathrooms','has_fridge']
                }
            ]
            })    
        }
        else{
            //o ver todas
        var allBooks= await Booking.findAll({
                include:[
                {
                    model:Client,
                    attributes:['name','email'],
                
                },
                {
                    model:Room,
                    attributes:['beds','bathrooms','has_fridge']
                }
            ]
            })

        }

        res.status(200).json(allBooks)

    } catch (error) {
        next(error)
    }
})

router.post('/',async(req,res,next)=>{
    try {
        const {status,payment,amount,arrival_date,departure_date,client_id,roomId}=req.body
        // Las reservas sólo pueden tener 3 estados
        if(status !== 'Pending' && status!== 'Paid' && status !== 'Eliminated') return res.status(400).send('Invalid status. (Options are: Pending,Paid OR Eliminated)')
        //Chequeo que las fechas sean posibles
        if (check_date(arrival_date,departure_date)== false) return res.status(400).send(`Bad request. Check your entry and exit date...`)
        
        let room_to_book= await Room.findAll({
            where:{
                id:roomId,
            },
            include:[{
                model:Booking,
                attributes:['arrival_date','departure_date','status']
            }]
        })

        // SI el cuarto tiene reservas busca que la nueva no esté dentro de la brecha de las ya reservadas
        if(room_to_book[0].bookings.length>0){
            let check_entry= room_to_book[0].bookings.map(el=>{
                // La función check_availability chequea que una fecha no caiga en una brecha que ya esté reservada.
                if (check_availability(el.arrival_date,el.departure_date,arrival_date) == true){
                    return el
                }
                else return 0
            })
    
            let check_exit=room_to_book[0].bookings.map(el=>{
                if (check_availability(el.arrival_date,el.departure_date,departure_date) == true){
                    return el
                }
                else return 0
            })
            // Si hay un 0 en alguno de los arrays es porque o la fecha de entrada o la de salida de la nueva reserva cae dentro de otra.
            if(check_exit.includes(0) || check_entry.includes(0)) return res.status(400).send(`This room it's already booked on this date.`)

        }

        let register={
            status,
            payment,
            amount,
            arrival_date,
            departure_date
        }
        let booker= await Client.findByPk(client_id)
        let book= await Booking.create(register)
        let room_booked=await Room.findByPk(roomId)
        await booker.addBooking(book)
        await room_booked.addBooking(book)


        res.status(200).send('Room booked succesfully!')
    } catch (error) {
        next(error)
    }
})

// Esta ruta se usaría para actualizar el método de pago y el estado de la reserva, ya que para cambiar la fecha de reserva se debería hacer una nueva.
router.put('/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
        const {payment,status} = req.body
        let book= await Booking.findByPk(id)

        const newData={
            payment,
            status
        }
        let renew= await book.update(newData)
        res.status(200).json(renew)

    } catch (error) {
        next(error)
    }
})


router.delete('/:id',async(req,res,next)=>{
    try {
        const {id} = req.params
        let find= await Booking.findByPk(id)
        await find.destroy()
        res.status(204).send('Deleted')
    } catch (error) {
        next(error)
    }
})

module.exports=router
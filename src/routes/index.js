const { Router } = require('express');
const usersRouter= require('./UsersRouter')
const roomsRouter= require('./RoomsRouter')
const bookingsRouter= require('./BookingRouter')
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/clients',usersRouter)
router.use('/rooms',roomsRouter)
router.use('/booking',bookingsRouter)
module.exports = router;

const Reserva = require('../models/Reserva');

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
    const { name, telephone, participants, email, date, time } = req.body;

    // Validaciones
    if (!name || !telephone || !participants || !email || !date || !time) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validación del nombre (mínimo 6 caracteres, sin números ni símbolos)
    const namePattern = /^[a-zA-Z\s]{6,}$/;
    if (!namePattern.test(name)) {
        return res.status(400).json({ error: 'El nombre debe tener al menos 6 caracteres y no debe contener números o símbolos.' });
    }

    // Validación del teléfono (debe ser numérico y tener al menos 7 dígitos)
    const phonePattern = /^\d{7,}$/;
    if (!phonePattern.test(telephone)) {
        return res.status(400).json({ error: 'El teléfono debe ser numérico y tener al menos 7 dígitos.' });
    }

    // Validación de participantes (debe ser un número mayor a 0)
    if (typeof participants !== 'number' || participants <= 0) {
        return res.status(400).json({ error: 'El número de participantes debe ser mayor a 0.' });
    }

    // Validación de la fecha (debe ser una fecha válida en formato YYYY-MM-DD)
    if (!Date.parse(date)) {
        return res.status(400).json({ error: 'La fecha proporcionada no es válida.' });
    }

    // Validación de la hora (debe estar en formato HH:mm)
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(time)) {
        return res.status(400).json({ error: 'La hora debe estar en formato HH:mm.' });
    }

    try {
        // Verificar si ya existe una reserva para la misma fecha y hora
        const reservaExistente = await Reserva.findOne({ date, time });
        if (reservaExistente) {
            return res.status(400).json({ error: 'Ya existe una reserva para la misma fecha y hora' });
        }

        // Crear nueva reserva
        const nuevaReserva = new Reserva({
            name,
            telephone,
            participants,
            email,
            date,
            time
        });

        // Guardar la reserva en la base de datos
        const reservaGuardada = await nuevaReserva.save();
        res.status(201).json(reservaGuardada);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la reserva' });
    }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find();
        res.status(200).json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

// Eliminar una reserva
exports.eliminarReserva = async (req, res) => {
    const { id } = req.params;

    try {
        const reservaEliminada = await Reserva.findByIdAndDelete(id);
        if (!reservaEliminada) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(200).json({ message: 'Reserva eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};

// Editar una reserva
exports.editarReserva = async (req, res) => {
    const { id } = req.params;
    const { date, hora, participants } = req.body;

    // Verificar que al menos uno de los campos editables esté presente
    if (!date && !hora && !participants) {
        return res.status(400).json({ error: 'Debe proporcionar al menos uno de los campos: fecha, hora, o cantidad de comensales' });
    }

    try {
        // Buscar la reserva por ID
        const reserva = await Reserva.findById(id);
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        // Actualizar solo los campos permitidos
        if (date) reserva.date = date;
        if (hora) reserva.hora = hora;
        if (participants) reserva.participants = participants;

        // Verificar si la nueva fecha y hora ya están ocupadas
        const reservaExistente = await Reserva.findOne({ date: reserva.date, hora: reserva.hora });
        if (reservaExistente && reservaExistente._id.toString() !== id) {
            return res.status(400).json({ error: 'Ya existe una reserva para la misma fecha y hora' });
        }

        // Guardar los cambios
        const reservaActualizada = await reserva.save();
        res.status(200).json(reservaActualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};

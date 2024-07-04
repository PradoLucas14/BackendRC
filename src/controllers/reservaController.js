const Reserva = require('../models/Reserva');

// Crear una nueva reserva
exports.crearReserva = async (req, res) => {
    const { name, telephone, participants, email, date, hora } = req.body;

    if (!name || !telephone || !participants || !email || !date || !hora) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si ya existe una reserva para la misma fecha y hora
        const reservaExistente = await Reserva.findOne({ date, hora });
        if (reservaExistente) {
            return res.status(400).json({ error: 'Ya existe una reserva para la misma fecha y hora' });
        }

        const nuevaReserva = new Reserva({
            name,
            telephone,
            participants,
            email,
            date,
            hora
        });

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
